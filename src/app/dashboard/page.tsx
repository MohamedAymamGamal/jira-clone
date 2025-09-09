"use client";
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";

const page = () => {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 sm:py-8">
        <div className="mb-6 sm:ms-8">
          <h1 className="text-3xl font-bold sm:text-3xl text-gray-900 mb-2">
            welecome back,{" "}
            {user?.firstName ?? user?.emailAddresses[0].emailAddress} 👋
          </h1>
          <p className="text-lg text-gray-600"> here is your dashboard</p>
        </div>
      </main>
    </div>
  );
};

export default page;
