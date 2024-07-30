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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast"; // Import useToast hook
import { IUser } from "@/models/User";
import axios from "axios";
import { PlusCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RingLoader } from "react-spinners";
const UserManagement = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { toast } = useToast(); // Initialize useToast hook
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/viewAllUsers/", {
        next: {
          revalidate: 5,
        },
        cache: "no-store",
      });
      const data = await response.json();
      const filteredUsers = data.filter(
        (user: { role: string }) => user.role !== "customer"
      );
      setUsers(filteredUsers);
      setLoading(true);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await axios.post(`/api/users/deleteUser/${id}`);
      fetchUsers();
      toast({
        title: "User Deleted",
        description: "User has been successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting user", error);
      toast({
        title: "Error",
        description: "There was an error deleting the user.",
      });
    }
  };

  const updateUserRole = async (id: string, newRole: string) => {
    try {
      await axios.post(`/api/admin/updateUserRole/${id}`, { role: newRole });
      fetchUsers();
      toast({
        title: "Role Updated",
        description: "User role has been successfully updated.",
      });
    } catch (error) {
      console.error("Error updating user role", error);
      toast({
        title: "Error",
        description: "There was an error updating the user role.",
      });
    }
  };

  const handleRoleChange =
    (userId: string) => (selectedRole: string | null) => {
      if (selectedRole) {
        updateUserRole(userId, selectedRole);
      }
    };
  const addAdmin = async () => {
    try {
      await axios.post("/api/admin/addAdmin", { email: adminEmail });
      fetchUsers();
      toast({
        title: "Admin Added",
        description: "User has been successfully promoted to admin.",
      });
      setAdminEmail("");
    } catch (error) {
      console.error("Error adding admin", error);
      toast({
        title: "Error",
        description: "There was an error adding the admin.",
      });
    }
  };
  if (!loading) {
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

                <Dialog>
                  <DialogTrigger asChild>
                    <div className="ml-auto flex items-center gap-2">
                      <Button size="sm" className="h-7 gap-1">
                        <PlusCircle className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                          Add Admin
                        </span>
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-black text-white">
                    <DialogHeader>
                      <DialogTitle>Add Admin</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                          Link
                        </Label>
                        <Input
                          type="email"
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="Enter email"
                          className="bg-black text-white"
                        />
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-start">
                      <DialogClose asChild>
                        <Button type="button" onClick={addAdmin}>
                          Add Admin
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <TabsContent value="all">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {users.map((user: any) => (
                    <Card key={user._id} className="p-2 bg-black text-white">
                      <CardHeader>
                        <CardTitle>{user.username}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between">
                        <Select
                          value={user.role}
                          onValueChange={handleRoleChange(user._id)}
                        >
                          <SelectTrigger className="mr-2 bg-black text-white">
                            <SelectValue
                              defaultValue={user.role}
                              className=" bg-black"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="employee">Employee</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => deleteUser(user._id)}
                          className=" bg-black"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default UserManagement;
