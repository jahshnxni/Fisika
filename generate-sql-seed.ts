import fs from 'fs';
import { UNITS } from './prisma/seed/units';
import { SKILLS } from './prisma/seed/skills';
import { LESSONS_FLUIDA_STATIS } from './prisma/seed/lessons-unit1';
import { LESSONS_FLUIDA_DINAMIS } from './prisma/seed/lessons-unit2';
import { LESSONS_GELOMBANG } from './prisma/seed/lessons-unit3';
import { LESSONS_SUHU_KALOR } from './prisma/seed/lessons-unit4';
import { LESSONS_TERMODINAMIKA } from './prisma/seed/lessons-unit5';
import { generateAllQuestions } from './prisma/seed/questions';

const escapeString = (str: string | undefined | null) => {
    if (!str) return '';
    return str.replace(/'/g, "''"); // Escape single quotes for SQL
};

const ALL_LESSONS = [
    ...LESSONS_FLUIDA_STATIS,
    ...LESSONS_FLUIDA_DINAMIS,
    ...LESSONS_GELOMBANG,
    ...LESSONS_SUHU_KALOR,
    ...LESSONS_TERMODINAMIKA,
];

let sql = '';

// Units
const unitMap: Record<string, string> = {};
UNITS.forEach(unit => {
    const id = `unit_${unit.slug}`;
    unitMap[unit.slug] = id;
    sql += `INSERT INTO "Unit" ("id", "title", "description", "order", "slug", "icon") VALUES ('${id}', '${escapeString(unit.title)}', '${escapeString(unit.description)}', ${unit.order}, '${unit.slug}', '${unit.icon}') ON CONFLICT DO NOTHING;\n`;
});
sql += '\n';

// Skills
const skillMap: Record<string, string> = {};
SKILLS.forEach(skill => {
    const id = `skill_${skill.slug}`;
    skillMap[skill.slug] = id;
    const unitId = unitMap[skill.unitSlug];
    if (unitId) {
        sql += `INSERT INTO "Skill" ("id", "unitId", "title", "slug", "description", "order") VALUES ('${id}', '${unitId}', '${escapeString(skill.title)}', '${skill.slug}', '${escapeString(skill.description)}', ${skill.order}) ON CONFLICT DO NOTHING;\n`;
    }
});
sql += '\n';

// Lessons
ALL_LESSONS.forEach(lesson => {
    const id = `lesson_${lesson.slug}`;
    const skillId = skillMap[lesson.skillSlug];
    if (skillId) {
        sql += `INSERT INTO "Lesson" ("id", "skillId", "title", "slug", "contentMdx", "order", "xpReward") VALUES ('${id}', '${skillId}', '${escapeString(lesson.title)}', '${lesson.slug}', '${escapeString(lesson.contentMdx)}', ${lesson.order}, 10) ON CONFLICT DO NOTHING;\n`;
    }
});
sql += '\n';

// Questions
const allQuestions = generateAllQuestions();
let insertedQ = 0;
allQuestions.forEach((q, i) => {
    const id = `q_${i}`;
    const skillId = skillMap[q.skillSlug];
    const unitId = unitMap[q.unitSlug];

    if (skillId && unitId) {
        // If q.options is array, stringify it
        const optionsStr = typeof q.options === 'string' ? q.options : JSON.stringify(q.options || []);

        sql += `INSERT INTO "Question" ("id", "skillId", "unitId", "questionMd", "options", "correctIndex", "explanationMd", "difficulty", "tags", "category") VALUES ('${id}', '${skillId}', '${unitId}', '${escapeString(q.questionMd)}', '${escapeString(optionsStr)}', ${q.correctIndex || 0}, '${escapeString(q.explanationMd)}', '${q.difficulty || 'MEDIUM'}', '${q.tags || ''}', '${escapeString(q.category || '')}') ON CONFLICT DO NOTHING;\n`;
        insertedQ++;
    }
});

fs.writeFileSync('seed.sql', sql);
console.log(`\n🎉 Successfully generated seed.sql!`);
console.log(`Contains: ${UNITS.length} units, ${SKILLS.length} skills, ${ALL_LESSONS.length} lessons, and ${insertedQ} questions.`);
console.log(`Silakan buka file seed.sql, copy isinya, dan paste ke Neon SQL Editor.`);
