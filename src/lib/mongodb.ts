import { MongoClient, MongoClientOptions } from "mongodb";

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

if (process.env.NODE_ENV === "development") {
  if (!globalThis._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
