
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);

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
        setSignUpError("⚠️ Password must be at least 8 characters, include 1 uppercase letter and 1 number.");
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
    console.log("Sign In Data:", signInData);
  };

  const handleSignUpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPasswordValid(signUpData.password)) {
      setSignUpError("⚠️ Password must be at least 8 characters, include 1 uppercase letter and 1 number.");
      return;
    }
    setSignUpError("");
    console.log("Sign Up Data:", signUpData);
  };

  return (
    <div className="flex h-screen w-screen font-sans" style={{ backgroundColor: "#BAE4F0" }}>
      <div className="w-1/2 flex flex-col justify-center items-center relative overflow-hidden">
        {isSignUp ? (
          <>
            <img src="beach.jpg" alt="Beach" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Button
                onClick={() => setIsSignUp(false)}
                className="bg-white px-32 py-8 rounded-full shadow-md w-36 h-12 text-center text-3xl font-extrabold font-['Abhaya_Libre_ExtraBold']"
              >
                Login
              </Button>
            </div>
          </>
        ) : (
          <>
            <Image
              src="/signInbubbles.svg"
              alt="Sign In Bubbles"
              width={120}
              height={140}
              className="absolute top-0 right-0 mt-4 mr-4"
            />
            <h1 className="text-neutral-600 text-5xl font-normal font-['Abhaya_Libre'] tracking-[6.75px]">
              Login
            </h1>
            <p className="mb-4 pt-10 text-neutral-600/80 text-2xl font-semibold font-['Abhaya_Libre_SemiBold']">
              Start Booking Now
            </p>

            <form onSubmit={handleSignInSubmit} className="flex flex-col w-2/3 max-w-sm">
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={signInData.email}
                onChange={handleSignInChange}
                className="mb-4 p-2 rounded border border-gray-300 shadow-sm text-gray-600 bg-white"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={signInData.password}
                onChange={handleSignInChange}
                className="mb-6 p-2 rounded border border-gray-300 shadow-sm text-gray-600 bg-white"
              />
              <Button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-full shadow-xl">
                Sign In
              </Button>
            </form>

            <Image
              src="/signInbubbles.svg"
              alt="Sign In Bubbles"
              width={120}
              height={140}
              className="absolute bottom-0 left-0 mb-4 ml-4"
            />
          </>
        )}
      </div>

      <div className="w-1/2 flex flex-col justify-center items-center relative overflow-hidden">
        {isSignUp ? (
          <>
            <Image
              src="/signInbubbles.svg"
              alt="Sign Up Bubbles"
              width={120}
              height={140}
              className="absolute top-0 right-0 mt-4 mr-4"
            />
            <h1 className="text-neutral-600 text-5xl font-normal font-['Abhaya_Libre'] tracking-[6.75px]">
              Sign Up
            </h1>
            <p className="mb-4 pt-10 text-neutral-600/80 text-2xl font-semibold font-['Abhaya_Libre_SemiBold']">
              Create Your Account
            </p>

            <form onSubmit={handleSignUpSubmit} className="flex flex-col w-2/3 max-w-sm">
              <input
                name="firstName"
                type="text"
                placeholder="First Name"
                value={signUpData.firstName}
                onChange={handleSignUpChange}
                className="mb-4 p-2 rounded border border-gray-300 shadow-sm text-gray-600 bg-white"
              />
              <input
                name="middleName"
                type="text"
                placeholder="Middle Name (optional)"
                value={signUpData.middleName}
                onChange={handleSignUpChange}
                className="mb-4 p-2 rounded border border-gray-300 shadow-sm text-gray-600 bg-white"
              />
              <input
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={signUpData.lastName}
                onChange={handleSignUpChange}
                className="mb-4 p-2 rounded border border-gray-300 shadow-sm text-gray-600 bg-white"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={handleSignUpChange}
                className="mb-4 p-2 rounded border border-gray-300 shadow-sm text-gray-600 bg-white"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={handleSignUpChange}
                className="mb-2 p-2 rounded border border-gray-300 shadow-sm text-gray-600 bg-white"
              />
              {signUpError && (
                <span className="text-red-500 text-sm mb-2 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
                  {signUpError}
                </span>
              )}
              <Button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-full shadow-xl">
                Sign Up
              </Button>
            </form>

            <Image
              src="/signInbubbles.svg"
              alt="Sign Up Bubbles"
              width={120}
              height={140}
              className="absolute bottom-0 left-0 mb-4 ml-4"
            />
          </>
        ) : (
          <>
            <img src="beach.jpg" alt="Beach" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Button
                onClick={() => setIsSignUp(true)}
                className="bg-white px-32 py-8 rounded-full shadow-md w-36 h-12 text-center text-3xl font-extrabold font-['Abhaya_Libre_ExtraBold']"
              >
                Sign Up
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}