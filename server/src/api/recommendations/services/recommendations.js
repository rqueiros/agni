'use strict';

/**
 * recommendations service
 */

async function getLowMasteryConcepts(studentId, threshold = 0.85) {
  return strapi.db.query('api::concept-mastery.concept-mastery')
    .findMany({
      where: {
        student: {
          id: studentId
        },
        mastery: { $lt: threshold },
      },
      populate: { concept: true },
    });
}

async function getCandidateLessons(lowConceptIds, student) {
  const courses = student.class.occurrence.courses;

  const lessons = [];
  for (const course of courses) {
    for (const module of course.modules ?? []) {
      for (const lesson of module.lessons ?? []) {
        lessons.push({ lesson });
      }
    }
  }

  return lessons.filter((lesson) => {
    const lessonConcepts = new Set();

    lesson.lesson.expositives?.forEach(e => e.conceptTags?.forEach(c => lessonConcepts.add(c.id)));
    lesson.lesson.evaluatives?.forEach(e => e.conceptTags?.forEach(c => lessonConcepts.add(c.id)));

    return lowConceptIds.some(id => lessonConcepts.has(id));
  });
}

function scoreLesson(lesson, masteryByConceptId) {
  let score = 0;

  for (const [conceptId, mastery] of masteryByConceptId.entries()) {
    const expositiveTeaches = lesson.lesson.expositives?.some(e => e.conceptTags?.some(c => c.id === conceptId));
    const evaluativeTeaches = lesson.lesson.evaluatives?.some(e => e.conceptTags?.some(c => c.id === conceptId));
    if (expositiveTeaches) score += (1 - mastery) * 5;
    if (evaluativeTeaches) score += (1 - mastery);
  }

  return score;
}

async function recommendLessonsForStudent(student, limit = 10) {
  const lowMasteries = await getLowMasteryConcepts(student.id);
  if (!lowMasteries.length) return [];

  const masteryByConceptId = new Map(lowMasteries.map(m => [m.concept.id, m.mastery]));

  const lessons = await getCandidateLessons([...masteryByConceptId.keys()], student);

  return lessons
    .map(lesson => ({ lesson, score: scoreLesson(lesson, masteryByConceptId) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

module.exports = {
  recommendLessonsForStudent,
};