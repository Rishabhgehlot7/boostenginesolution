import MobileContent from "@/models/MobileContent";
import { NextApiResponse } from "next";
export async function POST(req: any, res: NextApiResponse) {
  const { images, handing } = await req.json();
  try {
    const newContent = await MobileContent.create({ images, handing });
    console.log(newContent);

    return Response.json(newContent);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
}
