'use strict';

/**
 * recommendations service
 */

const fs = require('fs');
const path = require('path');
const pdf = require('pdf-extraction');


async function generateGraph(id, provider, apiKey, model, mode) {
    const course = await strapi.entityService.findOne(
      'api::course.course',
      id,
      {
        populate: {
          modules: {
            populate: {
              lessons: {
                populate: {
                  expositives: {
                    populate: {
                      file: true,
                      conceptTags: true
                    },
                  },
                  evaluatives: {
                    populate: {
                        content: {
                          populate: {
                            questions: {
                              populate: ['answers']
                            }
                          }
                        },
                        conceptTags: true
                    }
                  }
                },
              },
            },
          },
          conceptGraph: {
            populate: {
              edges: {
                populate: {
                  from: true,
                  to: true
                }
              }
            }
          }
        },
      }
    );

    const courseConceptsMap = new Map();

    for (const module of course.modules || []) {
      for (const lesson of module.lessons || []) {
        for (const expositive of lesson.expositives || []) {
          const concepts = await tagExpositive(expositive, provider, apiKey, model, mode);
          for (const c of concepts) {
            courseConceptsMap.set(c.id, c);
          }
        }
        for (const evaluative of lesson.evaluatives || []) {
          const concepts = await tagEvaluative(evaluative, provider, apiKey, model, mode);
          for (const c of concepts) {
            courseConceptsMap.set(c.id, c);
          }
        }
      }
    }

    const courseConcepts = Array.from(courseConceptsMap.values());

    try {
        await genConceptGraph(courseConcepts, course.conceptGraph, id, provider, apiKey, model);
        return true;
    } catch (error) {
        return false;
    }
}

async function generateExpositiveConcepts(id, provider, apiKey, model, mode) {
  const expositive = await strapi.entityService.findOne('api::expositive.expositive', id,
    {
      populate: {
        file: true
      }
    }
  );

  const file = expositive.file;

  const absolutePath = path.join(strapi.dirs.static.public, file.url);

  if (!fs.existsSync(absolutePath)) {
    console.log("FILE NOT FOUND AT: ", absolutePath);
    return false;
  }

  let concepts = { concepts: [] };

  try {
    const dataBuffer = fs.readFileSync(absolutePath);
    const pdfData = await pdf(dataBuffer);
     
    let allConcepts = await strapi.db.query('api::concept.concept').findMany({ select: ['label'] });

    allConcepts = allConcepts.map(c => c.label);

    if (pdfData.text.trim().length < 50 && pdfData.numpages > 0) return [];

    const extractedText = pdfData.text.trim();
    if (!extractedText) {
      console.log("PDF was empty or could not be read.");
      return false;
    }

    concepts = await strapi.service('api::ai-manager.ai-manager').genConcepts(provider, apiKey, model, extractedText, allConcepts, mode);
    
    console.log(concepts);
      
    if (!concepts) {
      return false;
    }

  } catch (err) {
    console.error("Error processing PDF or generating concepts:", err);
    return false;
  } 
      
  const conceptIds = [];
  
  for (const name of concepts.concepts) {     
    let concept = await strapi.db.query('api::concept.concept').findOne({ where: { label: name } });

    if (!concept) {
      concept = await strapi.db.query('api::concept.concept').create({ data: { label: name } });
    }
    
    conceptIds.push(concept.id);
  }

  if (conceptIds.length > 0) {
    await strapi.db.query('api::expositive.expositive')
      .update({
        where: { id: expositive.id },
        data: { conceptTags: conceptIds },
      });
  }

  return true;
}

async function generateEvaluativeConcepts(id, provider, apiKey, model, mode) {
  const evaluative = await strapi.entityService.findOne('api::evaluative.evaluative', id,
    {
      populate: {
        content: {
          populate: {
            questions: {
              populate: ['answers']
            }
          }
        }
      }
    }
  );

  const textParts = [];

  for (const component of evaluative.content || []) {
    if (component.__component === 'base.programming-exercise') {
      textParts.push(stripHtml(component.statement));
    }

    if (component.__component === 'base.quiz') {
      const quizText = await extractQuizText(component);
      textParts.push(quizText);
    }
  }

  let allConcepts = await strapi.db.query('api::concept.concept').findMany({ select: ['label'] });

  allConcepts = allConcepts.map(c => c.label);

  const fullText = textParts.join('\n\n').trim();
  if (!fullText) return [];

  const concepts = await strapi
    .service('api::ai-manager.ai-manager')
    .genConcepts(provider, apiKey, model, fullText, allConcepts, mode);

  console.log(concepts);

  if (!concepts) {
    return [];
  }

  const conceptIds = [];

  for (const name of concepts.concepts) {
    let concept = await strapi.db
      .query('api::concept.concept')
      .findOne({ where: { label: name } });

    if (!concept) {
      concept = await strapi.db
        .query('api::concept.concept')
        .create({ data: { label: name } });
    }

    conceptIds.push(concept.id);
  }

  if (conceptIds.length > 0) {
    await strapi.db
      .query('api::evaluative.evaluative')
      .update({
        where: { id: evaluative.id },
        data: { conceptTags: conceptIds },
      });
  }

  return true;
}


async function tagExpositive(expositive, provider, apiKey, model, mode) {
  if (expositive.conceptTags?.length > 0) {
    return expositive.conceptTags;
  }

  const file = expositive.file;

  const absolutePath = path.join(strapi.dirs.static.public, file.url);

  if (!fs.existsSync(absolutePath)) {
    console.log("FILE NOT FOUND AT: ", absolutePath);
    return [];
  }

  let concepts = { concepts: [] };

  try {
    const dataBuffer = fs.readFileSync(absolutePath);
    const pdfData = await pdf(dataBuffer);
     
    let allConcepts = await strapi.db.query('api::concept.concept').findMany({ select: ['label'] });

    allConcepts = allConcepts.map(c => c.label);

    if (pdfData.text.trim().length < 50 && pdfData.numpages > 0) return [];

    const extractedText = pdfData.text.trim();
    if (!extractedText) {
      console.log("PDF was empty or could not be read.");
      return [];
    }

    concepts = await strapi.service('api::ai-manager.ai-manager').genConcepts(provider, apiKey, model, extractedText, allConcepts, mode);
    
    console.log(concepts);
      
    if (!concepts) {
      return [];
    }

  } catch (err) {
    console.error("Error processing PDF or generating concepts:", err);
    return [];
  } 
      
  const conceptIds = [];
  
  for (const name of concepts.concepts) {     
    let concept = await strapi.db.query('api::concept.concept').findOne({ where: { label: name } });

    if (!concept) {
      concept = await strapi.db.query('api::concept.concept').create({ data: { label: name } });
    }
    
    conceptIds.push(concept.id);
  }

  if (conceptIds.length > 0) {
    await strapi.db.query('api::expositive.expositive')
      .update({
        where: { id: expositive.id },
        data: { conceptTags: conceptIds },
      });
  }

  const conceptTags = await strapi.db
                        .query('api::expositive.expositive')
                        .findOne({ where: { id: expositive.id }, populate: { conceptTags: true } });

  return conceptTags.conceptTags;
}

async function tagEvaluative(evaluative, provider, apiKey, model, mode) {
  if (evaluative.conceptTags?.length > 0) {
    return evaluative.conceptTags;
  }

  const textParts = [];

  for (const component of evaluative.content || []) {
    if (component.__component === 'base.programming-exercise') {
      textParts.push(stripHtml(component.statement));
    }

    if (component.__component === 'base.quiz') {
      const quizText = await extractQuizText(component);
      textParts.push(quizText);
    }
  }

  let allConcepts = await strapi.db.query('api::concept.concept').findMany({ select: ['label'] });

  allConcepts = allConcepts.map(c => c.label);

  const fullText = textParts.join('\n\n').trim();
  if (!fullText) return [];

  const concepts = await strapi
    .service('api::ai-manager.ai-manager')
    .genConcepts(provider, apiKey, model, fullText, allConcepts, mode);

  console.log(concepts);

  if (!concepts) {
    return [];
  }

  const conceptIds = [];

  for (const name of concepts.concepts) {
    let concept = await strapi.db
      .query('api::concept.concept')
      .findOne({ where: { label: name } });

    if (!concept) {
      concept = await strapi.db
        .query('api::concept.concept')
        .create({ data: { label: name } });
    }

    conceptIds.push(concept.id);
  }

  if (conceptIds.length > 0) {
    await strapi.db
      .query('api::evaluative.evaluative')
      .update({
        where: { id: evaluative.id },
        data: { conceptTags: conceptIds },
      });
  }
  

  const conceptTags = await strapi.db
                        .query('api::evaluative.evaluative')
                        .findOne({ where: { id: evaluative.id }, populate: { conceptTags: true } });

  return conceptTags.conceptTags;
}

async function extractQuizText(quizComponent) {
  const parts = [];

  for (const q of quizComponent.questions || []) {
    parts.push(stripHtml(q.question));
  }

  return parts.join('\n\n');
}

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ');
}

async function genConceptGraph(courseConcepts, curConceptGraph, courseId, provider, apiKey, model) {
  const labels = courseConcepts.map(c => c.label);

  const edges = await strapi
    .service('api::ai-manager.ai-manager')
    .genConceptGraph(provider, apiKey, model, labels);

  console.log(edges);

  if (!edges) {
    return;
  }

  const conceptByLabel = new Map( courseConcepts.map(c => [c.label, c.id]) );
  const conceptEdges = edges.edges
    .map(e => ({
      from: conceptByLabel.get(e.from),
      to: conceptByLabel.get(e.to)
    }));


  if (curConceptGraph) {
    await strapi.entityService.update(
      'api::course.course',
      courseId,
      {
        data: {
          conceptGraph: {
            id: curConceptGraph.id,
            concepts: courseConcepts.map(c => c.id),
            edges: conceptEdges
          }
        }
      }
    );
  } else {
    await strapi.entityService.update(
      'api::course.course',
      courseId,
      {
        data: {
          conceptGraph: {
            concepts: courseConcepts.map(c => c.id),
            edges: conceptEdges
          }
        }
      }
    )
  }
}

async function updateGraph(id, edges, nodes) {
  const course = await strapi.entityService.findOne(
      'api::course.course',
      id,
      {
        populate: {
          conceptGraph: {
            populate: {
              edges: {
                populate: {
                  from: true,
                  to: true
                }
              }
            }
          }
        },
      }
    );

    await strapi.entityService.update('api::course.course', id, {
      data: {
        conceptGraph: {
          id: course.conceptGraph.id,
          concepts: nodes,
          edges: edges
        }
      }
    })

    return true;
}

async function deleteGraph(id) {
  await strapi.entityService.update('api::course.course', id, {
    data: {
      conceptGraph: null
    }
  });

  return true;
}

async function getEvaluativeConcepts(id) {
  const evaluative = await strapi.entityService.findOne('api::evaluative.evaluative', id, {
    populate: {
      conceptTags: true
    }
  });

  return evaluative?.conceptTags ?? [];
}

async function getExpositiveConcepts(id) {
  const expositive = await strapi.entityService.findOne('api::expositive.expositive', id, {
    populate: {
      conceptTags: true
    }
  });

  return expositive?.conceptTags ?? [];
}

async function updateEvaluativeConcepts(id, concepts) {
  const conceptIds = concepts.map(c => c.id);
  await strapi.db.query('api::evaluative.evaluative').update({
    where: { id: id },
    data: { conceptTags: conceptIds },
  });

  return true;
}

async function updateExpositiveConcepts(id, concepts) {
  const conceptIds = concepts.map(c => c.id);
  await strapi.db.query('api::expositive.expositive').update({
    where: { id: id },
    data: { conceptTags: conceptIds },
  });
  
  return true;
}

async function updateConcepts(id, label) {
  await strapi.db.query('api::concept.concept').update({
    where: { id: id },
    data: { label: label }
  });
  
  return true;
}

async function deleteConcept(id) {
  const expositives = await strapi.entityService.findMany('api::expositive.expositive', {
    filters: { conceptTags: id },
    populate: ['conceptTags'],
  });

  for (const exp of expositives) {
    await strapi.entityService.update('api::expositive.expositive', exp.id, {
      data: {
        conceptTags: exp.conceptTags.filter(c => c.id !== id).map(c => c.id),
      }
    });
  }

  const evaluatives = await strapi.entityService.findMany('api::evaluative.evaluative', {
    filters: { conceptTags: id },
    populate: ['conceptTags'],
  });

  for (const ev of evaluatives) {
    await strapi.entityService.update('api::evaluative.evaluative', ev.id, {
      data: {
        conceptTags: ev.conceptTags.filter(c => c.id !== id).map(c => c.id),
      },
    });
  }

  const masteryEntries = await strapi.entityService.findMany('api::concept-mastery.concept-mastery', {
    filters: { concept: id },
  });

  for (const mastery of masteryEntries) {
    await strapi.entityService.delete('api::concept-mastery.concept-mastery', mastery.id);
  }

  const courses = await strapi.entityService.findMany('api::course.course', {
    filters: {
      conceptGraph: { concepts: id }
    },
    populate: {
      conceptGraph: {
        populate: {
          concepts: true,
          edges: {
            populate: ['from', 'to'],
          },
        },
      },
    },
  });

  for (const course of courses) {
    if (!course.conceptGraph) continue;

    const cleanedConcepts = course.conceptGraph.concepts?.filter(c => c.id !== id) || [];

    const cleanedEdges = (course.conceptGraph.edges || []).filter(edge => edge.from?.id !== id && edge.to?.id !== id);

    await strapi.entityService.update('api::course.course', course.id, {
      data: {
        conceptGraph: {
          concepts: cleanedConcepts.map(c => c.id),
          edges: cleanedEdges.map(edge => ({ id: edge.id, from: edge.from?.id, to: edge.to?.id })),
        },
      },
    });
  }

  await strapi.entityService.delete('api::concept.concept', id);

  return true;
}

async function getCourseMaterialConcepts(id) {
  const course = await strapi.entityService.findOne('api::course.course', id, {
    populate: {
      modules: {
        populate: {
          lessons: {
            populate: {
              expositives: {
                populate: {
                  conceptTags: {
                    populate: {
                      label: true
                    }
                  }
                },
              },
              evaluatives: {
                populate: {
                  conceptTags: {
                    populate: {
                      label: true
                    }
                  }
                }
              }
            },
          },
        }
      }
    }  
  });

  const allConceptsMap = new Map();

  for (const module of course.modules || []) {
    for (const lesson of module.lessons || []) {
      for (const expositive of lesson.expositives || []) {
        for (const tag of expositive.conceptTags || []) {
          allConceptsMap.set(tag.id, tag);
        }
      }
      for (const evaluative of lesson.evaluatives || []) {
        for (const tag of evaluative.conceptTags || []) {
          allConceptsMap.set(tag.id, tag);
        }
      }
    }
  }

  const allConcepts = Array.from(allConceptsMap.values());

  return allConcepts;
}

module.exports = {
  generateGraph,
  generateExpositiveConcepts,
  generateEvaluativeConcepts,
  updateGraph,
  deleteGraph,
  getEvaluativeConcepts,
  getExpositiveConcepts,
  updateEvaluativeConcepts,
  updateExpositiveConcepts,
  updateConcepts,
  deleteConcept,
  getCourseMaterialConcepts
};

