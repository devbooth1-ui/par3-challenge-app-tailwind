import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../util/mongodb';
import { runMiddleware } from '../../util/runMiddleware';
import Cors from 'cors';
import { isValidEmail } from '../../util/validators';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB = process.env.MONGODB_DB || 'par3';

const cors = Cors({
    methods: ['GET', 'POST', 'OPTIONS'],
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await runMiddleware(req, res, cors);

    if (!MONGODB_URI) return res.status(500).json({ error: 'Missing MONGODB_URI env var' });

    const client = await connectToDatabase();
    const db = client.db(MONGODB_DB);
    const players = db.collection('players');

    if (req.method === 'GET') {
        try {
            const allPlayers = await players.find({}).toArray();
            return res.status(200).json({ players: allPlayers });
        } catch (err) {
            return res.status(500).json({ error: 'Failed to fetch players' });
        }
    }

    if (req.method === 'POST') {
        const { name, email, phone, stats, claim, courseId } = req.body;
        const normalizedEmail = (email || '').toLowerCase().trim();

        // Validate required fields
        if (!name || !normalizedEmail || !isValidEmail(normalizedEmail)) {
            return res.status(400).json({ error: 'Missing or invalid required fields: name, email' });
        }

        try {
            let player = await players.findOne({ email: normalizedEmail });

            // Extract award from claim if present
            let newAward = null;
            if (claim && claim.claimType) {
                newAward = claim.claimType;
            }

            if (player) {
                // Always update player info and stats
                const updateOps: any = { $set: { name, phone, stats } };
                // Prepare $push for claims, courses, awards
                const pushOps: any = {};
                // Prevent duplicate claims
                if (claim) {
                    const hasClaim = Array.isArray(player.claims) && player.claims.some((c: any) => JSON.stringify(c) === JSON.stringify(claim));
                    if (!hasClaim) {
                        pushOps.claims = claim;
                    }
                }
                // Prevent duplicate courses
                if (courseId) {
                    if (!Array.isArray(player.coursesPlayed) || !player.coursesPlayed.includes(courseId)) {
                        pushOps.coursesPlayed = courseId;
                    }
                }
                // Add award if not already present
                if (newAward) {
                    if (!Array.isArray(player.awards) || !player.awards.includes(newAward)) {
                        pushOps.awards = newAward;
                    }
                }
                // Only add $push if there are items to push
                if (Object.keys(pushOps).length > 0) {
                    await players.updateOne({ email: normalizedEmail }, { ...updateOps, $push: pushOps });
                } else {
                    await players.updateOne({ email: normalizedEmail }, updateOps);
                }
                player = await players.findOne({ email: normalizedEmail });
            } else {
                // Insert new player with claims/courses/awards arrays
                const newPlayer: any = {
                    name,
                    email: normalizedEmail,
                    phone,
                    stats,
                    claims: claim ? [claim] : [],
                    coursesPlayed: courseId ? [courseId] : [],
                    awards: newAward ? [newAward] : []
                };
                const result = await players.insertOne(newPlayer);
                player = await players.findOne({ _id: result.insertedId });
            }

            return res.status(200).json(player);
        } catch (err) {
            return res.status(500).json({ error: 'Failed to save player' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}