import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client: MongoClient;

async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri!);
        await client.connect();
    }
    return client.db('par3');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const db = await connectToDatabase();
        if (req.method === 'GET') {
            // Example: fetch all claims
            const claims = await db.collection('claims').find({}).toArray();
            res.status(200).json({ claims });
        } else if (req.method === 'POST') {
            // Example: insert a new claim
            const claim = req.body;
            const result = await db.collection('claims').insertOne(claim);
            res.status(201).json({ success: true, insertedId: result.insertedId });
        } else {
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('API error:', error);
        res.status(500).json({ error: 'Internal server error', details: error instanceof Error ? error.message : error });
    }
}
