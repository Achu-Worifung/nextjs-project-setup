'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import EditProfileForm from "@/components/ui/editProfileForm";
import SecurityForm from "@/components/ui/securityform";
import PaymentMethodsForm from "@/components/ui/payment-form";


import { UserLock, Pencil , CreditCard  } from 'lucide-react';

const sidebarOptions = [
  { key: "edit", label: "Edit profile", icon: <Pencil className="size-5"/> },
  { key: "payment", label: "Payment", icon: <CreditCard className="size-5"/> },
  { key: "security", label: "Security", icon: <UserLock className="size-5"/> },
];

export default function ProfileSettingPage() {
  const [activeTab, setActiveTab] = useState("edit");
  // const activeOption = sidebarOptions.find(option => option.key === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto min-h-screen">
        {/* Mobile Header with Horizontal Tabs */}
        <div className="lg:hidden bg-white shadow-lg">
          <div className="p-4 border-b border-brand-gray-200">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Settings</h2>
              <p className="text-sm text-gray-600">Manage your account preferences</p>
            </div>
          </div>
          
          {/* Mobile Horizontal Scrollable Tabs */}
          <div className="px-4 pb-4 ">
            <div className="flex space-x-2 overflow-x-auto scrollbar-hide pb-2 justify-center">
              {sidebarOptions.map((option) => (
                <button
                  key={option.key}
                  className={`pt-2 flex-shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 min-w-[80px]
                    ${activeTab === option.key
                      ? "bg-blue-50 text-blue-700 border-2 border-brand-pink-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-2 border-transparent"}
                  `}
                  onClick={() => setActiveTab(option.key)}
                >

                  <span className="font-medium text-xs text-center leading-tight">{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-80  flex-col min-h-screen">
          {/* Header */}
          <div className="p-8 border-b border-brand-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {sidebarOptions.map((option) => (
                <li key={option.key} className="relative">
                  <button
                    className={`w-full flex items-center gap-4 px-4 py-1 rounded-xl transition-all duration-200 group
                      ${activeTab === option.key
                        ? "bg-blue-50 text-blue-700 shadow-sm border border-brand-pink-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                    `}
                    onClick={() => setActiveTab(option.key)}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      activeTab === option.key 
                        ? "bg-brand-pink-100" 
                        : "bg-brand-gray-100 group-hover:bg-gray-200"
                    }`}>
                      {option.icon}
                    </div>
                    <span className="font-medium">{option.label}</span>
                  </button>
                  {activeTab === option.key && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-r-full"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-1 sm:p-6 lg:p-8 min-h-[400px] lg:min-h-[600px]" >
            <div className="p-2 sm:p-6 lg:p-8"> 
              {activeTab === "edit" && <EditProfileForm />}
              {activeTab === "security" && <SecurityForm />}
              {activeTab === "payment" && <PaymentMethodsForm />}
          </div>
        </div>
      </div>
    </div>
  );
}
