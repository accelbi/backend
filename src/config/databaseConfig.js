import "dotenv/config";
import { MongoClient } from "mongodb";
const username = encodeURIComponent(process.env.MONGO_USERNAME);
const password = encodeURIComponent(process.env.MONGO_PASSWORD);
const MONGODB_URL = process.env.MONGODB_URL || `mongodb+srv://${username}:${password}@cluster0.1t0pt4c.mongodb.net/?retryWrites=true&w=majority`;
let dbEmp , dbMan , dbSuper , dbUser;
let client; 

const databaseconnect = async () => {
    try {
        if (!client) {
            client = new MongoClient(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        }
        if (!client && !client.isConnected()) {
            await client.connect();
            console.log("Connected correctly to server");
        }

        dbEmp = client.db("userEmp");
        dbMan = client.db("userMan");
        dbSuper = client.db("super");
        dbUser = client.db("user");
    } catch (err) {
        console.log(err.stack);
    }
};



export { dbEmp , dbMan , dbSuper , dbUser , databaseconnect};


