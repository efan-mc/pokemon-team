import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTeamBySlug(slug) {
    try {
        const team = await prisma.team.findUnique({
            where: { slug },
            include: {
                members: {
                    orderBy: { slot: 'asc' }
                }
            }
        });
    
        return team;
    } catch (error) {
        console.error('Error fetching team:', error);
        throw error;
    }
}