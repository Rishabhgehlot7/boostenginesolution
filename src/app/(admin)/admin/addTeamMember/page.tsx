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
import axios from "axios";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function TeamMemberForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState<string[]>([""]);
  const [experience, setExperience] = useState<number | "">("");
  const [joinedDate, setJoinedDate] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | "">("");
  const [bio, setBio] = useState("");

  const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...skills];
    newSkills[index] = value;
    setSkills(newSkills);
  };

  const addSkillRow = () => {
    setSkills([...skills, ""]);
  };

  const removeSkillRow = (index: number) => {
    const newSkills = skills.filter((_, i) => i !== index);
    setSkills(newSkills);
  };

  const handleProfilePictureUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (!e.target.files) return;
    const file = e.target.files[0];
    const ext = file.name.split(".").pop();
    const uid = uuidv4().replace(/-/g, "");
    const fileName = `${uid}${ext ? "." + ext : ""}`;

    const uploadToS3 = new PutObjectCommand({
      Bucket,
      Key: fileName,
      Body: file,
      ACL: "public-read",
    });

    try {
      await s3.send(uploadToS3);
      const url = `https://${Bucket}.s3.amazonaws.com/${fileName}`;
      setProfilePictureUrl(url);
      toast({
        title: "Profile Picture Uploaded",
        description: "The profile picture has been successfully uploaded.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Failed to Upload Profile Picture",
        description:
          "There was an error uploading the profile picture. Please try again.",
        duration: 5000,
      });
      console.error(error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serializedForm = {
      name,
      position,
      email,
      phone,
      skills,
      experience: Number(experience),
      joinedDate: new Date(joinedDate),
      profilePicture: profilePictureUrl,
      bio,
    };

    try {
      const response = await axios.post(
        "/api/team/addProject",
        serializedForm
      );
      console.log(response);

      toast({
        title: "Team Member Added",
        description: "The team member has been successfully added.",
        duration: 5000,
      });
      router.push("/admin/team");
    } catch (error) {
      console.error("Error creating team member:", error);
      toast({
        title: "Failed to Add Team Member",
        description:
          "There was an error adding the team member. Please try again.",
        duration: 5000,
      });
    }
  };
  const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setJoinedDate(e.target.value);
  };
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-950">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-gray-950">
          <form onSubmit={handleSubmit}>
            <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
              <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Add Team Member
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
                    <CardTitle>Team Member Details</CardTitle>
                    <CardDescription>
                      Name, position, contact info, etc.
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
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        name="position"
                        placeholder="Position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Skills</Label>
                      {skills.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Skill"
                            value={skill}
                            onChange={(e) =>
                              handleSkillChange(index, e.target.value)
                            }
                            className="text-white bg-black"
                          />
                          <Button
                            onClick={() => removeSkillRow(index)}
                            className="text-white bg-black"
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addSkillRow}
                        className="mt-2 text-white bg-black"
                      >
                        Add Skill
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="experience">Experience (years)</Label>
                      <Input
                        id="experience"
                        type="number"
                        placeholder="Experience"
                        value={experience}
                        onChange={(e) => setExperience(Number(e.target.value))}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="joinedDate">Joined Date</Label>
                      <Input
                        id="joinedDate"
                        type="date"
                        placeholder="Joined Date"
                        value={joinedDate}
                        onChange={handleDateChange}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="bio">Biography</Label>
                      <Textarea
                        id="bio"
                        placeholder="Biography"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3 text-white bg-black">
                  <CardHeader>
                    <CardTitle>Profile Picture</CardTitle>
                    <CardDescription>
                      Upload the profile picture of the team member.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="profilePicture">Profile Picture</Label>
                      <Input
                        id="profilePicture"
                        type="file"
                        onChange={handleProfilePictureUpload}
                        className="text-white bg-black"
                      />
                      {profilePictureUrl && (
                        <img
                          src={profilePictureUrl}
                          alt="Profile"
                          className="mt-2"
                          style={{ width: "100px", height: "100px" }}
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-black text-white hover:bg-white hover:text-black"
                type="button"
              >
                Discard
              </Button>
              <Button
                size="sm"
                className="bg-black text-white hover:bg-white hover:text-black border"
                type="submit"
                disabled={loading}
              >
                Save
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
