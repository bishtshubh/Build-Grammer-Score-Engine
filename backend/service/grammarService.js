import { check } from "languagetool-api";

export const checkGrammar = async (text) => {
  const result = await check({
    text,
    language: "en-US",
  });

  const mistakes = result.matches.map(match => ({
    message: match.message,
    incorrect: text.substring(match.offset, match.offset + match.length),
    suggestion: match.replacements[0]?.value || "",
  }));

  return {
    correctedText: applyCorrections(text, result.matches),
    mistakes,
  };
};

// helper function
function applyCorrections(text, matches) {
  let corrected = text;
  let offset = 0;

  for (const match of matches) {
    if (match.replacements.length > 0) {
      const replacement = match.replacements[0].value;
      const start = match.offset + offset;
      const end = start + match.length;

      corrected =
        corrected.slice(0, start) +
        replacement +
        corrected.slice(end);

      offset += replacement.length - match.length;
    }
  }

  return corrected;
}
