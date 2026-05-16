function buildHintPrompt(description, code) {
  const helper = "Can you provide a hint about one bug in this program? Consider my thoughts on possible issues. Do not give the answer or any code. If there's an obvious bug, direct me to the location of the bug. If there's a conceptual misunderstanding, offer me a conceptual refresher. Limit your response for the hint to a sentence or two at most. Be as socratic as possible, and be super friendly. No extra output, just what is asked.";
  return `For the problem { ${description} }; I wrote this code { ${code} }; ${helper} Output format (JSON ONLY): { "hint": "" } `;
}

module.exports = { buildHintPrompt };