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
import axios from "axios";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function CareerForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([""]);
  const [responsibilities, setResponsibilities] = useState<string[]>([""]);
  const [minSalary, setMinSalary] = useState<number | undefined>(undefined);
  const [maxSalary, setMaxSalary] = useState<number | undefined>(undefined);
  const [isActive, setIsActive] = useState(true);

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addRequirementRow = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirementRow = (index: number) => {
    const newRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(newRequirements);
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    const newResponsibilities = [...responsibilities];
    newResponsibilities[index] = value;
    setResponsibilities(newResponsibilities);
  };

  const addResponsibilityRow = () => {
    setResponsibilities([...responsibilities, ""]);
  };

  const removeResponsibilityRow = (index: number) => {
    const newResponsibilities = responsibilities.filter((_, i) => i !== index);
    setResponsibilities(newResponsibilities);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serializedForm = {
      position,
      department,
      location,
      jobType,
      description,
      requirements,
      responsibilities,
      salaryRange: { min: minSalary, max: maxSalary },
      isActive,
    };

    try {
      const response = await axios.post(
        "/api/carrer/addCareer",
        serializedForm
      );
      toast({
        title: "Career Post Created",
        description: "The career post has been successfully created.",
        duration: 5000,
      });
      router.push("/admin/career");
    } catch (error) {
      console.error("Error creating career post:", error);
      toast({
        title: "Failed to Create Career Post",
        description:
          "There was an error creating the career post. Please try again.",
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
                  Add Career Post
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
                    <CardTitle>Career Post Details</CardTitle>
                    <CardDescription>
                      Position, department, job type, etc.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
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
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        placeholder="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="jobType">Job Type</Label>
                      <select
                        id="jobType"
                        name="jobType"
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className="text-white bg-black border"
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Internship">Internship</option>
                      </select>
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
                      <Label>Requirements</Label>
                      {requirements.map((requirement, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Requirement"
                            value={requirement}
                            onChange={(e) =>
                              handleRequirementChange(index, e.target.value)
                            }
                            className="text-white bg-black"
                          />
                          <Button
                            onClick={() => removeRequirementRow(index)}
                            className="text-white bg-black"
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addRequirementRow}
                        className="mt-2 text-white bg-black"
                      >
                        Add Requirement
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <Label>Responsibilities</Label>
                      {responsibilities.map((responsibility, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Responsibility"
                            value={responsibility}
                            onChange={(e) =>
                              handleResponsibilityChange(index, e.target.value)
                            }
                            className="text-white bg-black"
                          />
                          <Button
                            onClick={() => removeResponsibilityRow(index)}
                            className="text-white bg-black"
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        onClick={addResponsibilityRow}
                        className="mt-2 text-white bg-black"
                      >
                        Add Responsibility
                      </Button>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="minSalary">Minimum Salary</Label>
                      <Input
                        id="minSalary"
                        name="minSalary"
                        type="number"
                        placeholder="Minimum Salary"
                        value={minSalary !== undefined ? minSalary : ""}
                        onChange={(e) => setMinSalary(Number(e.target.value))}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="maxSalary">Maximum Salary</Label>
                      <Input
                        id="maxSalary"
                        name="maxSalary"
                        type="number"
                        placeholder="Maximum Salary"
                        value={maxSalary !== undefined ? maxSalary : ""}
                        onChange={(e) => setMaxSalary(Number(e.target.value))}
                        className="text-white bg-black"
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card className="col-span-3 text-white bg-black">
                  <CardHeader>
                    <CardTitle>Post Options</CardTitle>
                    <CardDescription>
                      Options for publishing the post
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="flex items-center justify-evenly">
                      <Label htmlFor="isActive">Is Active</Label>
                      <input
                        id="isActive"
                        name="isActive"
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="text-white bg-black"
                      />
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
