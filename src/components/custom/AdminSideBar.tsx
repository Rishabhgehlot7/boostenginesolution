"use client";
import {
  CirclePlus,
  CircleUser,
  FileQuestion,
  FileSliders,
  FolderKanban,
  LogOut,
  Settings,
  Sliders,
  StickyNote,
  UsersRound
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

const AdminSideBar = () => {
  const { data: session } = useSession();
  return (
    <div className="leftsidebar border-r h-screen p-3 w-[300px]">
      <Link href={"/"}>
        <LogOut />
      </Link>
      <ul className=" flex flex-col text-xs py-10 overflow-auto">
        {/* {session?.user?.role === "admin" && (
          <Link href={"/admin"} prefetch={false}>
            <li className="flex items-center gap-2 py-2 pl-4">MAIN MENU</li>
            <li
              className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
            >
              <LayoutDashboard />
              Dashboard
            </li>
          </Link>
        )} */}

        <Link href={"/admin/customers"} prefetch={false}>
          <li
            className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
          >
            <UsersRound />
            Users
          </li>
        </Link>

        <Link href={"/admin/query"} prefetch={false}>
          <li
            className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
          >
            <FileQuestion />
            Queries Management
          </li>
        </Link>

        <li className="flex items-center gap-2 py-2 pl-4">Services</li>

        <Link
          href={"/admin/addServices"}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <CirclePlus />
          Add Services
        </Link>
        <Link
          href={"/admin/services"}
          prefetch={false}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <FolderKanban />
          Services List
        </Link>
        <li className="flex items-center gap-2 py-2 pl-4">Projects</li>

        <Link
          href={"/admin/addProject"}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <CirclePlus />
          Add Projects
        </Link>
        <Link
          href={"/admin/projects"}
          prefetch={false}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <FolderKanban />
          Projects List
        </Link>

        <li className="flex items-center gap-2 py-2 pl-4">Blogs</li>
        <Link
          href={"/admin/addBlog"}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <CirclePlus />
          Add Blog
        </Link>
        <Link
          href={"/admin/blog"}
          prefetch={false}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <FolderKanban />
          Blogs List
        </Link>
        <li className="flex items-center gap-2 py-2 pl-4">Career</li>
        <Link
          href={"/admin/addCareer"}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <CirclePlus />
          Add Career
        </Link>
        <Link
          href={"/admin/carrer"}
          prefetch={false}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <FolderKanban />
          Career List
        </Link>

        <li className="flex items-center gap-2 py-2 pl-4">Testimonials</li>
        <Link
          href={"/admin/addTestimonials"}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <CirclePlus />
          Add Testimonials
        </Link>
        <Link
          href={"/admin/Testimonials"}
          prefetch={false}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <FolderKanban />
          Testimonials List
        </Link>
        <li className="flex items-center gap-2 py-2 pl-4">FAQ</li>
        <Link
          href={"/admin/addFAQ"}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <CirclePlus />
          Add FAQ
        </Link>
        <Link
          href={"/admin/faq"}
          prefetch={false}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <FolderKanban />
          FAQs List
        </Link>

        <li className="flex items-center gap-2 py-2 pl-4">Team Members</li>
        <Link
          href={"/admin/addTeamMember"}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <CirclePlus />
          Add Team Member
        </Link>
        <Link
          href={"/admin/team"}
          prefetch={false}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <FolderKanban />
          Team Members List
        </Link>

        <li className="flex items-center gap-2 py-2 pl-4">Job Applications</li>
        <Link
          href={"/admin/addApplication"}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <CirclePlus />
          Add Job Application
        </Link>
        <Link
          href={"/admin/applications"}
          prefetch={false}
          className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
        >
          <FolderKanban />
          Job Applications List
        </Link>

        {session?.user?.role === "admin" && (
          <div>
            <li className="flex items-center gap-2 py-2 pl-4">ADMIN</li>
            <Link href={"/admin/admins"} prefetch={false}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <CircleUser />
                Manage Admins
              </li>
            </Link>
            <Link href={"/admin/mangement"} prefetch={false}>
              <li
                className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
              >
                <Settings />
                Admin Roles
              </li>
            </Link>
          </div>
        )}

        <li className="flex items-center gap-2 py-2 pl-4">Sliders and UI</li>
        <Link href={"/admin/content"} prefetch={false}>
          <li
            className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
          >
            <Sliders />
            Desktop Management
          </li>
        </Link>
        <Link href={"/admin/mobileContent"} prefetch={false}>
          <li
            className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
          >
            <FileSliders />
            Mobile Management
          </li>
        </Link>
        <Link href={"/admin/styleContent"} prefetch={false}>
          <li
            className="flex items-center gap-2 py-2 pl-4 hover:bg-slate-800
        cursor-pointer "
          >
            <StickyNote />
            Style Management
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default AdminSideBar;
