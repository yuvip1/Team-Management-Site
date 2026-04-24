import mongoose, { Schema, type HydratedDocument } from "mongoose";
import { ENV } from "./_core/env";

export type UserRole = "user" | "admin";

export type User = {
  id: string;
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  lastSignedIn?: Date;
};

export type InsertUser = {
  openId: string;
  name?: string | null;
  email?: string | null;
  loginMethod?: string | null;
  role?: UserRole;
  lastSignedIn?: Date;
};

export type TeamMember = {
  id: string;
  name: string;
  rollNumber: string;
  year: string;
  degree: string;
  aboutProject?: string | null;
  hobbies?: string | null;
  certificate?: string | null;
  internship?: string | null;
  aboutYourAim?: string | null;
  imageUrl?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export type InsertTeamMember = Omit<TeamMember, "id" | "createdAt" | "updatedAt">;

const userSchema = new Schema(
  {
    openId: { type: String, required: true, unique: true, index: true },
    name: { type: String, default: null },
    email: { type: String, default: null },
    loginMethod: { type: String, default: null },
    role: { type: String, enum: ["user", "admin"], default: "user", required: true },
    lastSignedIn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const teamMemberSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    year: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    aboutProject: { type: String, default: null },
    hobbies: { type: String, default: null },
    certificate: { type: String, default: null },
    internship: { type: String, default: null },
    aboutYourAim: { type: String, default: null },
    imageUrl: { type: String, default: null },
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
const TeamMemberModel =
  mongoose.models.TeamMember || mongoose.model("TeamMember", teamMemberSchema);

let connectionPromise: Promise<typeof mongoose> | null = null;

function mongoUrl() {
  return process.env.MONGODB_URI || ENV.mongoUrl || "mongodb://127.0.0.1:27017/student_team_management";
}

export async function getDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(mongoUrl()).then((conn) => {
      console.log("[MongoDB] Connected successfully");
      return conn;
    });
  }

  await connectionPromise;
  return mongoose.connection;
}

function normalizeUser(doc: any): User {
  return {
    id: doc._id.toString(),
    openId: doc.openId,
    name: doc.name ?? null,
    email: doc.email ?? null,
    loginMethod: doc.loginMethod ?? null,
    role: doc.role,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    lastSignedIn: doc.lastSignedIn,
  };
}

function normalizeTeamMember(doc: any): TeamMember {
  return {
    id: doc._id.toString(),
    name: doc.name,
    rollNumber: doc.rollNumber,
    year: doc.year,
    degree: doc.degree,
    aboutProject: doc.aboutProject ?? null,
    hobbies: doc.hobbies ?? null,
    certificate: doc.certificate ?? null,
    internship: doc.internship ?? null,
    aboutYourAim: doc.aboutYourAim ?? null,
    imageUrl: doc.imageUrl ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  await getDb();

  const updateData: Partial<InsertUser> = {
    name: user.name ?? null,
    email: user.email ?? null,
    loginMethod: user.loginMethod ?? null,
    lastSignedIn: user.lastSignedIn ?? new Date(),
    role: user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user"),
  };

  await UserModel.findOneAndUpdate(
    { openId: user.openId },
    { $set: updateData, $setOnInsert: { openId: user.openId } },
    { upsert: true, new: true }
  );
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  await getDb();
  const user = await UserModel.findOne({ openId }).lean();
  return user ? normalizeUser(user) : undefined;
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  await getDb();
  const members = await TeamMemberModel.find().sort({ createdAt: -1 }).lean();
  return members.map(normalizeTeamMember);
}

export async function getTeamMemberById(id: string): Promise<TeamMember | undefined> {
  await getDb();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return undefined;
  }

  const member = await TeamMemberModel.findById(id).lean();
  return member ? normalizeTeamMember(member) : undefined;
}

export async function createTeamMember(data: InsertTeamMember): Promise<TeamMember | null> {
  await getDb();
  const member = await TeamMemberModel.create(data);
  return normalizeTeamMember(member.toObject());
}
