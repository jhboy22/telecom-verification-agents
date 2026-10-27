// UserPromptSubmit: when the user corrects an answer, have the correction recorded so it is not repeated.
// ponytail: keyword match, so non-corrections also trigger -> the injected text says "ignore if not a correction".
const KEYWORDS = /\b(typo|wrong|incorrect|mistake|not right|should be|that's not|fix(ed)? that|never again)\b/i;

let raw = '';
process.stdin.on('data', (c) => (raw += c));
process.stdin.on('end', () => {
  let prompt = '';
  try { prompt = JSON.parse(raw).prompt || ''; } catch { return; }
  if (!KEYWORDS.test(prompt)) return;
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext:
        '[correction detected] If this message corrects the previous answer (mail, TC, document): ' +
        '1) compare with the original answer and identify what was wrong and what is right. ' +
        '2) if it is a rule of a specific skill (mail format, TC format), update that .claude/skills/*/SKILL.md. ' +
        '3) add one line to board/error-ledger.md with the responsible member number (date | member | wrong | correct rule | source). ' +
        'Second time for the same member and mistake -> propose one rule line in .claude/agents/<member>.md. ' +
        '4) tell the user only "recorded: ...". If this is not a correction, ignore this instruction.',
    },
  }));
});
