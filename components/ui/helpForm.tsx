import { Button } from "@/components/ui/button";

export default function HelpForm() {
  return (
    <form className="max-w-xl mx-auto p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Help & Support</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="help-topic">
          Topic
        </label>
        <select
          id="help-topic"
          className="w-full p-2 border rounded bg-white"
        >
          <option value="">Select a topic</option>
          <option value="account">Account Issues</option>
          <option value="settings">Settings</option>
          <option value="security">Security</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="help-message">
          How can we help you?
        </label>
        <textarea
          id="help-message"
          className="w-full p-2 border rounded bg-white"
          rows={5}
          placeholder="Describe your issue or question..."
        />
      </div>

      <div className="flex gap-4 mt-6">
        <Button type="submit" variant="default">
          Submit
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  );
}