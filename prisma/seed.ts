import { PrismaClient } from '@prisma/client'
import { UNITS } from './seed/units'
import { SKILLS } from './seed/skills'
import { LESSONS_FLUIDA_STATIS } from './seed/lessons-unit1'
import { LESSONS_FLUIDA_DINAMIS } from './seed/lessons-unit2'
import { LESSONS_GELOMBANG } from './seed/lessons-unit3'
import { LESSONS_SUHU_KALOR } from './seed/lessons-unit4'
import { LESSONS_TERMODINAMIKA } from './seed/lessons-unit5'
import { generateAllQuestions } from './seed/questions'

const prisma = new PrismaClient()

const ALL_LESSONS = [
  ...LESSONS_FLUIDA_STATIS,
  ...LESSONS_FLUIDA_DINAMIS,
  ...LESSONS_GELOMBANG,
  ...LESSONS_SUHU_KALOR,
  ...LESSONS_TERMODINAMIKA,
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
  console.log("📦 Creating 5 units...")
  const unitMap: Record<string, string> = {}
  for (const unit of UNITS) {
    const created = await prisma.unit.create({ data: unit })
    unitMap[unit.slug] = created.id
    console.log(`  ✅ ${unit.title}`)
  }

  // 2. Create Skills
  console.log("🎯 Creating 17 skills...")
  const skillMap: Record<string, string> = {}
  for (const skill of SKILLS) {
    const created = await prisma.skill.create({
      data: {
        title: skill.title,
        slug: skill.slug,
        description: skill.description,
        order: skill.order,
        unitId: unitMap[skill.unitSlug],
      }
    })
    skillMap[skill.slug] = created.id
    console.log(`  ✅ ${skill.title}`)
  }

  // 3. Create Lessons
  console.log("📖 Creating lessons...")
  for (const lesson of ALL_LESSONS) {
    await prisma.lesson.create({
      data: {
        title: lesson.title,
        slug: lesson.slug,
        order: lesson.order,
        skillId: skillMap[lesson.skillSlug],
        contentMdx: lesson.contentMdx,
      }
    })
    console.log(`  ✅ ${lesson.title}`)
  }

  // 4. Generate & Insert Questions
  console.log("❓ Generating questions (this may take a moment)...")
  const allQuestions = generateAllQuestions()
  console.log(`  Generated ${allQuestions.length} questions`)

  let inserted = 0
  const batchSize = 50
  for (let i = 0; i < allQuestions.length; i += batchSize) {
    const batch = allQuestions.slice(i, i + batchSize)
    for (const q of batch) {
      try {
        await prisma.question.create({
          data: {
            questionMd: q.questionMd,
            options: q.options,
            correctIndex: q.correctIndex,
            explanationMd: q.explanationMd,
            difficulty: q.difficulty,
            tags: q.tags,
            category: q.category,
            skillId: skillMap[q.skillSlug],
            unitId: unitMap[q.unitSlug],
          }
        })
        inserted++
      } catch (e) {
        // Skip on error (e.g. missing skill mapping)
      }
    }
    console.log(`  Inserted ${inserted}/${allQuestions.length}...`)
  }

  console.log(`\n🎉 Seeding complete!`)
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
