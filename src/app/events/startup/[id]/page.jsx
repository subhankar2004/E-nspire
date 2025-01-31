"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const StartupPage = () => {
  const { id } = useParams(); // Get dynamic parameter from URL
  const [startupData, setStartupData] = useState(null);

  useEffect(() => {
    if (id) {
      try {
        // Decode the scanned JSON string (if encoded)
        const decodedData = JSON.parse(decodeURIComponent(id));
        setStartupData(decodedData);
      } catch (error) {
        console.error("Error parsing QR data:", error);
      }
    }
  }, [id]);

  if (!startupData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-600">Startup Assigned</h1>
      <p className="text-lg mt-2">{startupData.message}</p>
      <div className="mt-4 px-6 py-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">Your Startup:</h2>
        <p className="text-2xl font-bold text-purple-700">{startupData.startup}</p>
      </div>
    </div>
  );
};

export default StartupPage;
