'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteAccountDialog } from "@/components/ui/delete-account-dialog";
import { SignOutDialog } from "@/components/ui/sign-out-dialog";

export default function SecurityForm() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSignOutDialogOpen, setIsSignOutDialogOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    localStorage.removeItem("token");
    localStorage.removeItem("isSignedIn");
    setIsDeleting(false);
    setIsDeleteDialogOpen(false);
    window.location.href = "/";
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);

    localStorage.removeItem("token");
    localStorage.removeItem("isSignedIn");
    setIsSigningOut(false);
    setIsSignOutDialogOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      <form className="max-w-xl rounded ">
        <h2 className="text-2xl font-bold mb-6">Security Settings</h2>
        <p>Update your password and enhance your account security.</p>
        <hr className="my-6 text-black h-0.5 border border-black" />

        <div className="mb-4">
          <label className="block font-medium mb-1">Current Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded bg-white cursor-text"
            placeholder="Enter current password"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">New Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded bg-white cursor-text"
            placeholder="Enter new password"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Confirm New Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded bg-white cursor-text"
            placeholder="Confirm new password"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <Button type="submit" variant="default">
            Save
          </Button>
        </div>
      </form>
      <hr className="my-6 text-black h-0.5 border border-black" />
      <div>
        <p className="text-2xl font-bold mb-6">Sign out</p>
        <p>Log out and end your session on this device</p>
        <Button
          type="button"
          variant="secondary"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => setIsSignOutDialogOpen(true)}
        >
          Sign Out
        </Button>
      </div>
      <hr className="my-6 text-black h-0.5 border border-black" />
      <div>
        <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
        <p className="text-brand-gray-600 mb-4">
          Permanently delete your account and all associated data.
        </p>
        <Button
          type="button"
          variant="destructive"
          className="mt-4 bg-red-600 hover:bg-red-700 text-white"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          Delete Account
        </Button>
      </div>

      <DeleteAccountDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />

      <SignOutDialog
        isOpen={isSignOutDialogOpen}
        onClose={() => setIsSignOutDialogOpen(false)}
        onConfirm={handleSignOut}
        isLoading={isSigningOut}
      />
    </>
  );
}


