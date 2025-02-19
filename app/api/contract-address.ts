import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await client.connect();
    const database = client.db('generative-nft');
    const collections = database.collection('collections');

    const contract = await collections.findOne({ artist: req.query.artist });

    if (contract) {
      res.status(200).json({ contractAddress: contract.contractAddress });
    } else {
      res.status(404).json({ error: 'Contract not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
};