import { Client, Account, ID, Databases, Storage, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) 
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

console.log("Appwrite Endpoint:", import.meta.env.VITE_APPWRITE_ENDPOINT);

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const STORAGE_BUCKET_ID = import.meta.env.VITE_APPWRITE_STORAGE_BUCKET_ID;

export { client, account, databases, storage, ID, DATABASE_ID, COLLECTION_ID, STORAGE_BUCKET_ID, Query };