'use strict';

/**
 * A set of functions called "actions" for `recommendations`
 */

module.exports = {
  async forStudent(ctx) {
    const { userId } = ctx.params;

    if (!userId) {
      return ctx.badRequest('userId is required');
    }

    const student = await strapi.db
      .query('api::student.student')
      .findOne({
        where: { user: userId, },
        populate: {
          class: {
            populate: {
              occurrence: {
                populate: {
                  courses: {
                    populate: {
                      modules: {
                        populate: {
                          lessons: {
                            populate: {
                              expositives: {
                                populate: { conceptTags: true },
                              },
                              evaluatives: {
                                populate: { conceptTags: true },
                              },
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      });
    
      if (!student) {
        return ctx.badRequest('Student not found');
      }

    const recommendations = await strapi
      .service('api::recommendations.recommendations')
      .recommendLessonsForStudent(student);

    ctx.body = recommendations;
  },
  async onFailure(ctx) {
    const { code, evaluativeID, courseID } = ctx.request.body;

    if (!code || !evaluativeID || !courseID) {
      return ctx.badRequest("Missing body");
    }
    
    const evaluative = await strapi.entityService.findOne('api::evaluative.evaluative', evaluativeID, {
      populate: {
        conceptTags: true,
        content: true
      }
    });

    const conceptTags = evaluative.conceptTags.map(concept => concept.label);

    const problemText = stripHtml(evaluative.content[0].statement);
    const solution = evaluative.content[0].solution;

    if (!conceptTags.length) {
      return ctx.badRequest("No concept tags on evaluative");
    } 

    const course = await strapi.entityService.findOne('api::course.course', courseID, {
      populate: {
        modules: {
          populate: {
            lessons: {
              populate: {
                expositives: {
                  populate: { conceptTags: true },
                },
                evaluatives: {
                  populate: { conceptTags: true },
                },
              }
            }
          }
        },
        author: true,
        conceptGraph: {
          populate: {
            edges: {
              populate: {
                from: {
                  populate: {
                    label: true
                  }
                },
                to: {
                  populate: {
                    label: true
                  }
                }
              }
            }
          }
        }
      }
    });

    const user = await strapi.entityService.findOne('plugin::users-permissions.user', course.author.id, {
      populate: {
        aiProvider: true,
        aiApiKey: true,
        aiModel: true
      }
    });

    if (!user) {
      return ctx.badRequest("Course author not found");
    }

    const provider = user.aiProvider;
    const apiKey = user.aiApiKey;
    const model = user.aiModel;

    const conceptGraph = course.conceptGraph.edges.map(edge => ({ from: edge.from.label, to: edge.to.label }));

    if (!conceptGraph) {
      return ctx.badRequest("No concept graph on course");
    }

    const concepts = await strapi.service('api::ai-manager.ai-manager').genFailingConcepts(provider, apiKey, model, conceptTags, conceptGraph, code, problemText, solution);

    console.log(concepts);

    if (!concepts.concepts.length) {
      return ctx.badRequest("No concepts found");
    }

    const lessons = []
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const lessonConcepts = [
          ...(lesson.expositives ?? []).flatMap(e =>
            e.conceptTags?.map(c => c.label) ?? []
          ),
          ...(lesson.evaluatives ?? []).flatMap(e =>
            e.conceptTags?.map(c => c.label) ?? []
          ),
        ];

        const hasFailingConcept = concepts.concepts.find(c => lessonConcepts.includes(c));

        if (hasFailingConcept) {
          lessons.push(lesson);
        }
      }   
    }

    ctx.body = lessons;
  }
};

function stripHtml(html = '') {
  return html.replace(/<[^>]*>/g, ' ');
}