import { useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggle = () => {
    if (isDark) {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    } else {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    }
    setIsDark(!isDark);
  };

  return (
    <button onClick={toggle}>
      {isDark ? "☀️ Light mode" : "🌙 Dark mode"}
    </button>
  );
}
