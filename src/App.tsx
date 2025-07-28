import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./App.css";
import HomePage from "@/pages/HomePage";
import TravelDetailPage from "./pages/travel/TravelDetailPage";
import CreateTravelPage from "./pages/travel/TravelCreatePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      // defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <Router>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {/* Clerk テスト */}
            {/* <div>Clerk test</div>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
            <div>Clerk test</div> */}

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/register" element={<RegisterPage />} />
              {/* <Route path="/profile" element={<ProfilePage />} /> */}
              <Route path="/travelCreate" element={<CreateTravelPage />} />
              <Route path="/travels/:id" element={<TravelDetailPage />} />
              {/* <Route path="/map" element={<MapPage />} /> */}
            </Routes>
          </main>
          <Footer />
        </div>
        {/* richColorsを追加して、トーストの色を自動調整 */}
        <Toaster richColors />
      </Router>
    </ThemeProvider>
  );
}

export default App;
