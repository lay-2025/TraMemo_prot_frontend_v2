"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { SignUp } from "@clerk/clerk-react";

export default function RegisterPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-10" />

      <div className="relative w-full max-w-md">
        <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95 shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-teal-600 rounded-full">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Travel Memory
              </span>
            </div>
            <CardTitle className="text-2xl font-bold">アカウント作成</CardTitle>
            <CardDescription>旅の記録を始めましょう</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* ClerkのSignUpコンポーネントを埋め込む */}
            <div className="py-2">
              <SignUp
                appearance={{
                  elements: {
                    card: "shadow-none bg-transparent border-0",
                  },
                  variables: isDark
                    ? {
                        colorBackground: "#18181b",
                        colorText: "#fff",
                        colorPrimary: "#14b8a6",
                        colorInputBackground: "#27272a",
                        colorInputText: "#fff",
                      }
                    : {
                        colorBackground: "#fff",
                        colorText: "#18181b",
                        colorPrimary: "#14b8a6",
                        colorInputBackground: "#fff",
                        colorInputText: "#18181b",
                      },
                }}
                signInUrl="/auth/login"
                afterSignUpUrl="/"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
