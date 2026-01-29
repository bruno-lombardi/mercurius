import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // Em desenvolvimento, use uma variável global para preservar o valor
  // entre reloads de módulo causados pelo HMR (Hot Module Replacement)
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // Em produção, é melhor não usar uma variável global
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export uma promise do MongoClient que será compartilhada em toda a aplicação
export default clientPromise;
