import { PrismaClient } from '@prisma/client'
import { UNITS } from './seed/units'
import { SKILLS } from './seed/skills'
import { LESSONS_UNIT1 } from './seed/lessons-unit1'
import { LESSONS_UNIT2 } from './seed/lessons-unit2'
import { LESSONS_UNIT3 } from './seed/lessons-unit3'
import { LESSONS_UNIT4 } from './seed/lessons-unit4'
import { LESSONS_UNIT5 } from './seed/lessons-unit5'
import { LESSONS_UNIT6 } from './seed/lessons-unit6'
import { generateAllQuestions } from './seed/questions'

const prisma = new PrismaClient()

const ALL_LESSONS = [
  ...LESSONS_UNIT1,
  ...LESSONS_UNIT2,
  ...LESSONS_UNIT3,
  ...LESSONS_UNIT4,
  ...LESSONS_UNIT5,
  ...LESSONS_UNIT6,
];

async function main() {
  console.log("🧹 Cleaning database...")
  await prisma.drillAttempt.deleteMany()
  await prisma.userProgress.deleteMany()
  await prisma.question.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.skill.deleteMany()
  await prisma.unit.deleteMany()

  // 1. Create Units
  console.log(`📦 Creating ${UNITS.length} official TKA units...`)
  const unitMap: Record<string, string> = {}
  for (const unit of UNITS) {
    const created = await prisma.unit.create({ data: unit })
    unitMap[unit.slug] = created.id
    console.log(`  ✅ ${unit.title}`)
  }

  // 2. Create Skills
  console.log(`🎯 Creating ${SKILLS.length} official TKA skills...`)
  const skillMap: Record<string, string> = {}
  for (const skill of SKILLS) {
    const unitId = unitMap[skill.unitSlug]
    if (!unitId) {
      console.warn(`  ⚠️ Unit not found for skill ${skill.slug} (${skill.unitSlug})`)
      continue
    }
    const created = await prisma.skill.create({
      data: {
        title: skill.title,
        slug: skill.slug,
        description: skill.description,
        order: skill.order,
        unitId: unitId,
      }
    })
    skillMap[skill.slug] = created.id
    console.log(`  ✅ ${skill.title}`)
  }

  // 3. Create Lessons
  console.log(`📖 Creating ${ALL_LESSONS.length} comprehensive lessons with 3-tier questions...`)
  for (const lesson of ALL_LESSONS) {
    const skillId = skillMap[lesson.skillSlug]
    if (!skillId) {
      console.warn(`  ⚠️ Skill not found for lesson ${lesson.slug} (${lesson.skillSlug})`)
      continue
    }
    await prisma.lesson.create({
      data: {
        title: lesson.title,
        slug: lesson.slug,
        order: lesson.order,
        skillId: skillId,
        contentMdx: lesson.contentMdx,
      }
    })
    console.log(`  ✅ ${lesson.title}`)
  }

  // 4. Generate & Insert Questions
  console.log("❓ Generating questions (including real TKA 2025 exam items)...")
  const allQuestions = generateAllQuestions()
  console.log(`  Generated ${allQuestions.length} questions`)

  let inserted = 0
  const batchSize = 50
  for (let i = 0; i < allQuestions.length; i += batchSize) {
    const batch = allQuestions.slice(i, i + batchSize)
    for (const q of batch) {
      try {
        const skillId = skillMap[q.skillSlug]
        const unitId = unitMap[q.unitSlug]
        if (!skillId || !unitId) continue

        await prisma.question.create({
          data: {
            questionMd: q.questionMd,
            options: q.options,
            correctIndex: q.correctIndex,
            explanationMd: q.explanationMd,
            difficulty: q.difficulty,
            tags: q.tags,
            category: q.category,
            skillId: skillId,
            unitId: unitId,
          }
        })
        inserted++
      } catch (e) {
        console.error(`Error inserting question:`, e)
      }
    }
    console.log(`  Inserted ${inserted}/${allQuestions.length}...`)
  }

  console.log(`\n🎉 TKA Seeding complete!`)
  console.log(`   ${UNITS.length} units`)
  console.log(`   ${SKILLS.length} skills`)
  console.log(`   ${ALL_LESSONS.length} lessons`)
  console.log(`   ${inserted} questions`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
