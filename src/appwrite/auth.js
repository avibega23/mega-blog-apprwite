import conf from "../conf/conf.js";
import { Client, Account, ID } from "appwrite";

export class Authservice {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const user = await this.account.create(ID.unique(), email, password);
      if (user) {
        return this.login({ email, password });
      } else {
        return user;
      }
    } catch (error) {
      console.log(`Appwrite :: Auth :: createAccount :: Error :: ${error}`);
    }
  }
  async login({ email, password }) {
    try {
      const session = await this.account.createEmailPasswordSession(
        email,
        password
      );
      return session;
    } catch (error) {
      console.log(`Appwrite :: Auth :: Login :: Error :: ${error}`);
    }
  }

  async getCurrentUser(){
    try {
        return await this.account.get()
    } catch (error) {
        throw error
    }
    return null
  }
  
  async logout(){
    try {
        await this.account.deleteSessions()
    } catch (error) {
        console.log(`Appwrite service :: logout :: error :: ${error}`)
    }
  }
}
const authService = new Authservice();

export default Authservice;
