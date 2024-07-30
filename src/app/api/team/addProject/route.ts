import dbConnect from "@/lib/dbConnect";
import TeamMemberModel, { ITeamMember } from "@/models/TeamMember";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const {
      name,
      position,
      email,
      phone,
      skills,
      experience,
      joinedDate,
      profilePicture,
      bio,
    } = await req.json();

    const newService: ITeamMember = new TeamMemberModel({
      name,
      position,
      email,
      phone,
      skills,
      experience,
      joinedDate,
      profilePicture,
      bio,
    });

    await newService.save();
    return Response.json(newService);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
