'use strict';

/**
 * ai-manager service
 */

const request = require('./core/request');

const { buildCandidatePrompt, buildNormalizePrompt, buildUniformPrompt } = require('./prompts/concepts');
const { buildGraphPrompt } = require('./prompts/graph');
const { buildDiagnosisPrompt } = require('./prompts/diagnosis');
const { buildHintPrompt } = require('./prompts/hint');

module.exports = { genConcepts, genConceptGraph, genFailingConcepts, genHint }

async function genConcepts(provider, apiKey, model, data, allConcepts, mode) {
  if (mode === 'consistent') {
    const counts = new Map();

    for (let i = 0; i < 5; i++) {
      const concepts = await runConceptPipeline({ provider, apiKey, model, data, allConcepts });

      const generatedConcepts = concepts.concepts || [];

      for (const concept of generatedConcepts) {
        counts.set(concept, (counts.get(concept) || 0) + 1);
      }
    }

    const finalConcepts = [];

    for (const concept of counts.keys()) {
      if (counts.get(concept) > 2) {
        finalConcepts.push(concept);
      }
    }

    return { concepts: finalConcepts };
  } 
   
  const concepts = await runConceptPipeline({ provider, apiKey, model, data, allConcepts });

  return concepts;
}

async function genConceptGraph(provider, apiKey, model, conceptLabels) {
  return request({ provider, apiKey, model, prompt: buildGraphPrompt(conceptLabels) });
}

async function genFailingConcepts(provider, apiKey, model, conceptTags, conceptGraph, code, problemText, solution) {
  return request({ provider, apiKey, model, prompt: buildDiagnosisPrompt(conceptTags, conceptGraph, code, problemText, solution) });
}

async function genHint(provider, apiKey, model, description, code) {
  return request({ provider, apiKey, model, prompt: buildHintPrompt(description, code) });
}


async function runConceptPipeline({ provider, apiKey, model, data, allConcepts }) {
  const candidates = await request({ provider, apiKey, model, prompt: buildCandidatePrompt(data) });

  const normalized = await request({ provider, apiKey, model, prompt: buildNormalizePrompt(candidates.concepts) });

  return request({ provider, apiKey, model, prompt: buildUniformPrompt(normalized.concepts, allConcepts) });
}