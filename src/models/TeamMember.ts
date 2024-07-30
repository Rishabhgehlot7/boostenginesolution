// models/TeamMember.ts
import mongoose, { Schema } from "mongoose";
export interface ITeamMember extends Document {
  save(): unknown;
  _id?: string; // MongoDB ID
  name: string;
  position: string; // e.g., Developer, Designer, Manager
  email: string;
  phone?: string; // Optional
  skills: string[]; // Array of skills
  experience: number; // Years of experience
  joinedDate: Date; // Date when the member joined
  profilePicture?: string; // URL or path to the profile picture
  isActive: boolean; // Indicates if the member is currently active
  bio?: string; // Optional short biography
}
// models/TeamMemberModel.ts

const TeamMemberSchema: Schema = new Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: "" },
  skills: [{ type: String }],
  experience: { type: Number, required: true },
  joinedDate: { type: Date, required: true },
  profilePicture: { type: String, default: "" },
  isActive: { type: Boolean, default: true },
  bio: { type: String, default: "" },
});

const TeamMemberModel =
(mongoose.models.Team as mongoose.Model<ITeamMember>) ||
mongoose.model<ITeamMember>("Team", TeamMemberSchema);
export default TeamMemberModel;
