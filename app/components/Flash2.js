import React, { useEffect } from "react";

function Flash2(msg) {
  return (
    <div className="floating-alerts">
      <div key={1} className="alert alert-success text-center floating-alert shadow-sm">
        {msg}
      </div>
    </div>
  );
}

export default Flash2;
