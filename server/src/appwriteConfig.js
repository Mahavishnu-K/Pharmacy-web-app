import { Client, Account, ID, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://cloud.appwrite.io/v1') 
    .setProject('67c467cc0016f620a606'); 

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = "67c5501c00283601a5cc";
const COLLECTION_ID = "67c55092000c2fdbb64c";
const STORAGE_BUCKET_ID = "67c5871f0006cdd93bdc";

export { client, account, databases, storage, ID, DATABASE_ID, COLLECTION_ID, STORAGE_BUCKET_ID };