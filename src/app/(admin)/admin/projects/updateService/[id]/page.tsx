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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
import { ChevronLeft, Trash } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
import { v4 as uuidv4 } from "uuid";
export default function ProjectDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    status: "planned",
    technologies: [""],
    members: [{ name: "", role: "" }],
  });
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [files, setFiles] = useState<File[] | null>(null);
  const [loading, setLoading] = useState(false);
  const param = useParams();
  const serviceId = param.id;

  useEffect(() => {
    const fetchServiceData = async () => {
      if (serviceId) {
        try {
          const { data } = await axios.get(
            `/api/project/getProject/${serviceId}`
          );
          console.log(data);

          setImageUrls(data.images);
          setProjectData({
            ...data,
          });
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

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };
  const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const handleArrayChange = (
    index: number,
    name: string,
    value: string,
    type: "technologies" | "members",
    memberField?: "name" | "role"
  ) => {
    const updatedArray = [...projectData[type]];
    if (type === "members" && memberField) {
      (updatedArray[index] as any)[memberField] = value;
    } else {
      updatedArray[index] = value;
    }
    setProjectData({ ...projectData, [type]: updatedArray });
  };

  const handleArrayRemove = (
    index: number,
    type: "technologies" | "members"
  ) => {
    const updatedArray = [...projectData[type]];
    updatedArray.splice(index, 1);
    setProjectData({ ...projectData, [type]: updatedArray });
  };
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
          const url = `https://${Bucket}.s3.ap-south-1.amazonaws.com/${fileName}`;
          uploadedUrls.push(url);
          setImageUrls((prev) => [...prev, url]); // Add each image URL to state as it uploads
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
      ...projectData,
      images: imageUrls,
    };

    try {
      const response = await axios.post(
        `/api/project/updateProject/${serviceId}`,
        serializedForm
      );

      toast({
        title: "Project Update",
        description: "The project has been successfully created.",
        duration: 5000,
      });
      router.push("/admin/projects");
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Failed to Create Project",
        description:
          "There was an error creating the project. Please try again.",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    setLoading(true);
  }, []);

  if (!loading) {
    return (
      <div className="w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }

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
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Button>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Project Controller
                </h1>
                <Badge
                  variant="outline"
                  className="ml-auto sm:ml-0 bg-black text-white"
                >
                  In Progress
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
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className="grid gap-4 lg:grid-cols-8">
                <Card className="col-span-5 text-white bg-black">
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                    <CardDescription>
                      Title, description, dates, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Project Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Project Name"
                        className="text-white bg-black"
                        value={projectData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Project Description"
                        className="text-white bg-black"
                        value={projectData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        name="startDate"
                        className="text-white bg-black"
                        value={projectData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        name="endDate"
                        className="text-white bg-black"
                        value={projectData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={projectData.status}
                        onValueChange={(value) =>
                          setProjectData({ ...projectData, status: value })
                        }
                      >
                        <SelectTrigger className="text-white bg-black">
                          <SelectValue placeholder="Select project status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="ongoing">Ongoing</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3 text-white bg-black">
                  <CardHeader>
                    <CardTitle>Upload Images</CardTitle>
                    <CardDescription>Images for the project.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="images">Images</Label>
                      <Input
                        id="images"
                        type="file"
                        name="images"
                        className="text-white bg-black"
                        onChange={handleImageUpload}
                        multiple
                      />
                    </div>
                    <div className="grid gap-2">
                      {imageUrls.map((url, index) => (
                        <Image
                          key={index}
                          src={url}
                          alt={`Project Image ${index + 1}`}
                          width={100}
                          height={100}
                          className="border"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="col-span-full text-white bg-black">
                <CardHeader>
                  <CardTitle>Technologies & Members</CardTitle>
                  <CardDescription>
                    Technologies and project members.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="technologies">Technologies</Label>
                    {projectData.technologies.map((tech, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          id={`technology-${index}`}
                          placeholder="Technology"
                          className="text-white bg-black flex-1"
                          value={tech}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              e.target.name,
                              e.target.value,
                              "technologies"
                            )
                          }
                        />
                        <Button
                          type="button"
                          onClick={() =>
                            handleArrayRemove(index, "technologies")
                          }
                          className="bg-red-500 text-white hover:bg-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() =>
                        setProjectData({
                          ...projectData,
                          technologies: [...projectData.technologies, ""],
                        })
                      }
                      className="bg-black text-white"
                    >
                      Add Technology
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="members">Members</Label>
                    {projectData.members.map((member, index) => (
                      <div
                        key={index}
                        className="grid gap-2 grid-cols-3 items-center"
                      >
                        <Input
                          id={`member-name-${index}`}
                          placeholder="Member Name"
                          className="text-white bg-black"
                          value={member.name}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              e.target.name,
                              e.target.value,
                              "members",
                              "name"
                            )
                          }
                        />
                        <Input
                          id={`member-role-${index}`}
                          placeholder="Member Role"
                          className="text-white bg-black"
                          value={member.role}
                          onChange={(e) =>
                            handleArrayChange(
                              index,
                              e.target.name,
                              e.target.value,
                              "members",
                              "role"
                            )
                          }
                        />
                        <Button
                          type="button"
                          onClick={() => handleArrayRemove(index, "members")}
                          className="bg-red-500 text-white hover:bg-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() =>
                        setProjectData({
                          ...projectData,
                          members: [
                            ...projectData.members,
                            { name: "", role: "" },
                          ],
                        })
                      }
                      className="bg-black text-white"
                    >
                      Add Member
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
