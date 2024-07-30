import dbConnect from "@/lib/dbConnect";
import BlogPost, { IBlogPost } from "@/models/Blog";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const {
      title,
      slug,
      content,
      summary,
      categories,
      tags,
      images,
      // author,
      // publishedAt,
      // updatedAt,
      // isPublished,
      // views,
      // comments,
    } = await req.json();

    const newService: IBlogPost = new BlogPost({
      title,
      slug,
      content,
      summary,
      categories,
      tags,
      images,
      // author,
      // publishedAt,
      // updatedAt,
      // isPublished,
      // views,
      // comments,
    });

    await newService.save();
    console.log(newService);

    return Response.json(newService);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
