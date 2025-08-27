import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service {
  client;
  databases;
  bucket;

  constructor() {
    this.client = new Client();
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      const document = await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title: title,
          content: content,
          status: status,
          userId: userId,
        }
      );
      return document
    } catch (error) {
      console.log(`Appwrite Service :: Database :: CreatePost :: Error ${error}`);
    }
  }

  async updatePost(slug,{ title, content, featuredImage, status, userId })
  {
    try {
      return await this.databases.upsertDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
          userId
        }
      )
    } catch (error) {
      console.log(`Appwrite :: Databases :: UpdatePost :: Error :: ${error}`)
    }
  }

  async deletePost(slug){
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      )
    } catch (error) {
      console.log(`Appwrite :: Databases :: DeletePost :: Error :: ${error}`)
      return false
    }
  }

  async getPost(slug){
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      )
    } catch (error) {
      console.log(`Appwrite :: Databases :: GetPost :: Error :: ${error}`)
    }
  }

  async getPosts(queries = [Query.equal('status','active')]){
    try {
      this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      )
    } catch (error) {
      console.log(`Appwrite :: Databases :: GetPosts :: Error :: ${error}`)
      return false
    }
  }

  async uploadFile(file)
  {
    try {
      return this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      )
    } catch (error) {
      console.log(`Appwrite :: Databases :: UploadPhoto :: ${error}`)
      return false
    }
  }

  async deleteFile(fileId){
    try {
      await this.bucket.deleteFile(
        conf.appwriteBucketId,
        fileId
      )
    } catch (error) {
      console.log(`Appwrite :: Databases :: DeleteFile :: ${error}`)
      return false
    }
  }

  getFilePreview(fileId){
    conf.appwriteBucketId,
    fileId
  }
}

const service = new Service();
export default service;
