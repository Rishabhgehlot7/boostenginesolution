import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the blog post document
export interface IBlogPost extends Document {
  _id?: string;
  title: string;
  slug: string; // URL-friendly version of the title
  content: string;
  summary: string; // Brief summary of the post
  categories: string[]; // References to categories
  tags: string[]; // Tags for searchability
  images: string[];
}

// Define the schema for the blog post
const BlogPostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    summary: { type: String, required: true },
    categories: [{ type: String }],
    tags: [{ type: String }],
    images: { type: [String], required: true },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Create the model
const BlogPost =
  (mongoose.models.BlogPost as mongoose.Model<IBlogPost>) ||
  mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
