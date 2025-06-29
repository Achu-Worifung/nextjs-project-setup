"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, User, UserPlus, Lock, Mail } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  title?: string;
  message?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  onSignIn,
  onSignUp,
  title = "Sign in required",
  message = "Please sign in or create an account to book your flight"
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <Card className="relative w-full max-w-md mx-4 shadow-2xl border-0">
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                {title}
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                {message}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-gray-100"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 pt-0">
          {/* Sign In Button */}
          <Button
            onClick={onSignIn}
            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            <User className="w-4 h-4 mr-2" />
            Sign In to Your Account
          </Button>
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">
                or
              </span>
            </div>
          </div>
          
          {/* Sign Up Button */}
          <Button
            onClick={onSignUp}
            variant="outline"
            className="w-full h-12 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors duration-200"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create New Account
          </Button>
          
          {/* Additional Info */}
          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <Mail className="w-3 h-3 mr-1" />
              Secure booking with encrypted data
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
