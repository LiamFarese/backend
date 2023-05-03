import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";


export const connect = async () => {
    const server = await mongoose
  .connect("mongodb+srv://test:test@testdata.kbdu8os.mongodb.net/?retryWrites=true&w=majority")

}  

export const drop = async () => {
    await mongoose.connection.dropDatabase();
} 

export const close = async () => {
    await mongoose.connection.close();
}