import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error("Please provide an email address.");
        console.log("Usage: npx tsx scripts/make-admin.ts <email>");
        process.exit(1);
    }

    console.log(`Promoting ${email} to ADMIN and Verifying...`);

    try {
        const user = await prisma.user.update({
            where: { email },
            data: {
                role: 'ADMIN',
                isVerified: true,
            },
        });

        console.log("Success! User updated:");
        console.log(`Name: ${user.name}`);
        console.log(`Role: ${user.role}`);
        console.log(`Verified: ${user.isVerified}`);
    } catch (error) {
        console.error("Error updating user. Make sure the email exists.");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
