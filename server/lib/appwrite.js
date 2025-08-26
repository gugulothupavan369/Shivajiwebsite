// lib/appwrite.js
import { Client, Storage, ID, Permission, Role } from "node-appwrite";

const client = new Client();

client
  .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your Appwrite endpoint
  .setProject(process.env.APPWRITE_PROJECT_ID) // Your project ID
  .setKey(process.env.APPWRITE_API_KEY); // API key with storage permission

// Now initialize services
export const storage = new Storage(client);

// Export helpers
export const appwriteIds = { ID, Permission, Role };
