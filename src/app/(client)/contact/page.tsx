"use client";
import QueryForm from "@/components/custom/QueryForm";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you would typically handle form submission,
    // such as sending the form data to the server.
    // console.log("Form submitted:", formData);
  };

  return (
    <div className="container mx-auto p-4 text-white bg-black">
      <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
      <div>
        <div className="flex flex-col gap-3 bg-gray-900 rounded-2xl p-5">
          You may contact us using the information below:
          <div>
            <h3 className="text-sm">Company Name:</h3> BOOST ENGINE
          </div>
          <div>
            <h3 className="text-sm">Registered Address: </h3>
            [Your Registered Address], [City], [State], 
          </div>
          <div>PIN: [Your PIN Code] </div>
          <div>
            <h3 className="text-sm">Operational Address:</h3> [Your Operational Address], [City], [State], 
          </div>
          <div>
            <h3 className="text-sm">PIN:</h3>[Your PIN Code]
          </div>
          <div>
            <h3 className="text-sm">Telephone No:</h3>+91-[Your Phone Number]
          </div>
          <div>
            <h3 className="text-sm">E-Mail ID:</h3> [Your Email ID]
          </div>
        </div>
      </div>
      <QueryForm />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-5">
        <div className="border p-4 flex flex-col items-center gap-2">
          <Mail />
          <div>Email Us</div>
          <p className="text-center">You are welcome to send us an email</p>
          <Link href="mailto:[Your Email ID]" passHref>
            <Button className="bg-black text-white border w-full">
              Send Email
            </Button>
          </Link>
        </div>
        <div className="border p-4 flex flex-col items-center gap-2">
          <Phone />
          <div>Call us</div>
          <p>We&apos;re here to talk to you</p>
          <Link href="tel:+91[Your Phone Number]" passHref>
            <Button className="bg-black text-white border w-full">
              +91-[Your Phone Number]
            </Button>
          </Link>
        </div>
        <div className="border p-4 flex flex-col items-center gap-2">
          <MessageSquare />
          <div>WhatsApp</div>
          <p>We are here and ready to chat</p>
          <Link href="https://wa.me/+91[Your Phone Number]" passHref>
            <Button className="bg-black text-white border w-full">
              Start Chat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
