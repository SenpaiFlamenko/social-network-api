import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI || "localhost/development-social-network";

export const client = new MongoClient(uri);
export const db = client.db;

await client.connect();
