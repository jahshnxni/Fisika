
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const GACHA_ITEMS = [
    // --- SKINS (S & A Tier) ---
    { id: "skin_default", name: "Junior Physicist", type: "SKIN", rarity: "C", dropRate: 0, description: "Seragam standar siswa fisika." },
    { id: "skin_fluida", name: "Fluida Master", type: "SKIN", rarity: "B", dropRate: 5.0, description: "Jubah air yang mengalir melawan gravitasi." },
    { id: "skin_wave", name: "Wave Surveyor", type: "SKIN", rarity: "B", dropRate: 5.0, description: "Pakaian dengan pola neon berdenyut." },
    { id: "skin_thermo", name: "Thermo Vanguard", type: "SKIN", rarity: "B", dropRate: 5.0, description: "Setengah api, setengah es." },
    { id: "skin_einstein", name: "Astronaut Einstein", type: "SKIN", rarity: "S", dropRate: 0.5, description: "Kostum luar angkasa legendaris. Bonus Coin +20%." },
    { id: "skin_blackhole", name: "Black Hole Cloak", type: "SKIN", rarity: "S", dropRate: 0.5, description: "Jubah yang menyerap cahaya di sekitarnya." },

    // --- PETS (A & B Tier) ---
    { id: "pet_aquabot", name: "Aqua-Bot", type: "PET", rarity: "B", dropRate: 5.0, description: "Robot ubur-ubur dalam bola air." },
    { id: "pet_echobat", name: "Echo-Bat", type: "PET", rarity: "B", dropRate: 5.0, description: "Kelelawar speaker yang bergetar." },
    { id: "pet_piston", name: "Piston Panda", type: "PET", rarity: "B", dropRate: 5.0, description: "Panda dengan helm mesin uap." },
    { id: "pet_blackhole_mini", name: "Mini Black Hole", type: "PET", rarity: "A", dropRate: 2.0, description: "Anomali gravitasi peliharaan." },
    { id: "pet_schrodinger", name: "Schrödinger’s Cat", type: "PET", rarity: "A", dropRate: 2.0, description: "Kucing yang ada dan tiada secara bersamaan." },

    // --- PROPS (B Tier) ---
    { id: "prop_gold_table", name: "Meja Lab Emas", type: "PROP", rarity: "B", dropRate: 10.0, description: "Meja eksperimen berlapis emas murni." },
    { id: "prop_lightning", name: "Aura Petir", type: "PROP", rarity: "B", dropRate: 10.0, description: "Efek listrik statis di sekitar karakter." },
    { id: "prop_lofi", name: "Lofi Radio", type: "PROP", rarity: "B", dropRate: 10.0, description: "Radio tua yang memutar musik santai." },

    // --- CONSUMABLES (C Tier - High Drop Rate) ---
    { id: "item_coin_small", name: "Kantong Koin (Small)", type: "CONSUMABLE", rarity: "C", dropRate: 15.0, description: "Berisi 100 Edu-Coins." },
    { id: "item_coin_medium", name: "Kantong Koin (Medium)", type: "CONSUMABLE", rarity: "C", dropRate: 10.0, description: "Berisi 500 Edu-Coins." },
    { id: "item_hint", name: "Hint Token", type: "CONSUMABLE", rarity: "C", dropRate: 15.0, description: "Bantuan untuk menjawab soal sulit." },
]

async function main() {
    console.log("🎲 Seeding Gacha Items...")

    for (const item of GACHA_ITEMS) {
        await prisma.gachaItem.upsert({
            where: { id: item.id },
            update: item,
            create: item,
        })
        console.log(`  ✅ ${item.name} (${item.rarity})`)
    }

    console.log("✨ Gacha seeding complete!")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
