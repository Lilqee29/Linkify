import { UserCircle } from "lucide-react";

const DashboardNavbar = ({ username }) => {
  return (
    <nav className="bg-black border-b border-neutral-800 px-6 py-4 flex justify-between items-center">
      {/* Logo / Name */}
      <div className="text-orange-500 font-bold text-2xl">
        Linkify
      </div>

      {/* User Info */}
      <div className="flex items-center space-x-4">
        <span className="text-white font-medium">{username}</span>
        <UserCircle className="text-orange-500 w-8 h-8" />
      </div>
    </nav>
  );
};

export default DashboardNavbar;
