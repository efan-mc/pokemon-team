import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export async function createTeam(teamData) {
    const { name, pokemon, format, slug } = teamData;

    try {
        const team = await prisma.team.create({
            data: {
                name, 
                slug, 
                format: format || null,
                members: {
                    create: pokemon.map((mon, index) => ({
                        slot: index + 1,
                        species: mon.species,
                        nickname: mon.nickname || null,
                        ability: mon.ability || null,
                        item: mon.item || null,
                        teraType: mon.tera || null,
                        nature: mon.nature || null,
                        evs: mon.evs || null,
                        ivs: mon.ivs || null,
                        moves: mon.moves || null,
                        types: mon.types || null,
                        spriteUrl: mon.spriteUrl || null
                    }))
                }
            },
            include: {
                members: {
                    orderBy: { slot: 'asc' }
                }
            }
        });

        return team;
    } catch (error) {
        console.error('Error creating team: ', error);
        throw error;
    }
}