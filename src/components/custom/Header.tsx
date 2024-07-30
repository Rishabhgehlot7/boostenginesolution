"use client";
import logo from "@/public/logo.png";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface Session {
  user?: {
    role?: string;
  };
}

const Header: React.FC = () => {
  const { data: session } = useSession();
  return (
    <div className="black white w-full sm:block hidden h-auto px-3 sticky top-0 bg-black z-50 py-2">
      <ul className="flex justify-between items-center">
        <Link href={"/"}>
          <Image src={logo} alt="" width={120} />
        </Link>

        <div className="flex justify-center items-center gap-8 text-xs pt-6">
          <Link href={"/contact"} className=" font-bold">
            Home
          </Link>
          <Link href={"/contact"} className=" font-bold">
            About Us
          </Link>
          <Link href={"/contact"} className=" font-bold">
            Services
          </Link>
          <Link href={"/contact"} className=" font-bold">
            Portfolio
          </Link>
          <Link href={"/contact"} className=" font-bold">
            Blog
          </Link>
          <Link href={"/contact"} className=" font-bold">
            Contact Us
          </Link>
          <Link href={"/contact"} className=" font-bold">
            Career
          </Link>
          <Link href={"/contact"} className=" font-bold">
            Testimonicals
          </Link>
          <Link href={"/contact"} className=" font-bold">
            FAQ
          </Link>
          <Link href={"/contact"} className=" font-bold">
            Team
          </Link>
        </div>
        <div className="flex justify-center items-center gap-3 text-xs">
          <Button className=" rounded-3xl mt-6">Let's Talk</Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="border-none outline-none mt-6">
              <User />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(session?.user?.role === "admin" ||
                session?.user?.role === "employee") && (
                <Link href={"/admin/customers"}>
                  <DropdownMenuItem>
                    <button>Admin</button>
                  </DropdownMenuItem>
                </Link>
              )}
              {session ? (
                <DropdownMenuItem
                  onClick={() => {
                    signOut();
                  }}
                >
                  Logout
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => signIn()}>
                  Sign in
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </ul>
    </div>
  );
};

export default Header;
