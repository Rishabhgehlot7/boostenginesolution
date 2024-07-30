"use client";
import HomeSlider from "@/components/custom/home/HomeSlider";
import MobileSlider from "@/components/custom/home/MobileSlider";
import { useReviews } from "@/lib/hooks/useReviews";
import { useUser } from "@/lib/hooks/useUser";
import axios from "axios";
import { Link } from "lucide-react";
import { cache, useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
interface IStock {
  id: string;
  stock: number;
  color: string;
  price: number;
  size: string;
}

interface Product {
  _id: string;
  name: string;
  description: string;
  status: string;
  images: string[];
  stock: IStock[];
  category: string; // Updated to include category
  subcategory?: string; // Optional subcategory
  isArchived: boolean;
}
const Page = () => {
  const { reviews } = useReviews();
  const { user, error, updateUser, setLoadingState, setErrorState } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setloading] = useState(true);
  // const router = useRouter();
  useEffect(() => {
    const fetchData = cache(async () => {
      try {
        const response = await axios.get("/api/products");
        // // // // // console.log("Product data:", response.data);
        setProducts(response.data || []);
        setloading(false);
      } catch (error) {
        // // console.error("Error fetching products:", error);
      }
    });
    fetchData();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingState(true);
      try {
        const response = await axios.get("/api/users/getUserById"); // Replace USER_ID with actual ID
        updateUser(response.data);
      } catch (error: any) {
        setErrorState(error.message);
      } finally {
        setLoadingState(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }

  // // // // // console.log(user);
  return (
    <div className="black w-full">
      {/* top poster */}
      <HomeSlider />
      <MobileSlider />
      <section className="relative h-screen bg-blue-900 text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          {/* <img
            src="https"
            alt="Background"
            className="w-full h-full object-cover opacity-50"
          /> */}
        </div>
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Boost Engine</h1>
          <p className="text-xl mb-8">
            Accelerate Your Business with Our Innovative Solutions
          </p>
          <div
            // href="#services"
            className="bg-yellow-500 text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300"
          >
            Get Started
          </div>
        </div>
      </section>
      <section className="relative bg-blue-900 text-white h-screen flex flex-col justify-center items-center text-center">
        {/* <Image
          src={heroImage}
          alt="Hero Image"
          className="absolute inset-0 object-cover opacity-50"
          layout="fill"
        /> */}
        <div className="relative z-10 p-4">
          <h1 className="text-5xl font-bold mb-4">Welcome to Boost Engine</h1>
          <p className="text-xl mb-6">
            Innovative Solutions for Your Tech Needs
          </p>
          <Link href="#contact">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300">
              Get Started
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {/* <Image
                src={feature1}
                alt="Feature 1"
                width={50}
                height={50}
                className="mx-auto mb-4"
              /> */}
              <h3 className="text-xl font-semibold mb-2">Feature One</h3>
              <p className="text-gray-600">
                Description of feature one, explaining its benefits and use
                cases.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {/* <Image
                src={feature2}
                alt="Feature 2"
                width={50}
                height={50}
                className="mx-auto mb-4"
              /> */}
              <h3 className="text-xl font-semibold mb-2">Feature Two</h3>
              <p className="text-gray-600">
                Description of feature two explaining its benefits and use
                cases.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              {/* <Image
                src={feature3}
                alt="Feature 3"
                width={50}
                height={50}
                className="mx-auto mb-4"
              /> */}
              <h3 className="text-xl font-semibold mb-2">Feature Three</h3>
              <p className="text-gray-600">
                Description of feature three explaining its benefits and use
                cases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
          <div className="flex flex-col md:flex-row justify-center gap-8">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <p className="text-lg mb-4">
                Boost Engine provided us with exceptional service and support.
                Highly recommend!
              </p>
              <p className="font-semibold">Client Name</p>
              <p className="text-gray-600">Company</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
              <p className="text-lg mb-4">
                The team at Boost Engine is knowledgeable and professional. Our
                project was a success.
              </p>
              <p className="font-semibold">Client Name</p>
              <p className="text-gray-600">Company</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section
        id="contact"
        className="py-16 bg-blue-900 text-white text-center"
      >
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Boost Your Business?
          </h2>
          <p className="text-xl mb-6">
            Contact us today to get started on your next project with Boost
            Engine.
          </p>
          <Link href="/contact">
            <div className="bg-yellow-500 text-black px-6 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-600 transition duration-300">
              Contact Us
            </div>
          </Link>
        </div>
      </section>
      {/* <StyleComponent /> */}
    </div>
  );
};

export default Page;
