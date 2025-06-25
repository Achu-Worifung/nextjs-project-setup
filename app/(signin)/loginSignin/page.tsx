"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Plane,
  MapPin,
  Compass,
  Globe,
  Palmtree,
} from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";

const handleGoogleLogin = async (credentialResponse: any) => {
  if (credentialResponse.credential) {
    try {
      const res = await fetch("/api/verify-google-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });
      const data = await res.json();
      if (res.ok) {
        // data.payload contains the verified user info (email, name, etc.)
        console.log("Verified Google User:", data.payload);
        // You can now log the user in, set session, redirect, etc.
      } else {
        console.error("Google token verification failed:", data.error);
      }
    } catch (err) {
      console.error("Error verifying Google token:", err);
    }
  } else {
    console.warn("No credential found in response");
  }
};

// Add custom animations via CSS-in-JS (could also be in globals.css)
const styles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .delay-1000 { animation-delay: 1s; }
  .delay-2000 { animation-delay: 2s; }
  .delay-3000 { animation-delay: 3s; }
`;

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [signUpError, setSignUpError] = useState("");

  const handleSignInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      if (!isPasswordValid(value)) {
        setSignUpError(
          "Password must be at least 8 characters, include 1 uppercase letter and 1 number.",
        );
      } else {
        setSignUpError("");
      }
    }
  };

  // Password validation: at least 8 chars, 1 uppercase, 1 number
  const isPasswordValid = (password: string) => {
    return /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  

  const handleSignInSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Sign In Data:", signInData);
      setIsLoading(false);
    }, 1000);
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordValid(signUpData.password)) {
      setSignUpError(
        "Password must be at least 8 characters, include 1 uppercase letter and 1 number.",
      );
      return;
    }
    setSignUpError("");
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Sign Up Data:", signUpData);
      setIsLoading(false);
    }, 1000);
  };
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row font-sans relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {/* Travel-themed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          {/* Cloud shapes */}
          <div className="absolute top-10 left-10 w-20 h-12 bg-white/20 rounded-full blur-sm animate-pulse"></div>
          <div className="absolute top-20 right-20 w-32 h-16 bg-white/15 rounded-full blur-sm animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-16 w-24 h-14 bg-white/20 rounded-full blur-sm animate-pulse delay-2000"></div>

          {/* Travel icons scattered */}
          <div className="absolute top-1/4 left-1/4 text-white/10 animate-float">
            <Plane className="w-12 h-12 rotate-45" />
          </div>
          <div className="absolute top-1/3 right-1/3 text-white/10 animate-float delay-1000">
            <Globe className="w-10 h-10" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 text-white/10 animate-float delay-2000">
            <Compass className="w-14 h-14" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 text-white/10 animate-float delay-3000">
            <MapPin className="w-8 h-8" />
          </div>

          {/* Palm tree silhouettes */}
          <div className="absolute bottom-0 left-8 text-green-800/20">
            <Palmtree className="w-16 h-20" />
          </div>
          <div className="absolute bottom-0 right-12 text-green-800/20">
            <Palmtree className="w-12 h-16" />
          </div>
        </div>
      </div>{" "}
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {!isSignUp ? (
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Welcome Back
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Sign in to your account to continue your journey
                  </p>
                </div>

                <form onSubmit={handleSignInSubmit} className="space-y-6">
                  <GoogleLogin
  onSuccess={handleGoogleLogin}
  onError={() => {
    console.error("Google Sign-In Failed");
  }}
/>
                  <div className="space-y-2">
                    <label
                      htmlFor="signin-email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="signin-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={signInData.email}
                        onChange={handleSignInChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="signin-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="signin-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={handleSignInChange}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Don&apos;t have an account?{" "}
                    <button
                      onClick={() => setIsSignUp(true)}
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Sign Up
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center">
              <div className="relative p-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                {/* Travel illustration with icons */}
                <div className="flex justify-center items-center space-x-6 mb-6">
                  <div className="p-4 bg-white/30 rounded-full">
                    <Plane className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-4 bg-white/30 rounded-full">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-4 bg-white/30 rounded-full">
                    <Compass className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Explore the World
                </h2>
                <p className="text-white/90 mb-6">Your next adventure awaits</p>
                <Button
                  onClick={() => setIsSignUp(false)}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-white/90 font-bold px-8 py-4 rounded-full shadow-lg"
                >
                  {" "}
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-30">
          <div className="w-16 h-20 flex flex-col items-center justify-center text-white/40">
            <Plane className="w-8 h-8 mb-2" />
            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 opacity-30">
          <div className="w-16 h-20 flex flex-col items-center justify-center text-white/40">
            <MapPin className="w-8 h-8 mb-2" />
            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </div>
      {/* Right Panel - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 relative z-10">
        {" "}
        <div className="w-full max-w-md">
          {isSignUp ? (
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Create Account
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Join us and start your journey today
                  </p>
                </div>

                <form onSubmit={handleSignUpSubmit} className="space-y-4">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
  onError={() => {
                        
                    
                    }}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    text="signup_with"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="signup-firstname"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        id="signup-firstname"
                        name="firstName"
                        type="text"
                        placeholder="First name"
                        value={signUpData.firstName}
                        onChange={handleSignUpChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="signup-lastname"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        id="signup-lastname"
                        name="lastName"
                        type="text"
                        placeholder="Last name"
                        value={signUpData.lastName}
                        onChange={handleSignUpChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="signup-middlename"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Middle Name{" "}
                      <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      id="signup-middlename"
                      name="middleName"
                      type="text"
                      placeholder="Middle name"
                      value={signUpData.middleName}
                      onChange={handleSignUpChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="signup-email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={signUpData.email}
                        onChange={handleSignUpChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="signup-password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={signUpData.password}
                        onChange={handleSignUpChange}
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {signUpError && (
                    <Alert className="border-red-200 bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center">
                        <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                        <span className="text-red-700 text-sm">
                          {signUpError}
                        </span>
                      </div>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <button
                      onClick={() => setIsSignUp(false)}
                      className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </CardContent>{" "}
            </Card>
          ) : (
            <div className="text-center">
              <div className="relative p-12 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
                {/* Travel illustration with icons */}
                <div className="flex justify-center items-center space-x-6 mb-6">
                  <div className="p-4 bg-white/30 rounded-full">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-4 bg-white/30 rounded-full">
                    <Compass className="w-8 h-8 text-white" />
                  </div>
                  <div className="p-4 bg-white/30 rounded-full">
                    <MapPin className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">
                  Ready to Travel?
                </h2>
                <p className="text-white/90 mb-6">
                  Join our community of travelers
                </p>
                <Button
                  onClick={() => setIsSignUp(true)}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-white/90 font-bold px-8 py-4 rounded-full shadow-lg"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 opacity-30">
          <div className="w-16 h-20 flex flex-col items-center justify-center text-white/40">
            <Globe className="w-8 h-8 mb-2" />
            <div className="w-6 h-6 bg-white/20 rounded-full"></div>{" "}
          </div>
        </div>
        <div className="absolute bottom-4 left-4 opacity-30">
          <div className="w-16 h-20 flex flex-col items-center justify-center text-white/40">
            <Compass className="w-8 h-8 mb-2" />
            <div className="w-6 h-6 bg-white/20 rounded-full"></div>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
