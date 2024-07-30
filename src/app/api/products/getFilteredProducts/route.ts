import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
type Item = string | number;

function separateColorsAndSizes(items: Item[]): {
  colors1: string[];
  sizes1: Item[];
} {
  const colors1: string[] = [];
  const sizes1: Item[] = [];

  items.forEach((item) => {
    // Assuming sizes are represented as numeric or standard size strings
    if (
      typeof item === "number" ||
      ["XS", "S", "M", "L", "XL", "XXL"].includes(item.toString().toUpperCase())
    ) {
      sizes1.push(item);
    } else {
      colors1.push(item.toString().toLowerCase());
    }
  });

  return { colors1, sizes1 };
}
export async function POST(req: Request, context: any) {
  await dbConnect();

  const { categories, price, sizes, styles, colors } = await req.json();
  console.log({ categories, price, sizes, styles, colors });
  const { colors1, sizes1 } = separateColorsAndSizes(sizes);
  try {
    // Build the query object
    let query: any = {};

    // Filter by categories
    if (categories && categories.length > 0) {
      query.category = { $in: categories };
    }

    // Filter by price range
    if (price) {
      const [minPrice, maxPrice] = price.split("-").map(Number);
      query["stock.price"] = { $gte: minPrice, $lte: maxPrice };
    }

    // Filter by sizes
    if (sizes1 && sizes1.length > 0) {
      query["stock.size"] = { $in: sizes1 };
    }

    // Filter by styles (assuming styles are part of product properties)
    if (styles && styles.length > 0) {
      query.subcategory = { $in: styles };
    }
    
    // Filter by colors (single string match, not array)
    if (colors1.length > 0) {
      query["stock.color"] = { $in: colors1.map(color => new RegExp(`^${color}$`, 'i')) };
    }
    console.log(query);

    const products = await Product.find(query);

    return Response.json(products, {
      status: 200,
    });
  } catch (error) {
    return Response.json(
      { message: "Error fetching products", error },
      {
        status: 500,
      }
    );
  }
}
