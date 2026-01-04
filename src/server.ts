import app from "./app";
import { prisma } from "./lib/prisma"

const port = process.env.PORT || 5000;

async function main() {
    try {
        await prisma.$connect();
        console.log("database connected");

        app.listen(port, () => {
            console.log(`app is running on ${port}`);
        })
    } catch (error: any) {
        console.error(error.message)

        await prisma.$disconnect();
        process.exit(1);
    }
}

main();