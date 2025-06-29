import React from "react";
import Image from "next/image";

interface ProfileBubbleProps {
  name?: string | null;
  avatarUrl?: string;
  size?: number; // px
}

const getInitials = (name?: string | null) => {
  if (!name || name.length === 0) return "U";
  return name.charAt(0).toUpperCase();
};

export const ProfileBubble: React.FC<ProfileBubbleProps> = ({
  name,
  avatarUrl,
  size = 110,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "#f3f4f6",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontWeight: 600,
      fontSize: size * 0.9,
      color: "#374151",
      border: "2px solid #e5e7eb",
      userSelect: "none",
    }}
    title={name || "User"}
  >
    {avatarUrl ? (
      <Image
        src={avatarUrl}
        alt={name || "User profile"}
        width={size}
        height={size}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    ) : (
      getInitials(name)
    )}
  </div>
);

export default ProfileBubble;