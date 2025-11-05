import React from "react";

export default function VideoRecordingNotice({ position = "top-right", autoHide = true }) {
  return (
    <div className={`fixed ${position === "top-right" ? "top-4 right-4" : "top-4 left-4"} z-50 bg-black/80 text-white px-3 py-2 rounded shadow-lg text-xs font-bold`}>
      📹 Video Recording Active
    </div>
  );
}
