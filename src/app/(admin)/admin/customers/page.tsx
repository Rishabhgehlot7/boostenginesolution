"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import axios from "axios";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";
import { RingLoader } from "react-spinners";
import useSWR from "swr";

interface IUser {
  _id: string;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}
const fetcher = (url: string) =>
  fetch(url, {
    next: {
      revalidate: 5,
      tags: ["a"],
    },
    cache: "no-store",
  }).then((res) => res.json());
function UserManagement() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [address, setAddress] = useState("");
  const [verifyCode, setVerifyCode] = useState(0);
  const [verifyCodeExpiry, setVerifyCodeExpiry] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, error, mutate } = useSWR("/api/admin/viewAllUsers", fetcher);

  const createUser = async () => {
    try {
      const newUser = {
        username,
        name,
        email,
        password,
        role,
        address,
        verifyCode,
        verifyCodeExpiry,
        isVerified,
      };
      console.log(newUser);

      const user = await axios.post("/api/users/createUser/", newUser);
      console.log(user);

      mutate();
      setUsername("");
      setName("");
      setEmail("");
      setPassword("");
      setRole("customer");
      setAddress("");
      setVerifyCode(0);
      setVerifyCodeExpiry("");
      setIsVerified(false);
      // router.push("/admin/user");
    } catch (error) {
      console.error("Error creating user", error);
    }
  };

  const deleteUser = async (id: string) => {
    console.log(users);

    try {
      await axios.post(`/api/users/deleteUser/${id}`);
      mutate();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };
  if (!data) {
    return (
      <div className=" w-full h-full flex justify-center items-center py-10">
        <RingLoader color="#FFCC4D" />
      </div>
    );
  }
  return (
    <TooltipProvider>
      <div className="flex min-h-screen w-full flex-col bg-gray-950">
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 bg-gray-950 text-white">
            <Tabs defaultValue="all">
              <div className="flex items-center">
                <TabsList className="bg-black text-white">
                  <TabsTrigger value="all" className="bg-black text-white">
                    All
                  </TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger>
                      <Button size="sm" className="h-7 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Add User
                        </span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className=" bg-black text-white overflow-auto">
                      <h2 className="text-xl font-semibold mb-4">
                        Create User
                      </h2>
                      <div className="mb-4">
                        <Label className="block text-sm font-medium ">
                          Username
                        </Label>
                        <Input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="mt-1 block w-full p-2 rounded-md bg-black text-white"
                        />
                      </div>
                      <div className="mb-4">
                        <Label className="block text-sm font-medium ">
                          Name
                        </Label>
                        <Input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="mt-1 block w-full p-2 rounded-md bg-black text-white"
                        />
                      </div>
                      <div className="mb-4">
                        <Label className="block text-sm font-medium ">
                          Email
                        </Label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 block w-full p-2 rounded-md bg-black text-white"
                        />
                      </div>
                      <div className="mb-4">
                        <Label className="block text-sm font-medium ">
                          Password
                        </Label>
                        <Input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1 block w-full p-2 rounded-md bg-black text-white"
                        />
                      </div>
                      <div className="mb-4">
                        <Label className="block text-sm font-medium ">
                          Role
                        </Label>
                        <Select
                          onValueChange={setRole}
                          defaultValue="Select a category"
                        >
                          <SelectTrigger className="text-white bg-black">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="text-white bg-black">
                            <SelectItem value="admin">admin</SelectItem>
                            <SelectItem value="customer">customer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="mb-4">
                        <Label className="block text-sm font-medium ">
                          Address
                        </Label>
                        <Input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="mt-1 block w-full p-2 rounded-md bg-black text-white"
                        />
                      </div>
                      <div className="mb-4">
                        <Label className="block text-sm font-medium ">
                          Verify Code
                        </Label>
                        <Input
                          type="text"
                          value={verifyCode}
                          onChange={(e: any) =>
                            setVerifyCode(parseInt(e.target.value))
                          }
                          className="mt-1 block w-full p-2 rounded-md bg-black text-white"
                        />
                      </div>
                      <div className="mb-4">
                        <Label className="block text-sm font-medium ">
                          Verify Code Expiry
                        </Label>
                        <Input
                          type="datetime-local"
                          value={verifyCodeExpiry}
                          onChange={(e) => setVerifyCodeExpiry(e.target.value)}
                          className="mt-1 block w-full p-2 rounded-md bg-black text-white"
                        />
                      </div>
                      <div className="mb-4 flex items-center">
                        <input
                          type="checkbox"
                          checked={isVerified}
                          onChange={(e) => setIsVerified(e.target.checked)}
                          className="mr-2"
                        />
                        <Label className="block text-sm font-medium ">
                          Is Verified
                        </Label>
                      </div>
                      <div className="mt-6">
                        <Button onClick={createUser} className="w-full">
                          Create
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              <TabsContent value="all" className="bg-black text-white">
                <Card className="bg-black text-white">
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                    <CardDescription>Manage your users</CardDescription>
                  </CardHeader>
                  <CardContent className="bg-black text-white">
                    <Table>
                      <TableHeader>
                        <TableRow className="hover:bg-black hover:text-white">
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.reverse().map((user: IUser) => (
                          <TableRow
                            key={user._id}
                            className="hover:bg-black hover:text-white"
                          >
                            <TableCell className="font-medium">
                              {user.username}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>
                              {user.isVerified ? "Verified" : "Not Verified"}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => deleteUser(user._id)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}

export default UserManagement;
