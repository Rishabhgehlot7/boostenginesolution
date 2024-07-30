import dbConnect from "@/lib/dbConnect";
import FAQ, { FAQDocument } from "@/models/FAQ";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const { question, answer, category, tags, createdAt, updatedAt } =
      await req.json();

    const newService: FAQDocument = new FAQ({
      question,
      answer,
    });

    await newService.save();
    return Response.json(newService);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
