"use client";

import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, MapPin, BookOpen, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  return (
    <header className="border-b sticky top-0 z-40 bg-background">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-teal-600" />
            <span className="text-xl font-bold">Travel Memory</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/travels"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              旅行記録
            </Link>
            <Link
              to="/map"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              地図から探す
            </Link>
            <Link
              to="/users"
              className="text-foreground/80 hover:text-foreground transition-colors"
            >
              ユーザー
            </Link>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="旅行先、ユーザーを検索..." className="pl-8" />
          </div>

          <ThemeToggle />

          {/* Clerk認証状態で切り替え */}
          <SignedIn>
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/profile">
                  <User className="mr-2 h-4 w-4" />
                  プロフィール
                </Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/my-travels">
                  <BookOpen className="mr-2 h-4 w-4" />
                  自分の旅行記録
                </Link>
              </Button>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-10 w-10",
                  },
                }}
              />
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/auth/login">ログイン</Link>
              </Button>
              <Button asChild>
                <Link to="/auth/register">登録</Link>
              </Button>
            </div>
          </SignedOut>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-6 pt-6">
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-teal-600" />
                  <span className="text-xl font-bold">Travel Memory</span>
                </Link>
                <ThemeToggle />
              </div>

              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="旅行先、ユーザーを検索..."
                  className="pl-8"
                />
              </div>

              <nav className="flex flex-col gap-4">
                <Link
                  to="/travels"
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  旅行記録
                </Link>
                <Link
                  to="/map"
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  地図から探す
                </Link>
                <Link
                  to="/users"
                  className="text-foreground/80 hover:text-foreground transition-colors"
                >
                  ユーザー
                </Link>
              </nav>

              <div className="mt-auto">
                {/* Clerk認証状態で切り替え（モバイル用） */}
                <SignedIn>
                  <Button
                    variant="outline"
                    asChild
                    className="justify-start mb-2"
                  >
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" />
                      プロフィール
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="justify-start">
                    <Link to="/my-travels">
                      <BookOpen className="mr-2 h-4 w-4" />
                      自分の旅行記録
                    </Link>
                  </Button>
                  <div className="flex items-center gap-2 mb-2">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "h-10 w-10",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
                <SignedOut>
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" asChild>
                      <Link to="/auth/login">ログイン</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/auth/register">登録</Link>
                    </Button>
                  </div>
                </SignedOut>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
