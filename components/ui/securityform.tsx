import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DeleteAccountDialog } from "@/components/ui/delete-account-dialog";

export default function SecurityForm() {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Here you would actually call your delete account API
      console.log("Account deletion confirmed");
      alert("Account would be deleted (this is just a demo)");
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }, 2000);
  };

  return (
    <>
      <form className="max-w-xl mx-auto p-8  rounded shadow">
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
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </div>
      </form>
      <hr className="my-6 text-black h-0.5 border border-black" />
      <div>
        <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
        <p className="text-gray-600 mb-4">Permanently delete your account and all associated data.</p>
        <Button
          type="button"
          variant="destructive"
          className="mt-4"
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
    </>
  );
}
