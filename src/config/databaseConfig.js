import "dotenv/config";
import { MongoClient } from "mongodb";
const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const MONGODB_URL = process.env.MONGODB_URL || `mongodb+srv://${username}:${password}@cluster0.1t0pt4c.mongodb.net/?retryWrites=true&w=majority`;

let dbEmp , dbMan , dbSuper , dbUser;
const databaseconnect = async () => {
    const client = new MongoClient(MONGODB_URL);
    await client.connect();
    dbEmp = client.db("userEmp");
    dbMan = client.db("userMan");
    dbSuper = client.db("super");
    dbUser = client.db("user");
}

export { dbEmp , dbMan , dbSuper , dbUser , databaseconnect};