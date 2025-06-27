'use client';

import { useState } from "react";
 import { motion } from "framer-motion";
import EditProfileForm from "@/components/ui/editProfileForm";
import NotificationForm from "@/components/ui/notificationForm";
import SecurityForm from "@/components/ui/securityform";
import AppearanceForm from "@/components/ui/appearanceForm";
import HelpForm from "@/components/ui/helpForm";

const sidebarOptions = [
  { key: "edit", label: "Edit profile", icon: "/pen.svg" },
  { key: "notification", label: "Notification", icon: "/noti-bell.svg" },
  { key: "security", label: "Security", icon: "/lock.svg" },
  { key: "appearance", label: "Appearance", icon: "/setting-gear.svg" },
  { key: "help", label: "Help", icon: "/help.svg" },
];

export default function ProfileSettingPage() {
  const [activeTab, setActiveTab] = useState("edit");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className="w-80 bg-white shadow-lg rounded-r-2xl flex flex-col min-h-screen">
          {/* Header */}
          <div className="p-8 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {sidebarOptions.map((option) => (
                <li key={option.key} className="relative">
                  <button
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                      ${activeTab === option.key
                        ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                    `}
                    onClick={() => setActiveTab(option.key)}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      activeTab === option.key 
                        ? "bg-blue-100" 
                        : "bg-gray-100 group-hover:bg-gray-200"
                    }`}>
                      <img 
                        src={option.icon} 
                        alt={option.label} 
                        className="w-5 h-5"
                      />
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
        <main className="flex-1 p-8">
          <div className="bg-white rounded-2xl shadow-lg min-h-[600px]">
            <div className="p-8">
              {activeTab === "edit" && <EditProfileForm />}
              {activeTab === "notification" && <NotificationForm />}
              {activeTab === "security" && <SecurityForm />}
              {activeTab === "appearance" && <AppearanceForm />}
              {activeTab === "help" && <HelpForm />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}