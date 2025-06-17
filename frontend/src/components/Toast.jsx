import React, {useEffect} from "react";

const Toast = ({
  message = " A demo message",
  type = "information",
  duration = 3000,
  onclose,
}) => {
  const borderColors = {
    success: "border-green-500",
    failure: "border-red-500",
    information: "border-blue-500",
    warning: "border-yellow-500",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onclose) onclose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onclose]);
  return (
    <div
      className={`fixed top-3 left-[50vw] translate-x-[-50%] bg-[#1a1a2e] rounded-[7px] border-b-3 z-20 ${borderColors[type]}`}
    >
      <div className="text-white pt-1 pr-3 pb-2 pl-3">
        <span className="text-sm bg-">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
