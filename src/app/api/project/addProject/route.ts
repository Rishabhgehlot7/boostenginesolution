import dbConnect from "@/lib/dbConnect";
import Project, { IProject } from "@/models/Project";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const {
      name,
      description,
      startDate,
      endDate,
      status,
      technologies,
      members,
    } = await req.json();

    const newService: IProject = new Project({
      name,
      description,
      startDate,
      endDate,
      status,
      technologies,
      members,
    });

    await newService.save();
    return Response.json(newService);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
