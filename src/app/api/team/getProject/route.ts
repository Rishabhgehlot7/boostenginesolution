import dbConnect from "@/lib/dbConnect";
import TeamMemberModel from "@/models/TeamMember";

export const GET = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const services = await TeamMemberModel.find();
    return Response.json(services);
} catch (error: any) {
    return Response.json({ message: error.message });
  }
};
