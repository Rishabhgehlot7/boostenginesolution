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

export default function BlogPostForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [summary, setSummary] = useState("");
  const [categories, setCategories] = useState<string[]>([""]);
  const [tags, setTags] = useState<string[]>([""]);
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

  const handleCategoryChange = (index: number, value: string) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const addCategoryRow = () => {
    setCategories([...categories, ""]);
  };

  const removeCategoryRow = (index: number) => {
    const newCategories = categories.filter((_, i) => i !== index);
    setCategories(newCategories);
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const addTagRow = () => {
    setTags([...tags, ""]);
  };

  const removeTagRow = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
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
      slug,
      content,
      summary,
      categories,
      tags,
      images: imageUrls,
    };

    console.log(serializedForm);

    try {
      const response = await axios.post("/api/blog/addBlog", serializedForm);
      console.log(response);

      toast({
        title: "Blog Post Created",
        description: "The blog post has been successfully created.",
        duration: 5000,
      });
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast({
        title: "Failed to Create Blog Post",
        description:
          "There was an error creating the blog post. Please try again.",
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
                  Add Blog Post
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
                    <CardTitle>Blog Post Details</CardTitle>
                    <CardDescription>
                      Title, content, categories, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Blog Post Title</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="Blog Post Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        name="slug"
                        placeholder="Slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
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
                      <Label htmlFor="summary">Summary</Label>
                      <Textarea
                        id="summary"
                        name="summary"
                        placeholder="Summary"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Categories</Label>
                      {categories.map((category, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Category"
                            value={category}
                            onChange={(e) =>
                              handleCategoryChange(index, e.target.value)
                            }
                            className="text-white bg-black"
                          />
                          <Button
                            onClick={() => removeCategoryRow(index)}
                            className="text-white bg-black"
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addCategoryRow}
                        className="mt-2 text-white bg-black"
                      >
                        Add Category
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <Label>Tags</Label>
                      {tags.map((tag, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Tag"
                            value={tag}
                            onChange={(e) =>
                              handleTagChange(index, e.target.value)
                            }
                            className="text-white bg-black"
                          />
                          <Button
                            onClick={() => removeTagRow(index)}
                            className="text-white bg-black"
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addTagRow}
                        className="mt-2 text-white bg-black"
                      >
                        Add Tag
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3 text-white bg-black">
                  <CardHeader>
                    <CardTitle>Media</CardTitle>
                    <CardDescription>
                      Upload images for the blog post.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="images">Upload Images</Label>
                      <Input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Uploaded Images</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Uploaded ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              onClick={async () => {
                                const fileName = url.split("/").pop();
                                if (fileName) {
                                  try {
                                    const deleteFromS3 =
                                      new DeleteObjectCommand({
                                        Bucket,
                                        Key: fileName,
                                      });
                                    await s3.send(deleteFromS3);
                                    setImageUrls((prev) =>
                                      prev.filter((imgUrl) => imgUrl !== url)
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error deleting image:",
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
                        ))}
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
