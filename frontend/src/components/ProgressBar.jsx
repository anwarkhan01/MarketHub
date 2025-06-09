const ProgressBar = () => {
  return (
    <div className="fixed top-0 w-full h-1 bg-blue-700 z-50">
      <div
        className="h-full opacity-50"
        style={{
          background:
            "linear-gradient(to right, transparent, transparent,  white, transparent, transparent)",
          animation: "flowingLight 3s infinite linear",
        }}
      />
      <style>
        {`
          @keyframes flowingLight {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}
      </style>
    </div>
  );
};

export default ProgressBar;
