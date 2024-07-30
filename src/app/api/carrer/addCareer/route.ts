import dbConnect from "@/lib/dbConnect";
import Career, { CareerDocument } from "@/models/Career";

export const POST = async (req: Request, res: Response) => {
  await dbConnect();

  try {
    const {
      position,
      department,
      location,
      jobType,
      description,
      requirements,
      responsibilities,
      salaryRange: { min: minSalary, max: maxSalary },
      isActive,
    } = await req.json();

    const newService: CareerDocument = new Career({
      position,
      department,
      location,
      jobType,
      description,
      requirements,
      responsibilities,
      salaryRange: { min: minSalary, max: maxSalary },
      isActive,
    });

    await newService.save();
    return Response.json(newService);
  } catch (error: any) {
    return Response.json({ message: error.message });
  }
};
