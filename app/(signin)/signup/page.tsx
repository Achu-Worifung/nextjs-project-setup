"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ChevronsLeft,
  AlertCircleIcon

} from "lucide-react";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { SignInBg } from "@/components/ui/signin-bg";
import AlertTitle from "@mui/material/AlertTitle";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    email: "",
    password: "",
  });
  const [dupUser, setDupUser] = useState(false);
  const [warnings, setWarnings] = useState({
    len: false,
    upper: false,
    num: false,
    special: false,
  });

  const { setToken } = useAuth();

  const router = useRouter();

const handleSignUpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setSignUpData((prev) => ({ ...prev, [name]: value }));

  if (name === "password") {
    const lengthCheck = value.length >= 8;
    const upperCheck = /[A-Z]/.test(value);
    const lowerCheck = /[a-z]/.test(value);
    const numberCheck = /\d/.test(value);
    const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if(lengthCheck){
      setWarnings((prev) => ({ ...prev, len: true }));
    }else {
      setWarnings((prev) => ({ ...prev, len: false }));
    }

    if(upperCheck){
      setWarnings((prev) => ({ ...prev, upper: true }));
    }else {
      setWarnings((prev) => ({ ...prev, upper: false }));
    }

    if(lowerCheck){
      setWarnings((prev) => ({ ...prev, lower: true }));
    }else {
      setWarnings((prev) => ({ ...prev, lower: false }));
    }

    if(numberCheck){
      setWarnings((prev) => ({ ...prev, num: true }));
    }else {
      setWarnings((prev) => ({ ...prev, num: false }));
    }

    if(specialCheck){
      setWarnings((prev) => ({ ...prev, special: true }));
    }else {
      setWarnings((prev) => ({ ...prev, special: false }));
    }


    
  }
};
 const isPasswordValid = (password: string) => {
  const lengthCheck = password.length >= 8;
  const upperCheck = /[A-Z]/.test(password);
  const lowerCheck = /[a-z]/.test(password);
  const numberCheck = /\d/.test(password);
  const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return lengthCheck && upperCheck && lowerCheck && numberCheck && specialCheck;
};

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setIsLoading(true);
    // ---------------------------------------------------------
    try {
      const res = await fetch("/api/local-sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signUpData.email,
          password: signUpData.password,
          firstName: signUpData.firstName,
          lastName: signUpData.lastName,
          middleName: signUpData.middleName,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        //successful signed up
        setToken(data.token); 
        router.push("/"); 
      } else {
        if (res.status === 409) {
          // User already exists
          setDupUser(true);
        } 
      }
    } catch (err) {
      console.error("Error verifying error occured while signing up:", err);
    }
    // ----------------------------------------------------------
    setTimeout(() => {
      console.log("Sign Up Data:", signUpData);
      setIsLoading(false);
    }, 1000);
  };
  const handleGoogleSignUp= async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const res = await fetch("/api/verify-google-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: credentialResponse.credential }),
        });
        const googledata = await res.json();
        if (res.ok) {
          try {
            const res = await fetch("/api/google-sign-up", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: googledata.payload.sub , email: googledata.payload.email , fName: googledata.payload.given_name, lName: googledata.payload.family_name }),
            });
            const data = await res.json();
            if (res.ok) {
              setToken(data.token);
              router.push("/");
            } else {
              if (res.status === 409) {
                setDupUser(true);
              }
              else {
                console.error("Error during Google sign-up:", data.error);
              }
            }
          } catch (err) {
            console.error("Error during Google sign-up:", err);
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
  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans relative overflow-hidden">
      {/* Enhanced Glamoric Background */}
      <SignInBg />
        <button 
          onClick={() => router.push("/")} className="text-sm flex justify-center items-center absolute top-10 left-24 text-white/70 hover:text-white px-4 z-10 bg-black/50 rounded-full p-2 hover:bg-black/80 cursor-pointer">
          <ChevronsLeft className="w-6 h-6 " />  Go Home
        </button>
        <Card className="glass-morphism shadow-2xl border-0 rounded-3xl animate-pulse-glow overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-green-600" />
              </div>
            </div>
              <h1 className="text-4xl font-bold text-white mb-3 ">
              Create Account
            </h1>
            <p className="text-white/90 text-lg">
              Join us and start your journey today
            </p>
          </div>

          <form onSubmit={handleSignUpSubmit} className="space-y-4 text-white">
            <GoogleLogin
              onSuccess={handleGoogleSignUp}
              onError={() => {}}
              useOneTap={false}
              theme="outline"
              size="large"
              text="signup_with"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="signup-firstname"
                  className="block text-sm font-medium "
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="signup-lastname"
                  className="block text-sm font-medium "
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="signup-middlename"
                className="block text-sm font-medium "
              >
                Middle Name <span className="text-gray-400">(Optional)</span>
              </label>
              <input
                id="signup-middlename"
                name="middleName"
                type="text"
                placeholder="Middle name"
                value={signUpData.middleName}
                onChange={handleSignUpChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium "
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium "
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
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2  hover:text-gray-400 text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="">
                  {(!warnings.len || !warnings.upper || !warnings.special || !warnings.num) && signUpData.password && (
                    <Alert className="text-red-500" >
                       <AlertCircleIcon />
                       <AlertTitle>Password is not strong enough</AlertTitle>
                       <AlertDescription className="bg-transparent">
                        <ul className="list-inside list-disc text-sm text-red-500">
                          {
                            <>
                              {!warnings.len && <li>At least 8 characters</li>}
                              {!warnings.upper && <li>At least 1 uppercase letter</li>}
                              {!warnings.special && <li>At least 1 special character</li>}
                              {!warnings.num && <li>At least 1 number</li>}
                            </>
                          }
                        </ul>
                       </AlertDescription>
                    </Alert>)}
            </div>
            {
              dupUser && (
                <Alert className="text-red-500">
                  <AlertCircleIcon />
                  <AlertTitle>User already exists</AlertTitle>
                  <AlertDescription className="bg-transparent">
                    Please sign in or use a different email address.
                  </AlertDescription>
                </Alert>
              )
            }

            <Button
              type="submit"
              className={`w-full py-3 px-6 font-semibold rounded-lg transition-all duration-300 ease-in-out
                          ${isLoading
                            ? 'cursor-not-allowed'
                            : ' cursor-pointer'
                          }
                            text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]
                            focus:outline-none focus:ring-4 focus:ring-green-500/50
                            disabled:transform-none disabled:shadow-lg
                            relative overflow-hidden cursor-pointer`
                          }
              disabled={isLoading}
            >
              <div
                className={`flex items-center justify-center transition-opacity duration-200 cursor-pointer ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
              >
                <User className="w-5 h-5 mr-2" />
                Create Account
              </div>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-white mr-3"
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
                    <span className="text-white font-medium">
                      Creating Account...
                    </span>
                  </div>
                </div>
              )}

              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />
              )}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/signin")}
                className="text-white underline font-semibold transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </div>
        </CardContent>{" "}
      </Card>
    </div>
    // </div>
  );
}
