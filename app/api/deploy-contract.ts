import { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { MongoClient } from 'mongodb';
import GenerativeNFT from '../../contracts/GenerativeNFT.json';

const uri = process.env.DB_URI;
const client = new MongoClient(uri);

const deployContract = async (data: any) => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_FORMA_CHAIN_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const factory = new ethers.ContractFactory(GenerativeNFT.abi, GenerativeNFT.bytecode, wallet);

  const contract = await factory.deploy(
    data.name,
    data.symbol,
    data.artist,
    process.env.PLATFORM_ADDRESS,
    data.mintPrice,
    data.maxSupply,
    data.royaltyFeeBp,
    data.royaltyReceiver,
    data.generativeScriptURI
  );

  await contract.deployed();
  return contract.address;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const data = req.body;
      const contractAddress = await deployContract(data);

      await client.connect();
      const database = client.db('generative-nft');
      const collections = database.collection('collections');

      await collections.insertOne({
        artist: data.artist,
        contractAddress,
        name: data.name,
        symbol: data.symbol,
        mintPrice: data.mintPrice,
        maxSupply: data.maxSupply,
        royaltyFeeBp: data.royaltyFeeBp,
        royaltyReceiver: data.royaltyReceiver,
        generativeScriptURI: data.generativeScriptURI,
        network: 'testnet'
      });

      res.status(200).json({ contractAddress });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      await client.close();
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
};