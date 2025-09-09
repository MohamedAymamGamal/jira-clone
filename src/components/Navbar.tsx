"use client";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Divide, Trello } from "lucide-react";
import Link from "next/link";
import React, { use } from "react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();
  const isDashboardPage = pathname === "/dashboard";
  const isBoardPage = pathname.startsWith("/boards/");
  if (isDashboardPage) {
    return (
      <div>
        <header>
          <div className="border-b bg-white/80 r h-16 backdrop-blur-md sticky top-0 z-50 ">
            <div className="contianer flex items-center justify-between mx-auto px-4 py-4 sm:py-4">
              <div className="flex items-center gap-2 space-x-2">
                <Link href={"/"}>
                  <Trello className="h-8 w-8 sm:h-8 sm:w-8 text-blue-600" />
                </Link>
                <span className="text-2xl font-bold  text-gray-900">
                  jira clone
                </span>
              </div>
              <div className="flex items-center sm:space-x-4 space-x-2">
                <UserButton />
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
  return (
    <header>
      <div className="border-b bg-white/80 r h-16 backdrop-blur-md sticky top-0 z-50 ">
        <div className="contianer flex items-center justify-between mx-auto px-4 py-4 sm:py-4">
          <div className="flex items-center gap-2 space-x-2">
            <Link href={"/"}>
              <Trello className="h-8 w-8 sm:h-8 sm:w-8 text-blue-600" />
            </Link>
            <span className="text-2xl font-bold  text-gray-900">
              jira clone
            </span>
          </div>
          <div className="flex items-center sm:space-x-4 space-x-2">
            {isSignedIn ? (
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:items-center sm:space-y-0 sm-space-x-4 space-y-0 ">
                <span className="text-xs sm:text-sm text-gray-600 sm:hidden">
                  welecome
                  {user?.firstName ?? user?.emailAddresses[0].emailAddress}
                </span>
                <Link href="/dashboard">
                  <Button size="sm" className="text-xs sm:text-sm">
                    got to dashboard <ArrowRight />
                  </Button>
                </Link>
              </div>
            ) : (
              <div>
                <SignInButton>
                  <Button
                    className="text-xs sm:text-sm hover:cursor-pointer"
                    size={"sm"}
                    variant={"ghost"}
                  >
                    Sign in
                  </Button>
                </SignInButton>

                <SignUpButton>
                  <Button
                    className="text-xs sm:text-sm hover:cursor-pointer"
                    size={"sm"}
                    variant={"outline"}
                  >
                    Sign up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
