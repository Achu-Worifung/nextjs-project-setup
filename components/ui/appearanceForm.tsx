import { Button } from "@/components/ui/button";

export default function AppearanceForm() {
  return (
    <form className="max-w-xl mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Appearance Settings</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Theme</label>
        <select className="w-full p-2 border rounded bg-white">
          <option value="system">System Default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Font Size</label>
        <select className="w-full p-2 border rounded bg-white">
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Accent Color</label>
        <input
          type="color"
          className="w-12 h-12 p-0 border-none bg-transparent"
          defaultValue="#0ea5e9"
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