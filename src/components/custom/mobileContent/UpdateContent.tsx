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
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import DiscountFilter from "../DiscountFilter";

interface IAds {
  image: string;
  link: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [ads, setAds] = useState<IAds[]>([{ image: "", link: "" }]);
  const [files, setFiles] = useState<File[] | null>(null);
  const [heading, setHeading] = useState<string>("");
  const contentId = "669b69bca7c7bbdf043b7f08"; // Replace with the actual content ID

  const addAdRow = () => {
    setAds([...ads, { image: "", link: "" }]);
  };

  const handleAdChange = (index: number, field: keyof IAds, value: string) => {
    const newAds = [...ads];
    newAds[index][field] = value;
    setAds(newAds);
  };

  const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/mobileContent/getContentById/${contentId}`
        );
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setHeading(data.handing);
          setAds(data.images);
        } else {
          throw new Error(data.message || "Failed to fetch content");
        }
      } catch (error) {
        toast({
          title: "Failed to Fetch Content",
          description: (error as Error).message,
          duration: 5000,
        });
      }
    };
    fetchData();
  }, [contentId, toast]);

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    e.preventDefault();
    if (!e.target.files) return;
    const file = e.target.files[0];
    setFiles([file]);

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
        const uploadedUrl = `https://${Bucket}.s3.ap-south-1.amazonaws.com/${fileName}`;
        const newAds = [...ads];
        newAds[index].image = uploadedUrl;
        setAds(newAds);
        toast({
          title: "Image Uploaded",
          description: "Image has been successfully uploaded.",
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
    try {
      const response = await fetch(
        `/api/mobileContent/updateContent/${contentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: ads,
            handing: heading,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Content Saved",
          description: "Your content has been successfully saved.",
          duration: 5000,
        });
      } else {
        throw new Error(data.message || "Failed to save content");
      }
    } catch (error) {
      toast({
        title: "Failed to Save Content",
        description: (error as Error).message,
        duration: 5000,
      });
    }
  };

  const clearAll = () => {
    setAds([{ image: "", link: "" }]);
    setHeading("");
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-950">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-gray-950">
          <form onSubmit={handleSubmit}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 bg-black text-white"
                  onClick={() => router.back()}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Pro Controller
                </h1>
                <Badge
                  variant="outline"
                  className="ml-auto sm:ml-0 bg-black text-white"
                >
                  In stock
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-black text-white hover:bg-white hover:text-black"
                    onClick={clearAll}
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
                    <CardTitle>UI Details</CardTitle>
                    <CardDescription>
                      Title, Sliders, description, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="heading">Headline</Label>
                      <Textarea
                        id="heading"
                        name="heading"
                        placeholder="Headline"
                        className="text-white bg-black"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Slider</Label>
                      {Array.isArray(ads) &&
                        ads.map((ad, index) => (
                          <div key={index} className="flex gap-2">
                            <div>
                              <Input
                                type="file"
                                placeholder="Image"
                                className="text-white bg-black"
                                onChange={(e) => handleImageUpload(e, index)}
                              />
                            </div>
                            <div>
                              <Input
                                type="text"
                                placeholder="Link"
                                className="text-white bg-black"
                                value={ad.link}
                                onChange={(e) =>
                                  handleAdChange(index, "link", e.target.value)
                                }
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-black text-white hover:bg-white hover:text-black border"
                              onClick={() =>
                                setAds(ads.filter((_, i) => i !== index))
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                      <Button type="button" onClick={addAdRow} className="mt-2">
                        Add Variant
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3 bg-black text-white">
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Upload product images</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 bg-black text-white">
                    <div className="grid gap-2">
                      <Label htmlFor="images">Sliders</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Array.isArray(ads) &&
                          ads.map((ad, index) => (
                            <div key={index} className="relative w-24 h-24">
                              {ad.image && (
                                <Image
                                  src={ad.image}
                                  alt={`Product Image ${index + 1}`}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded-lg"
                                />
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="flex gap-2 md:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-black text-white"
                  onClick={clearAll}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  className="w-full bg-black text-white border border-white"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </div>
          </form>
          <DiscountFilter />
        </main>
      </div>
    </div>
  );
}
