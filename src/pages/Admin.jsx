import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminLayout from "../admin/components/AdminLayout";
import Courses from "../admin/pages/Courses";
import Players from "../admin/pages/Players";
import Reports from "../admin/pages/Reports";
import AwardsClaims from "../admin/pages/AwardsClaims";
import Settings from "../admin/pages/Settings";

export default function AdminApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="courses" element={<Courses />} />
          <Route path="players" element={<Players />} />
          <Route path="reports" element={<Reports />} />
          <Route path="claims" element={<AwardsClaims />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
