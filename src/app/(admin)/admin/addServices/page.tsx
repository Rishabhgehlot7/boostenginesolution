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
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function ServiceForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[] | null>(null);

  const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const addFeatureRow = () => {
    setFeatures([...features, ""]);
  };

  const removeFeatureRow = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setFiles(filesArray);

    const uploadedUrls: string[] = [];

    const promises = filesArray.map((file) => {
      const ext = file.name.split(".").at(-1);
      const uid = uuidv4().replace(/-/g, "");
      const fileName = `${uid}${ext ? "." + ext : ""}`;

      const uploadToS3 = new PutObjectCommand({
        Bucket,
        Key: fileName,
        Body: file,
        ACL: "public-read",
      });

      return s3.send(uploadToS3).then((response) => {
        if (response.$metadata.httpStatusCode === 200) {
          const url = `https://${Bucket}.s3.amazonaws.com/${fileName}`;
          uploadedUrls.push(url);
          setImageUrls((prev) => [...prev, url]);
        }
      });
    });

    try {
      await Promise.all(promises);
      console.log("All files uploaded successfully");
      toast({
        title: "Images Uploaded",
        description: "All images have been successfully uploaded.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Failed to Upload Images",
        description: "There was an error uploading images. Please try again.",
        duration: 5000,
      });
      console.error(error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serializedForm = {
      title,
      description,
      price: Number(price),
      duration,
      features,
      images: imageUrls,
    };

    console.log(serializedForm);

    try {
      const response = await axios.post(
        "/api/serviceController/addService",
        serializedForm
      );

      toast({
        title: "Service Created",
        description: "The service has been successfully created.",
        duration: 5000,
      });
      router.push("/admin/services");
    } catch (error) {
      console.error("Error creating service:", error);
      toast({
        title: "Failed to Create Service",
        description: "There was an error creating the service. Please try again.",
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
                  Add Service
                </h1>
                <Badge variant="outline" className="ml-auto sm:ml-0 bg-black text-white">
                  New
                </Badge>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                  <Button variant="outline" size="sm" className="bg-black text-white hover:bg-white hover:text-black">
                    Discard
                  </Button>
                  <Button size="sm" className="bg-black text-white hover:bg-white hover:text-black border" type="submit">
                    Save
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-8">
                <Card className="col-span-5 text-white bg-black">
                  <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                    <CardDescription>Title, description, price, etc.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Service Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Service Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        name="price"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        name="duration"
                        placeholder="Duration (e.g., '2 weeks', '1 month')"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Features</Label>
                      {features.map((feature, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Feature"
                            value={feature}
                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                            className="text-white bg-black"
                          />
                          <Button onClick={() => removeFeatureRow(index)} className="text-white bg-black">
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button type="button" onClick={addFeatureRow} className="mt-2 text-white bg-black">
                        Add Feature
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3 bg-black text-white">
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>Upload images for the service</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="imageUpload">Upload Images</Label>
                      <Input
                        id="imageUpload"
                        name="imageUpload"
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      {imageUrls.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="relative">
                              <img src={url} alt={`Uploaded ${index}`} className="h-20 w-20 object-cover" />
                              <Button
                                size="sm"
                                className="absolute top-0 right-0 bg-black text-white hover:bg-white hover:text-black"
                                onClick={async () => {
                                  try {
                                    const key = url.split("/").pop();
                                    const deleteCommand = new DeleteObjectCommand({
                                      Bucket,
                                      Key: key,
                                    });
                                    await s3.send(deleteCommand);
                                    setImageUrls((prev) => prev.filter((_, i) => i !== index));
                                  } catch (error) {
                                    toast({
                                      title: "Failed to Delete Image",
                                      description: "There was an error deleting the image. Please try again.",
                                      duration: 5000,
                                    });
                                    console.error(error);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
