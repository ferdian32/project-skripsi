import { Outlet } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import Navbar from "../../components/dashboard/Navigation";

const DashboardPage = () => {
  return (
    <section className="flex  bg-gray-100">
      <Sidebar />

      <div className="flex-1 min-w-0">
        <Navbar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </section>
  );
};

export default DashboardPage;
