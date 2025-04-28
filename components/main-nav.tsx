"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import {
  User,
  LogOut,
  Settings,
  UserCircle,
  BookOpen,
  PieChart,
  Layers,
  Users,
  CircleHelp,
  BookText,
  CircleDollarSign,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MainNav = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Hàm xử lý đăng xuất
  const handleSignOut = async () => {
    try {
      await signOut(); // Gọi hàm signOut từ useAuth
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const navConfig = {
    common: [
      { href: "/courses", label: "Courses" },
      { href: "/quizzes", label: "Quizzes" },
      { href: "/books", label: "Books" },
      { href: "/blog", label: "Blog" },
    ],
    roleNav: {
      student: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: <PieChart className="mr-2 h-4 w-4" />,
        },
      ],
      teacher: [
        {
          href: "/teacher/dashboard",
          label: "Dashboard",
          icon: <PieChart className="mr-2 h-4 w-4" />,
        },
        {
          href: "/teacher/dashboard",
          label: "Courses",
          icon: <BookOpen className="mr-2 h-4 w-4" />,
        },
        {
          href: "/teacher/quizzes",
          label: "Quizzes",
          icon: <CircleHelp className="mr-2 h-4 w-4" />,
        },
        {
          href: "/teacher/books",
          label: "Books",
          icon: <BookText className="mr-2 h-4 w-4" />,
        },
        {
          href: "/teacher/payments",
          label: "Income",
          icon: <CircleDollarSign className="mr-2 h-4 w-4" />,
        },
      ],
      admin: [
        {
          href: "/admin/dashboard",
          label: "Dashboard",
          icon: <PieChart className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/users",
          label: "Users",
          icon: <Users className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/courses",
          label: "Courses",
          icon: <Layers className="mr-2 h-4 w-4" />,
        },
        {
          href: "/admin/books",
          label: "Books",
          icon: <BookText className="mr-2 h-4 w-4" />,
        },
      ],
    },
  };

  return (
    <div className="mr-4 flex items-center justify-between w-full p-2 mx-auto">
      <div className="flex items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Icons.logo className="h-6 w-6" />
          <span className="font-bold">EduLearn</span>
        </Link>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navConfig.common.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <UserCircle className="h-8 w-8 text-foreground/80" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Role-specific navigation items */}
              {user.role && navConfig.roleNav[user.role] && (
                <>
                  <DropdownMenuGroup>
                    {navConfig.roleNav[user.role].map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link
                          href={item.href}
                          className="w-full cursor-pointer flex items-center"
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="w-full cursor-pointer flex items-center"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/settings"
                    className="w-full cursor-pointer flex items-center"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default MainNav;
