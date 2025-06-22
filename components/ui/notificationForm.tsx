import { Button } from "@/components/ui/button";

export default function NotificationForm() {
  return (
    <form className="max-w-xl mx-auto p-12 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Notification Settings</h2>
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-sky-500" />
          Email notifications
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-sky-500" />
          SMS notifications
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" className="accent-sky-500" />
          Push notifications
        </label>
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