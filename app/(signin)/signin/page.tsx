"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Plane,

  ChevronsLeft 
  
} from "lucide-react";
import {SignInBg} from "@/components/ui/signin-bg";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";





export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState<boolean>(false);
  const[gwarning, setgWarning] = useState<boolean>(false);

  const { setToken } = useAuth();
  const router = useRouter();

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = async (credentialResponse: { credential?: string }) => {
  if (credentialResponse.credential) {
    try {
      const res = await fetch("/api/verify-google-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const googledata = await res.json();

      if (res.ok) {
        //if response is ok sign in with users info from google
         try {
          const res = await fetch("/api/google-sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: googledata.payload.email, password: googledata.payload.sub}),
          });
          const data = await res.json();
          console.log("Google database sign-in response:", data);
          if (res.ok) {
            setToken(data.token);
            router.push("/");
          } else {
            if(res.status === 404) {
              setgWarning(true);
            }
          }
        } catch (err) {
          console.error("Error during Google sign-in:", err);
        }

      } else {
        console.error("Google token verification failed:", googledata.error);
      }
    } catch (err) {
      console.error("Error verifying Google token:", err);
    }
  } else {
    console.warn("No credential found in response");
  }
};

  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setWarning(false);
    
    try {
      const res = await fetch("/api/local-log-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signInData.email,
          password: signInData.password,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("User logged in successfully:", data);
        setToken(data.token);
        router.push("/");
      } else {
        setWarning(true);
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error);
      setWarning(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans relative overflow-hidden">
      
      {/* Enhanced Glamoric Background */}
      <SignInBg />

        <button 
          onClick={() => router.push("/")} className="text-sm flex justify-center items-center absolute top-10 left-24 text-white/70 hover:text-white px-4 z-10 bg-black/50 rounded-full p-2 hover:bg-black/80 cursor-pointer">
          <ChevronsLeft className="w-6 h-6 " />  Go Home
        </button>
      <div className="relative z-10 w-full max-w-md mx-4">
        <Card className="glass-morphism shadow-2xl border-0 rounded-3xl animate-pulse-glow overflow-hidden">
          {/* Shimmer effect overlay */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 w-full h-full animate-shimmer"></div>
          </div>
          
          <CardContent className="p-10 relative">
            <div className="text-center mb-10">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
                  <Plane className="w-10 h-10 text-white drop-shadow-lg" />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-3 ">
                Welcome Back
              </h1>
              <p className="text-white/90 text-lg font-medium">
                Continue your journey with us
              </p>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-6">
              <div className="mb-6">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    console.error("Google Sign-In Failed");
                  }}
                />
              </div>
              
              <div className="space-y-1">
                <label
                  htmlFor="signin-email"
                  className="block text-sm font-semibold text-white/90"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    id="signin-email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={handleSignInChange}
                    className="w-full pl-12 pr-4 py-2 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white "
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label
                  htmlFor="signin-password"
                  className="block text-sm font-semibold text-white/90"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                  <input
                    id="signin-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={handleSignInChange}
                    className="w-full pl-12 pr-4 py-2 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 text-white "
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {warning && (
                  <p className="text-red-600  mt-2 font-semibold">
                    Invalid email or password
                  </p>
                )}
                {gwarning && (
                  <p className="text-red-600  mt-2 font-semibold">
                    User not found, please sign up
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className={`
                  w-full py-3 px-6 font-semibold rounded-lg transition-all duration-300 ease-in-out bg-black
                          ${isLoading 
                            ? 'cursor-not-allowed' 
                            : 'cursor-pointer'
                          }
                          text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]
                          focus:outline-none focus:ring-4 focus:ring-green-500/50
                          disabled:transform-none disabled:shadow-lg
                          relative overflow-hidden
                `}
                disabled={isLoading}
              >
                <div className={`flex items-center justify-center transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                  <Mail className="w-5 h-5 mr-3" />
                  Sign In
                </div>
                
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-6 w-6 text-white mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span className="text-white font-bold">Signing In...</span>
                    </div>
                  </div>
                )}
                
                {!isLoading && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
                )}
              </Button>
            </form>

            <div className="text-center mt-8">
              <p className="text-white/80 font-medium">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className=" font-bold transition-colors underline decoration-2 underline-offset-4"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
