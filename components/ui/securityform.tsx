import { Button } from "@/components/ui/button";

export default function SecurityForm() {
  return (
    <form className="max-w-xl mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Current Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded bg-white"
          placeholder="Enter current password"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">New Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded bg-white"
          placeholder="Enter new password"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Confirm New Password</label>
        <input
          type="password"
          className="w-full p-2 border rounded bg-white"
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
  );
}