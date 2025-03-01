import { categories } from '@/db/schema';
import { db } from '@/db';
// Create a script to seed categories

const categoryName = [
    "Cars and Vehicles",
    "Comedy",
    "Education",
    "Gaming",
    "Entertainment",
    "Film and Animation",
    "How-to and Style",
    "Music",
    "News and Politics",
    "People and Blogs",
    "Pets and Animals",
    "Science and Technology",
    "Sports",
    "Travel and Events",
];


async function main() {
    console.log("Seeding categories...");

    try {
        const values = categoryName.map((name) => ({
            name,
            description: `Videos related to ${name.toLowerCase()}`,
        }));

        await db.insert(categories).values(values);

        console.log("Categories seeded successfully!");
    } catch (error) {
        console.error("Error seeding categories: ", error);
        process.exit(1);
    }
}

main();