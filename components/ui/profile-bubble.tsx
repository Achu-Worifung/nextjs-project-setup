import React from "react";

interface ProfileBubbleProps {
  name: string;
  avatarUrl?: string;
  size?: number; // px
}

const getInitials = (name: string) =>
  name.charAt(0).toUpperCase() || "U";

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
    title={name}
  >
    {avatarUrl ? (
      <img
        src={avatarUrl}
        alt={name}
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