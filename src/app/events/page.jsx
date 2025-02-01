// app/events/page.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Camera } from "lucide-react";
import Image from "next/image";
import { Html5Qrcode } from "html5-qrcode";

const Page = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [showQRPopup, setShowQRPopup] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const fetchStartupData = async (id) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/startups/${id}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch startup data');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching startup data:', error);
      setAlertMessage(error.message);
      setShowAlert(true);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
      const decodedText = await scanner.scanFile(file, true);
      handleSuccessfulScan(decodedText);
    } catch (error) {
      console.error("QR Code scan error:", error);
      setAlertMessage("No valid QR code found in the image.");
      setShowAlert(true);
    }
  };

  const handleSuccessfulScan = async (decodedText) => {
    try {
      const scannedData = JSON.parse(decodedText);
      if (!scannedData.id) {
        throw new Error("Invalid QR data format");
      }

      const startupData = await fetchStartupData(scannedData.id);
      router.push(`/events/startup/${startupData.id}`);
    } catch (error) {
      console.error("Error processing scan:", error);
      setAlertMessage("Invalid QR code or unable to fetch data. Please try again.");
      setShowAlert(true);
    } finally {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col">
      <div className="relative w-full h-[60vh]">
        <Image 
          src="/game2.jpeg" 
          alt="Background" 
          layout="fill" 
          className="object-cover brightness-75" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-8">
          <div className="max-w-lg space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Start Your Journey
            </h1>
            <p className="text-lg md:text-xl text-gray-200">
              Scan the QR code to discover your startup assignment
            </p>
          </div>
          <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl md:text-3xl font-bold text-white text-center">
                Scan to Join
              </CardTitle>
              <p className="text-gray-200 text-center">
                Your startup adventure awaits
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleQRScan} 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold transition-all hover:scale-105 flex items-center justify-center gap-2"
                disabled={isScanning || isLoading}
              >
                {isScanning ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Scanning...
                  </>
                ) : isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5" />
                    Scan QR Code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div id="reader" className={`${isScanning ? "fixed inset-0 z-50 bg-black" : "hidden"}`} />

      <Dialog open={showQRPopup} onOpenChange={setShowQRPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload QR Code Image</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 p-4">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              className="w-full max-w-xs file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
            />
          </div>
        </DialogContent>
      </Dialog>

      {showAlert && (
        <Alert className="fixed bottom-4 right-4 max-w-md bg-white shadow-lg animate-in slide-in-from-bottom-4">
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