import React, { useEffect } from "react";

function Flash2(props) {
  const { warntype, message } = props.message;
  const index = 1;
  // console.log("Flash2 warntype: ", warntype);
  // console.log("Flash2 message: ", message);
  return <div className={`floating-alerts alert alert-${warntype} text-center floating-alert shadow-sm`}>{message}</div>;
}

export default Flash2;
