import dbConnect from "@/lib/dbConnect";
import Application, { ApplicationSchema } from "@/models/Application";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const {
      careerId,
      applicantName,
      applicantEmail,
      applicantPhone,
      coverLetter,
      resumeUrl,
      status,
      appliedAt,
    } = await req.json();

    const newService: ApplicationSchema = new Application({
      careerId,
      applicantName,
      applicantEmail,
      applicantPhone,
      coverLetter,
      resumeUrl,
      status,
      appliedAt,
    });

    await newService.save();
    return Response.json(newService);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
