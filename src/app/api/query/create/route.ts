import QueryModel, { IQuery } from "@/models/QuerySchema";

export const POST = async (req: Request, res: Response) => {
  const { name, email, message } = await req.json();
  console.log(name, email, message);

  try {
    // Create a new query document
    const newQuery: IQuery = new QueryModel({
      name,
      email,
      message,
    });

    // Save the document to the database
    await newQuery.save();

    return Response.json(newQuery);
  } catch (err) {
    console.error(err);
    return Response.json(err);
  }
};
