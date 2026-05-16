function buildCandidatePrompt(data) {
  return `You are a Technical Curriculum Architect and Computer Science Professor.

Analyze the provided learning material and extract the DISTINCT PROGRAMMING CONCEPTS that are explicitly taught.

IMPORTANT:
Create a NEW concept ONLY if the mechanism is fundamentally different from one already created.
Dont create new concepts when they represent the same underlying programming mechanism from already created ones.

TEXT TO ANALYZE:
<<<
${data}
>>>

OBJECTIVE:
Identify the concrete programming mechanism taught in the text, at the level a curriculum would track.

CRITICAL RULES:

1. One Concept Per Mechanism
  Do NOT create separate concepts for:
    - Syntax variants
    - Sub-forms
    - Minor extensions
    - Special cases

Examples:
  - "if", "else if", "nested if" -> "Conditionals"
  - "for", "while", "do while" -> "Loops"
    
2. Language-Aware Naming
  - Prefer language-agnostic concepts unless the mechanism is language-specific.
  - Example:
    - "Closures" 
    - "JavaScript Event Loop" 

3. No Meta or Pedagogical Concepts
  FORBIDDEN:
    - "Programming basics"
    - "JavaScript overview"
    - "Logic"
    - "Syntax"
      
4. If a concept cannot be demonstrated with a short code snippet, it is NOT a valid programming concept.

5. Output Rules
  - Output ONLY valid JSON
  - No explanations
  - No duplicates
       
OUTPUT FORMAT:
{
  "concepts": [
    "Conditionals",
    "Variables",
    "Recursion"
  ]
}
Output ONLY JSON, no markdown, no commentary
`;
}

function buildNormalizePrompt(candidates) {
  return `You are a Technical Curriculum Architect performing a NORMALIZATION pass.

Your task is to merge, generalize, and normalize the following candidate concepts into a minimal set of DISTINCT programming mechanisms.

CANDIDATE CONCEPTS:
<<<
${JSON.stringify(candidates, null, 2)}
>>>

MANDATORY MECHANISM IDENTITY TEST:
Two concepts are the SAME if they:
  - Serve the same purpose
  - Can be grouped into a single concept
  - Differ only by syntax, structure, or specialization

RULES:

1. Canonical Naming
   - Prefer widely accepted curriculum terms
   - Use language-agnostic names unless impossible

2. If two concepts overlap, keep the more general one.

3. Prefer fewer, stronger concepts.

FEW-SHOT EXAMPLES:

INPUT:
[
  "If Statements",
  "Else If Conditions",
  "Nested Conditionals"
]

OUTPUT:
{
  "concepts": [
    "Conditionals"
  ]
}

INPUT:
[
  "For Loops",
  "While Loops",
  "Looping Over Arrays"
]

OUTPUT:
{
  "concepts": [
    "Loops"
  ]
}

OUTPUT FORMAT (JSON ONLY):
{
  "concepts": []
}

Output ONLY JSON, no markdown, no commentary
`;
}

function buildUniformPrompt(normalized, allConcepts) {
  return `You are a Knowledge Ontology Maintainer.

Your task is to reconcile newly normalized concepts with an existing controlled vocabulary (IF THE VOCABULARY EXISTS)

NEW CONCEPTS:
<<<
${JSON.stringify(normalized, null, 2)}
>>>

CONTROLLED VOCABULARY (AUTHORITATIVE):
<<<
${JSON.stringify(allConcepts, null, 2)}
>>>

RULES:

1. Reuse Before Creating (ABSOLUTE)
   - If a new concept matches an existing one in meaning or mechanism,
     USE THE EXISTING LABEL EXACTLY.

2. Do NOT create:
   - Synonyms
   - Paraphrases
   - Slight renamings

3. Only keep a new concept if:
   - No existing concept represents the same mechanism.

4. Final list must be:
   - Minimal
   - Non-redundant
   - Curriculum-appropriate

FEW-SHOT EXAMPLE:

CONTROLLED:
["Conditionals"]

NEW:
["If Else Logic"]

OUTPUT FORMAT (JSON ONLY):
{
  "concepts": ["Conditionals"]
}

Output ONLY JSON, no markdown, no commentary
`;
}



module.exports = { buildCandidatePrompt, buildNormalizePrompt, buildUniformPrompt };