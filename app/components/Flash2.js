import React, { useEffect } from "react";

function Flash2(msg, col) {
  return (
    <div className="floating-alerts">
      <div key={1} className={`alert text-center floating-alert shadow-sm ${col === "danger" ? "alert-danger" : "alert-success"}`}>
        {msg}
      </div>
    </div>
  );
}

export default Flash2;
