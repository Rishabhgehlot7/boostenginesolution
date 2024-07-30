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

export default function ApplicationForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [careerId, setCareerId] = useState<string>("");
  const [applicantName, setApplicantName] = useState<string>("");
  const [applicantEmail, setApplicantEmail] = useState<string>("");
  const [applicantPhone, setApplicantPhone] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [status, setStatus] = useState<"Pending" | "Reviewed" | "Accepted" | "Rejected">("Pending");

  const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const handleResumeUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    const file = e.target.files[0];
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
      await s3.send(uploadToS3);
      const url = `https://${Bucket}.s3.amazonaws.com/${fileName}`;
      setResumeUrl(url);
      toast({
        title: "Resume Uploaded",
        description: "Your resume has been successfully uploaded.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Failed to Upload Resume",
        description: "There was an error uploading your resume. Please try again.",
        duration: 5000,
      });
      console.error(error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serializedForm = {
      careerId,
      applicantName,
      applicantEmail,
      applicantPhone,
      coverLetter,
      resumeUrl,
      status,
      appliedAt: new Date(),
    };

    try {
      const response = await axios.post("/api/applocation/addApplication", serializedForm);
      console.log(response);

      toast({
        title: "Application Submitted",
        description: "Your application has been successfully submitted.",
        duration: 5000,
      });
      router.push("/admin/applications");
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Failed to Submit Application",
        description: "There was an error submitting your application. Please try again.",
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
                  Job Application Form
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
                    <CardTitle>Application Details</CardTitle>
                    <CardDescription>
                      Enter applicant details and upload resume.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="careerId">Career ID</Label>
                      <Input
                        id="careerId"
                        name="careerId"
                        placeholder="Career ID"
                        value={careerId}
                        onChange={(e) => setCareerId(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="applicantName">Name</Label>
                      <Input
                        id="applicantName"
                        name="applicantName"
                        placeholder="Applicant Name"
                        value={applicantName}
                        onChange={(e) => setApplicantName(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="applicantEmail">Email</Label>
                      <Input
                        id="applicantEmail"
                        name="applicantEmail"
                        placeholder="Applicant Email"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="applicantPhone">Phone</Label>
                      <Input
                        id="applicantPhone"
                        name="applicantPhone"
                        placeholder="Applicant Phone (Optional)"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="coverLetter">Cover Letter</Label>
                      <Textarea
                        id="coverLetter"
                        name="coverLetter"
                        placeholder="Cover Letter"
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="resume">Resume</Label>
                      <Input
                        id="resume"
                        type="file"
                        accept=".pdf, .doc, .docx"
                        onChange={handleResumeUpload}
                        className="text-white bg-black"
                      />
                      {resumeUrl && (
                        <a href={resumeUrl} target="_blank" className="text-blue-500 underline">
                          View Uploaded Resume
                        </a>
                      )}
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
