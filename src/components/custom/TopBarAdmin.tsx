"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import cartIcon from "@/public/icons/cart.svg";
import menuIcon from "@/public/icons/menu.svg";
import userIcon from "@/public/icons/user.svg";
import {
  ArrowLeftRight,
  CirclePlus,
  CircleUser,
  ClipboardList,
  FileSliders,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShoppingCart,
  Sliders,
  StickyNote,
  UsersRound,
  View,
  WalletCards,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
const MobileNavBar = () => {
  const { data: session } = useSession();
  const [showSearch, setShowSearch] = useState(true);
  return (
    <div className="black white w-full sm:hidden h-auto px-5 py-5">
      <Sheet>
        <ul className=" flex justify-between items-center">
          <div>
            <SheetTrigger>
              <Image src={menuIcon} alt="" />
            </SheetTrigger>
          </div>
          <div className=" flex gap-2 items-center">
            <Link href={"/search"}>
              <Search />
            </Link>
            <Link href={"/cart"}>
              <Image src={cartIcon} alt="" />
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className=" border-none outline-none">
                <Image src={userIcon} alt="" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className=" bg-black text-white">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={"/user"}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href={"/admin"}>Admin</Link>
                </DropdownMenuItem>
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

        <SheetContent side={"left"} className="black white overflow-scroll">
          <Link href={"/"}>
            <LogOut />
          </Link>
          <ul className=" flex flex-col text-xs py-10">
            <li className="flex items-center gap-2 py-2 pl-4">MAIN MENU</li>
            <Link href={"/admin"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <LayoutDashboard />
                Dashboard
              </li>
            </Link>
            <Link href={"/admin/orders"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <ShoppingCart />
                Order Management
              </li>
            </Link>
            <Link href={"/admin/customers"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <UsersRound />
                Customers
              </li>
            </Link>
            <Link href={"/admin/coupon"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <WalletCards />
                Coupon Code
              </li>
            </Link>
            <Link href={"/admin/Categories"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <ClipboardList />
                Categories
              </li>
            </Link>
            <Link href={"/admin/Transaction"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <ArrowLeftRight />
                Transaction
              </li>
            </Link>
            <Link href={"/admin/reviews"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <View />
                Eeviews
              </li>
            </Link>
            <li className="flex items-center gap-2 py-2 pl-4">PRODUCTS</li>

            <Link
              href={"/admin/addProduct"}
              className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
            >
              <CirclePlus />
              Add Products
            </Link>
            <Link
              href={"/admin/products"}
              prefetch={false}
              className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
            >
              <FolderKanban />
              Product List
            </Link>
            <li className="flex items-center gap-2 py-2 pl-4">ADMIN</li>
            <Link href={"/admin/admins"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <CircleUser />
                Manage Admins
              </li>
            </Link>
            <Link href={"/admin/mangement"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <Settings />
                Admin Roles
              </li>
            </Link>
            <li className="flex items-center gap-2 py-2 pl-4">
              Sliders and UI
            </li>
            <Link href={"/admin/content"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <Sliders />
                Desktop Management
              </li>
            </Link>
            <Link href={"/admin/mobileContent"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <FileSliders />
                Mobile Management
              </li>
            </Link>
            <Link href={"/admin/styleContent"}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <StickyNote />
                Style Management
              </li>
            </Link>
          </ul>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavBar;
