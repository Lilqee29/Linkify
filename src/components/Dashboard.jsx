import DashboardNavbar from "./DashboardNavbar";
import { PlusCircle, Eye } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <DashboardNavbar username="JohnDoe" />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center text-orange-500 mb-10">
          Your Links Dashboard
        </h1>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Add Link Button */}
          <button className="flex items-center justify-center gap-2 bg-orange-500 text-black font-bold py-4 rounded-md hover:bg-orange-600 transition">
            <PlusCircle />
            Add New Link
          </button>

          {/* Preview Links Button */}
          <button className="flex items-center justify-center gap-2 bg-neutral-900 border border-orange-500 text-orange-500 font-bold py-4 rounded-md hover:bg-neutral-800 transition">
            <Eye />
            Preview Links
          </button>

          {/* More buttons as needed */}
        </div>

        {/* Example of link list */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Your Links</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-neutral-900 p-4 rounded-md border border-neutral-800">
              <span className="text-orange-500 font-medium">My Instagram</span>
              <button className="text-neutral-400 hover:text-orange-500">Edit</button>
            </div>

            <div className="flex justify-between items-center bg-neutral-900 p-4 rounded-md border border-neutral-800">
              <span className="text-orange-500 font-medium">My YouTube</span>
              <button className="text-neutral-400 hover:text-orange-500">Edit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
