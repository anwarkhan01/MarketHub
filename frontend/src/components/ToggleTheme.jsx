import {useEffect, useState} from "react";
import {Moon, Sun} from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 px-4 rounded dark:text-white"
    >
      {isDark ? (
        <Sun className="text-white" />
      ) : (
        <Moon className="text-black" />
      )}
    </button>
  );
}
