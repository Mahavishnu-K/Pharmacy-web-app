import { Client, Account, ID, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://in-mumbai-1.inpharmaco.in/v1') 
    .setProject('67b354920017541b6db4'); 

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = "67c85f930035b55c32a1";
const COLLECTION_ID = "67c8614c0014b9de23f8";
const STORAGE_BUCKET_ID = "67c861740032a75809b9";

export { client, account, databases, storage, ID, DATABASE_ID, COLLECTION_ID, STORAGE_BUCKET_ID };