function buildDiagnosisPrompt(conceptTags, conceptGraph, code, problemText, solution) {
  return `You are an educational diagnosis assistant.

Your task is to determine which provided learning concepts most likely caused a student to fail an exercise.

You MUST:
  - Select ONLY concepts that appear in the provided concept list or in the prerequisite graph.
  - Consider BOTH:
    (a) Concepts explicitly associated with the exercise
    (b) Any of their prerequisite concepts from the graph
  - Use specific evidence from the student's code, the problem description and the solution code.
  - Identify the underlying misunderstanding, not just surface syntax mistakes.
  - Return AT LEAST one concept.

STEP 1 — Understand the task  
Carefully read the problem text and the solution code and determine what skills are required.

STEP 2 — Analyze the student code  
Identify:
  - Logical mistakes
  - Misuse of language features
  - Missing required structures
  - Incorrect algorithm design
  - Misunderstanding of control flow, data structures, etc.

STEP 3 — Map mistakes to concepts  
  Match each mistake to the most fundamental concept that explains it.
  If a mistake is caused by misunderstanding a prerequisite concept, prefer selecting the prerequisite.

STEP 4 — Filter results  
  Only return concepts that exist in:
    - The exercise concept list
    - OR their prerequisites from the graph

Do NOT invent concepts.
Do NOT explain your reasoning.
Do NOT output anything except valid JSON.

1. Exercise problem text
<<<
${problemText}
>>>

2. Student code
<<<
${code}
>>>

3. Solution code
<<<
${solution}
>>>

4. Concepts explicitly associated with this exercise
<<<
${JSON.stringify(conceptTags, null, 2)}
>>>

5. Course concept graph edges (A -> B means A is a prerequisite of B)
${JSON.stringify(conceptGraph, null, 2)}

Output format (JSON ONLY):

{
  "concepts": ["concept_name_1", "concept_name_2"]
}

Output ONLY JSON, no markdown, no commentary
`;
}

module.exports = { buildDiagnosisPrompt };