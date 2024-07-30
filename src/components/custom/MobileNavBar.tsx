"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import cartIcon from "@/public/icons/cart.svg";
import menuIcon from "@/public/icons/menu.svg";
import userIcon from "@/public/icons/user.svg";
import logo from "@/public/logo.png";
import { Search } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MobileNavBar = () => {
  const { data: session } = useSession();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="black white w-full sm:hidden h-auto px-5">
      <Sheet>
        <ul className=" flex justify-between items-center">
          <div className=" flex gap-2 items-center">
            <SheetTrigger>
              <Image src={menuIcon} alt="Menu" />
            </SheetTrigger>
            <Link href={"/"}>
              <Image src={logo} alt="Logo" width={50} />
            </Link>
          </div>
          <div className=" flex gap-2 items-center">
            <Link href={"/search"}>
              <Search />
            </Link>
            <Link href={"/cart"}>
              <Image src={cartIcon} alt="Cart" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className=" border-none outline-none">
                <Image src={userIcon} alt="User" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className=" bg-black text-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {session ? (
                  <DropdownMenuItem onClick={() => signOut()}>
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

        <SheetContent side={"left"} className="black white">
          <SheetHeader>
            <SheetTitle className=" flex justify-center">
              <Link href={"/"}>
                <Image src={logo} alt="Logo" width={100} />
              </Link>
            </SheetTitle>
            <ul className=" text-left flex flex-col">
              <a href={"/contact"} className="w-full h-auto shadow p-2">
                Contact Us
              </a>
            </ul>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavBar;
