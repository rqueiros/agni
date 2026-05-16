function buildGraphPrompt(conceptLabels) {
  return `You are building a COURSE-SPECIFIC concept dependency graph.

DEFINITION:
Dependency means:
"Understanding concept A is REQUIRED before concept B can be meaningfully learned."

RULES:
  - Concepts are already validated.
  - Use ONLY the concepts provided.
  - Do NOT invent new concepts.
  - Output directed dependencies.
  - If concept A must be learned before B, output A -> B.
  - If B requires understanding multiple concepts, output multiple edges.
  - If the concept doesnt have any dependencies, it doesnt need an edge.
  - BUT most of the time concepts WILL have dependencies.
  - The goal is to connect the graph, WHEN POSSIBLE.
  - Avoid unconnected graphs.
  - Some concepts may depend from several concepts.

CONCEPTS:
<<<
${JSON.stringify(conceptLabels, null, 2)}
>>>

OUTPUT FORMAT (JSON ONLY):
{
  "edges": [
    { "from": "A", "to": "B" },
    { "from": "E", "to": "B" },
    { "from": "B", "to": "C" },
    { "from": "B", "to": "D" }
  ]
}

Output ONLY JSON, no markdown, no commentary
`;
}


module.exports = { buildGraphPrompt };