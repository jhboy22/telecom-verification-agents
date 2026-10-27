// UserPromptSubmit: route a request by chat command (#analyze #testroom #learn #direct #all) and work keywords.
// Modes (#testroom / #analyze) are remembered per session in board/.mode/<session_id>.
// ponytail: keyword matching also catches small talk -> the injected text says "ignore if not a work request".
const fs = require('fs');
const path = require('path');

const CMD = {
  learn: /(?:^|\n)\s*#learn\b/i,
  all: /(?:^|\n)\s*#all\b/i,
  direct: /(?:^|\n)\s*#direct\b/i,
  exam: /(?:^|\n)\s*#testroom\b/i,
  analysis: /(?:^|\n)\s*#analyze\b/i,
};
// [skill, member number, keywords]. Earlier rows win. A hook cannot run a skill, so it tells the model to call it.
const SKILLS = [
  ['team-lead', 9, /as a team|full analysis|procedure|rollback|install step/i],
  ['log-triage', 7, /log analysis|timeline|cause code|why .*fail|fault/i],
  ['pcap-analysis', 7, /pcap|N4 flow|NGAP sequence|PFCP|packet/i],
  ['tc-writer', 4, /\bTC\b|test case|pass\/fail|judg|test result/i],
  ['3gpp-cite', 1, /spec basis|3GPP|TS \d{2}\.\d{3}|clause/i],
  ['verified-findings', 2, /vendor answer|seen before|past case|verified|recur/i],
  ['evidence-request-checklist', 8, /what (should|to) collect|evidence|which commands/i],
  ['log-sanitizer', 8, /mask|sensitive|sanitiz/i],
];
const MEMBER = { 1: 'standards researcher', 2: 'knowledge librarian', 3: 'mail analyst', 4: 'TC designer', 5: 'material manager', 6: 'skill scout', 7: 'call-flow analyst', 8: 'procedure writer', 9: 'team lead' };
const matchSkills = (prompt) => SKILLS.filter(([, , re]) => re.test(prompt));
const skillHint = (prompt) => {
  const m = matchSkills(prompt).slice(0, 4);
  if (!m.length) return '';
  return `[skills] Matching skills: ${m.map(([s, n]) => `${s} (${n} ${MEMBER[n]})`).join(', ')}. Call them with the Skill tool before answering (skip any already called in this chat). `;
};
const OPERATOR_TEST = /(operator|customer).{0,20}(test|retest).{0,12}(request|please|asked)/i;
const NEW_INPUT = /change note|new package|new feature|reproduce|expected call ?flow/i;
const DIRECT = /judg|result|continue|next case|here is the log/i;

const MODE_TEXT = {
  exam: '[testroom mode] No subagents, no card folder. The main session does TC design and judgment only, calling tc-writer directly after reading member 4 and 9 lines in board/error-ledger.md. If a new input document arrives, ask once: "switch to #analyze?"',
  analysis: '[analyze mode] Use team-lead and dispatch the full team: step 1 members 1, 2, 5 in one message, step 2 members 4 and 7 in one message. Conclusion first; cards under 20 lines.',
};

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let input = {};
  try { input = JSON.parse(raw); } catch { return; }
  const prompt = input.prompt || '';
  const sid = String(input.session_id || 'nosession').replace(/[^\w-]/g, '').slice(0, 64);
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
  const modeFile = path.join(root, 'board', '.mode', sid);
  const readMode = () => { try { return fs.readFileSync(modeFile, 'utf8').trim(); } catch { return ''; } };
  const setMode = (m) => { try { fs.mkdirSync(path.dirname(modeFile), { recursive: true }); fs.writeFileSync(modeFile, m); } catch {} };

  const tail = 'If this is not a work request, ignore this instruction.';
  const emit = (text) => process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'UserPromptSubmit', additionalContext: text },
  }));

  // 1) Commands (priority: learn > all > direct > testroom > analyze)
  if (CMD.learn.test(prompt)) {
    return emit('[#learn] Team lead handles this directly, no subagents. Split what this chat confirmed into a "to record" list and show it first; write only after user approval: ' +
      '(1) confirmed behaviour -> verified-findings and kb/Wiki, (2) corrections -> board/error-ledger.md by member number, (3) repeated TC/judgment format -> rule proposal for .claude/agents/tc-designer.md, ' +
      '(4) progress state -> project notes. Only items with log file/line/time evidence are [verified]; the rest are [needs-confirmation]. Finish with a starter sentence for a new chat.');
  }
  if (CMD.all.test(prompt)) return emit(skillHint(prompt) + '[#all] For this message only, dispatch every relevant member with team-lead (1, 2, 5 together -> 4, 7 together). Mode unchanged. ' + tail);
  if (CMD.direct.test(prompt)) return emit(skillHint(prompt) + '[#direct] For this message only, no subagents: the main session calls the skills itself. Mode unchanged. ' + tail);
  if (CMD.exam.test(prompt)) { setMode('exam'); return emit('This chat is now in testroom mode (persists). ' + MODE_TEXT.exam); }
  if (CMD.analysis.test(prompt)) { setMode('analysis'); return emit('This chat is now in analyze mode (persists). ' + MODE_TEXT.analysis); }

  // 2) Mode already set
  const mode = readMode();
  if (mode === 'exam') return emit(skillHint(prompt) + MODE_TEXT.exam);
  if (mode === 'analysis') return emit(skillHint(prompt) + MODE_TEXT.analysis);

  // 3) No mode: size the response from the request
  const hit = matchSkills(prompt);
  const op = OPERATOR_TEST.test(prompt);
  if (!hit.length && !op) return;
  const who = [...new Set(hit.map(([, n]) => n))].filter((n) => n !== 9).map((n) => `${n} ${MEMBER[n]}`).join(', ');
  let size;
  if (NEW_INPUT.test(prompt) || (op && !DIRECT.test(prompt))) {
    size = 'Size: full team. New input document or new test request: call team-lead, then dispatch with the Agent tool. The lead must not do it alone.';
  } else if (DIRECT.test(prompt)) {
    size = 'Size: direct. Results, judgment or continuation: no subagents, call the skills in the main session.';
  } else {
    size = 'Size: skill first. Dispatch subagents only if two or more investigations are really needed.';
  }
  emit(skillHint(prompt) + `[team routing] Members: ${who || '-'}. ${size} Read those members' lines in board/error-ledger.md. ` + tail);
});
