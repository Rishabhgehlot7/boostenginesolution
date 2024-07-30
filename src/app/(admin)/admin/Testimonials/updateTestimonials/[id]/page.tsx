"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
    DeleteObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function TestimonialForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const param = useParams();
  const serviceId = param.id;
  useEffect(() => {
    const fetchServiceData = async () => {
      if (serviceId) {
        try {
          const { data } = await axios.get(`/api/testimonials/getProject/${serviceId}`);
          console.log(data);
          setName(data.name);
          setContent(data.content);
          setAvatarUrl(data.avatarUrl);
        } catch (error) {
          toast({
            title: "Failed to Fetch Service Data",
            description:
              "There was an error fetching the service data. Please try again.",
            duration: 5000,
          });
          console.error(error);
        }
      }
    };

    fetchServiceData();
  }, [serviceId, toast]);
  const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    const file = e.target.files[0];
    setFile(file);

    const ext = file.name.split(".").at(-1);
    const uid = uuidv4().replace(/-/g, "");
    const fileName = `${uid}${ext ? "." + ext : ""}`;

    const uploadToS3 = new PutObjectCommand({
      Bucket,
      Key: fileName,
      Body: file,
      ACL: "public-read",
    });

    try {
      const response = await s3.send(uploadToS3);
      if (response.$metadata.httpStatusCode === 200) {
        const url = `https://${Bucket}.s3.amazonaws.com/${fileName}`;
        setAvatarUrl(url);
        toast({
          title: "Image Uploaded",
          description: "The image has been successfully uploaded.",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to Upload Image",
        description:
          "There was an error uploading the image. Please try again.",
        duration: 5000,
      });
      console.error(error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serializedForm = {
      name,
      content,
      rating,
      avatarUrl,
    };

    console.log(serializedForm);

    try {
      const response = await axios.post(
        "/api/testimonials/addProject",
        serializedForm
      );
      console.log(response);

      toast({
        title: "Testimonial Created",
        description: "The testimonial has been successfully created.",
        duration: 5000,
      });
      router.push("/admin/Testimonials");
    } catch (error) {
      console.error("Error creating testimonial:", error);
      toast({
        title: "Failed to Create Testimonial",
        description:
          "There was an error creating the testimonial. Please try again.",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-950">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-gray-950">
          <form onSubmit={handleSubmit}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Add Testimonial
                </h1>
                <Badge
                  variant="outline"
                  className="ml-auto sm:ml-0 bg-black text-white"
                >
                  New
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black text-white hover:bg-white hover:text-black"
                  >
                    Discard
                  </Button>
                  <Button
                    size="sm"
                    className="bg-black text-white hover:bg-white hover:text-black border"
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-8">
                <Card className="col-span-5 text-white bg-black">
                  <CardHeader>
                    <CardTitle>Testimonial Details</CardTitle>
                    <CardDescription>
                      Name, content, rating, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        name="content"
                        placeholder="Content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        name="rating"
                        type="number"
                        placeholder="Rating (1-5)"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="text-white bg-black"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3 text-white bg-black">
                  <CardHeader>
                    <CardTitle>Avatar</CardTitle>
                    <CardDescription>
                      Upload an avatar for the testimonial.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="avatar">Upload Avatar</Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Uploaded Avatar</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {avatarUrl && (
                          <div className="relative">
                            <img
                              src={avatarUrl}
                              alt="Uploaded Avatar"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              onClick={async () => {
                                const fileName = avatarUrl.split("/").pop();
                                if (fileName) {
                                  try {
                                    const deleteFromS3 =
                                      new DeleteObjectCommand({
                                        Bucket,
                                        Key: fileName,
                                      });
                                    await s3.send(deleteFromS3);
                                    setAvatarUrl("");
                                  } catch (error) {
                                    console.error(
                                      "Error deleting avatar:",
                                      error
                                    );
                                  }
                                }
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600"
                            >
                              X
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex md:hidden">
                <Button variant="outline" size="sm" className="w-full">
                  Discard
                </Button>
                <Button size="sm" className="w-full">
                  Save
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
