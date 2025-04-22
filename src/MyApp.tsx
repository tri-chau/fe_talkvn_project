import React from "react";
import Sidebar from "./pages/private/Home/LeftSideBar.tsx";

function MyApp() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 bg-gray-100"> {/* Nội dung chính */}</div>
    </div>
  );
}

export default MyApp;