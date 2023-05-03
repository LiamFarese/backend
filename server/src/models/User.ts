import { Schema, Types, model } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  userType: "vendor" | "employee" | "administrator";
  vendorId?: Types.ObjectId;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    userType: { type: String, default: "vendor" },
    vendorId: { type: Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const User = model<IUser>("User", UserSchema);

export { IUser, User };

export const createUser = async (username : string, password: string, userType : string, vendorId? : Types.ObjectId) => {
  try {
  
    if (!["vendor", "employee", "administrator"].includes(userType)){
      throw new Error("not a valid user type");
    }
  
    const existingUser = await getUserByUsername(username);
  
      if (existingUser) {
        throw new Error("user already exists" );
      }
    
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
  
    /** creates new user and saves to database */
    const newUser = new User({
      username,
      password: passwordHash,
      userType,
      vendorId,
    });

    return newUser;
  } catch (err: any) {
    throw new Error(`could not create user: ${err.message}`)
  }

}

export const getUserByUsername = async (username: string) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (err: any) {
    throw new Error(`Could not find user, ${err.message}`); 
  }
}

export const getUserWithPassword = async (username :string) => {
  try {
    const userWithPassword = User.findOne({ username: username }).select("+password");
    return userWithPassword;
  } catch (err: any) {
    throw new Error(`Could not find user with password ${err.message}`);
  }
}

export const verifyPassword = async (password : string, user : any ) => {
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      throw new Error("Password does not match");
    }
    /**password set to an empty string since we do not want it sent to the front end, cannot be deleted due to interface */
    user["password"] = "";
    return user;
  } catch (err: any) {
    throw new Error(`could not verify password, ${err.message}`);
  }
}

export const saveUser = async (user : any) => {
  try {
    const savedUser = await user.save(); 
    return savedUser;
  } catch (err: any) {
    throw new Error(`unable to save user, ${err.message}`)
  }

}
