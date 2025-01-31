"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Html5Qrcode } from "html5-qrcode";

const Page = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleQRScan = async () => {
    if (isMobile) {
      try {
        setIsScanning(true);
        const scanner = new Html5Qrcode("reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleSuccessfulScan(decodedText);
            scanner.stop();
            setIsScanning(false);
          },
          (errorMessage) => {
            console.log("QR scanning error:", errorMessage);
          }
        );
      } catch (err) {
        console.error("Failed to start scanner:", err);
        setAlertMessage("Failed to start camera. Please check permissions.");
        setShowAlert(true);
        setIsScanning(false);
      }
    } else {
      setShowQRPopup(true);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      try {
        const decodedText = await scanner.scanFile(file, true);
        handleSuccessfulScan(decodedText);
      } catch (error) {
        console.error("QR Code scan error:", error);
        setAlertMessage("No valid QR code found in the image.");
        setShowAlert(true);
      } finally {
        if (scanner) {
          await scanner.clear();
        }
      }
    } catch (err) {
      console.error("Error scanning file:", err);
      setAlertMessage("Error scanning file. Please try again.");
      setShowAlert(true);
    }
  };

  const handleSuccessfulScan = (decodedText) => {
    try {
      const scannedData = JSON.parse(decodedText); // Parse scanned JSON data
      setShowQRPopup(false);

      if (!scannedData.id || !scannedData.startup) {
        throw new Error("Invalid QR data format");
      }

      // Redirect with query parameters
      router.push(
        `/events/startup?id=${encodeURIComponent(scannedData.id)}&message=${encodeURIComponent(scannedData.message)}&startup=${encodeURIComponent(scannedData.startup)}`
      );
    } catch (error) {
      console.error("Invalid QR data:", error);
      setAlertMessage("Invalid QR code scanned. Please try again.");
      setShowAlert(true);
    }
  };

  return (
    <div className="w-screen min-h-screen flex flex-col">
      {/* Background Section */}
      <div className="relative w-full h-[50vh]">
        <Image
          src="/game2.jpeg"
          alt="Background"
          layout="fill"
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Content Inside Background */}
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 text-white">
          {/* Left Content */}
          <div className="max-w-lg">
            <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
              Let the Treasure Hunt Begin!
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mt-2">
              Get ready for an exciting journey full of adventure and mystery.
            </p>
          </div>

          {/* Right Content - Event Card */}
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg rounded-2xl">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-white">
                Scan to Register
              </CardTitle>
              <p className="text-gray-300 text-sm md:text-base mt-2">
                {isMobile ? "Tap to scan QR code" : "Upload a QR code image"}
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button
                onClick={handleQRScan}
                className="w-full bg-gradient-to-r from-blue-700 to-purple-700 hover:from-blue-800 hover:to-purple-800 text-white font-semibold py-3 rounded-xl transition-transform hover:scale-105"
                disabled={isScanning}
              >
                {isScanning ? "Scanning..." : "Scan QR Code"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* QR Scanner Container */}
      <div id="reader" className={`${isScanning ? "fixed inset-0 z-50 bg-black" : "hidden"}`} />

      {/* QR Upload Dialog for Desktop */}
      <Dialog open={showQRPopup} onOpenChange={setShowQRPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload QR Code Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full max-w-xs"
            />
            <p className="text-sm text-gray-500">
              Select an image containing a QR code to scan
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog */}
      {showAlert && (
        <Alert className="fixed bottom-4 right-4 max-w-md bg-white shadow-lg">
          <AlertDescription>{alertMessage}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAlert(false)}
            className="absolute top-2 right-2"
          >
            ✕
          </Button>
        </Alert>
      )}
    </div>
  );
};

export default Page;



