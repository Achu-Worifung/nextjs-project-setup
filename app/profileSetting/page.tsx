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
    <div className="flex min-h-screen text-black font-sans" style={{ backgroundColor: "#BAE4F0" }}>
      {/* Sidebar */}
      <aside className="w-64 border-r border-black flex flex-col items-center relative">
        <h2 className="text-xl pt-10 font-bold mb-15">Settings</h2>
        <ul className="w-full relative">
          {sidebarOptions.map((option) => (
            <li key={option.key} className="relative w-full">
              <button
                className={`w-full flex items-center gap-2 px-6 py-3 rounded-md transition-colors
                  ${activeTab === option.key
                    ? "bg-sky-100 text-black font-semibold"
                    : "text-gray-600 hover:bg-sky-50"}
                `}
                onClick={() => setActiveTab(option.key)}
                style={{ position: "relative", zIndex: 1 }}
              >
                <img src={option.icon} alt={option.label} className="w-6 h-6" />
                {option.label}
              </button>
              {activeTab === option.key && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-0 h-full w-1 bg-sky-500 rounded-r"
                  style={{ zIndex: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex-1 items-center justify-center p-10">
        {activeTab === "edit" && <EditProfileForm />}
        {activeTab === "notification" && <NotificationForm />}
        {activeTab === "security" && <SecurityForm />}
        {activeTab === "appearance" && <AppearanceForm />}
        {activeTab === "help" && <HelpForm />}
      </div>
    </div>
  );
}