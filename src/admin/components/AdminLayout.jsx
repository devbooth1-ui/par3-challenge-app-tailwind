import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-green-900 text-white p-4 space-y-4">
        <h1 className="text-xl font-bold">Par3 Admin</h1>
        <nav className="flex flex-col space-y-2">
          <Link to="/admin/courses" className="hover:bg-green-700 p-2 rounded">Courses</Link>
          <Link to="/admin/players" className="hover:bg-green-700 p-2 rounded">Players</Link>
          <Link to="/admin/reports" className="hover:bg-green-700 p-2 rounded">Reports</Link>
          <Link to="/admin/claims" className="hover:bg-green-700 p-2 rounded">Award Claims</Link>
          <Link to="/admin/settings" className="hover:bg-green-700 p-2 rounded">Settings</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
