// Layout.jsx — Universal layout wrapper providing top Navbar across all pages
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
}
