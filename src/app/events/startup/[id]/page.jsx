"use client";

import { useSearchParams } from "next/navigation";

const StartupPage = () => {
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const message = searchParams.get("message");
  const startup = searchParams.get("startup");

  if (!id || !message || !startup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading or Invalid Data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600">Startup Assigned</h1>
      <p className="text-lg mt-2">{message}</p>
      <div className="mt-4 px-6 py-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">Your Startup:</h2>
        <p className="text-2xl font-bold text-purple-700">{startup}</p>
      </div>
    </div>
  );
};

export default StartupPage;

