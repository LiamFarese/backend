import { Schema, Types, model } from "mongoose";

interface ISession {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  refreshToken: string;
}

const SessionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true, expires: 86400 }
);

const Session = model<ISession>("Session", SessionSchema);

export { ISession, Session };

export const createSession = (userId : Types.ObjectId, refreshToken: string) => {
  const newSession = new Session({
    userId,
    refreshToken,
  });
  return newSession;
}

export const getSessionByRefreshToken = async (refreshToken: string) => {
  try {
    const foundSession = await Session.findOne({refreshToken: refreshToken});
    if (!foundSession) {
    throw new Error("Invalid refresh token");
    }
    return foundSession;
  } catch (err: any) {
    throw new Error(`could not find session, ${err}`);
  }
}

export const deleteSessionByRefreshToken = async (refreshToken : string) => {
  try {
    const deletedSession = await Session.findOneAndDelete({refreshToken: refreshToken});
    if(!deletedSession){
      throw new Error("session does not exist");
    }
  } catch (err: any) {
    throw new Error(`Could not delete session`);
  }
}
export const saveSession = async (session : any) => {
  try {
    const savedSession = await session.save();
    return savedSession;
  } catch (err: any) {
    throw new Error(`Could not save session ${err}`)
  }
}
