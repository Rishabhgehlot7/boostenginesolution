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

export default function FAQForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const serializedForm = {
      question,
      answer,
    };

    console.log(serializedForm);

    try {
      const response = await axios.post("/api/faq/addFAQ", serializedForm);
      console.log(response);

      toast({
        title: "FAQ Created",
        description: "The FAQ entry has been successfully created.",
        duration: 5000,
      });
      router.push("/admin/faq");
    } catch (error) {
      console.error("Error creating FAQ entry:", error);
      toast({
        title: "Failed to Create FAQ Entry",
        description:
          "There was an error creating the FAQ entry. Please try again.",
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
                  Add FAQ Entry
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
                    <CardTitle>FAQ Details</CardTitle>
                    <CardDescription>
                      Question and answer for the FAQ entry.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="question">Question</Label>
                      <Input
                        id="question"
                        name="question"
                        placeholder="Question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="text-white bg-black"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="answer">Answer</Label>
                      <Textarea
                        id="answer"
                        name="answer"
                        placeholder="Answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="text-white bg-black"
                      />
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
