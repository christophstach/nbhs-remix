import { db } from "~/utils/db.server";
import * as bcrypt from "bcryptjs";


async function seed() {
    await db.user.deleteMany();
    await db.area.deleteMany();
    await db.project.deleteMany();
    await db.category.deleteMany();
    await db.subCategory.deleteMany();

    const user1 = await db.user.create({
        data: {
            email: "christoph.stach@gmail.com",
            passwordHash: await bcrypt.hash("123456", parseInt(process.env.BCRYPT_SALT_ROUNDS as string)),
            firstName: "Christoph",
            lastName: "Stach",
            roles: [
                "ADMIN",
                // "EXECUTIVE",
                // "AREA_MANAGER",
                "PROJECT_MANAGER",
                // "PR_MANAGER"
            ]
        }
    });

    const user2 = await db.user.create({
        data: {
            email: "andreas@finhelp.de",
            passwordHash: await bcrypt.hash("123456", parseInt(process.env.BCRYPT_SALT_ROUNDS as string)),
            firstName: "Andreas",
            lastName: "Jansen",
            roles: [
                "ADMIN",
                // "EXECUTIVE",
                // "AREA_MANAGER",
                "PROJECT_MANAGER",
                // "PR_MANAGER"
            ]
        }
    });



    const area = await db.area.create({
        data: {
            name: "Bildung"
        }
    });

    const project1 = await db.project.create({
        data: {
            name: "Schulen",
            managerUserId: user1.id
        }
    });

    const project2 = await db.project.create({
        data: {
            name: "Kindergärten",
            managerUserId: user1.id
        }
    });

    const project3 = await db.project.create({
        data: {
            name: "Strickverein",
            managerUserId: user2.id
        }
    });

    const project4 = await db.project.create({
        data: {
            name: "Yoga im Park",
            managerUserId: user2.id
        }
    });
}


seed();
