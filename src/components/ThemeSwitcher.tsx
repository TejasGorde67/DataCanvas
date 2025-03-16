// import { useState, useEffect } from "react";
// import { Moon, Sun } from "lucide-react";

// export function ThemeSwitcher() {
//   const [isDarkMode, setIsDarkMode] = useState(true);

//   useEffect(() => {
//     // Check for saved theme preference or use system preference
//     const savedTheme = localStorage.getItem("theme");
//     const prefersDark = window.matchMedia(
//       "(prefers-color-scheme: dark)"
//     ).matches;

//     if (savedTheme === "light") {
//       setIsDarkMode(false);
//       document.documentElement.classList.remove("dark");
//     } else if (savedTheme === "dark" || prefersDark) {
//       setIsDarkMode(true);
//       document.documentElement.classList.add("dark");
//     }
//   }, []);

//   const toggleTheme = () => {
//     if (isDarkMode) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//     }
//     setIsDarkMode(!isDarkMode);
//   };

//   return (
//     <button
//       onClick={toggleTheme}
//       className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5"
//       aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
//     >
//       {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//     </button>
//   );
// }
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "light") {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-black");
      document.body.classList.add("bg-gray-100");
    } else if (savedTheme === "dark" || prefersDark) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-black");
      document.body.classList.remove("bg-gray-100");
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      // Switch to light mode
      document.documentElement.classList.remove("dark");
      document.body.classList.remove("bg-black");
      document.body.classList.add("bg-gray-100");
      localStorage.setItem("theme", "light");
    } else {
      // Switch to dark mode
      document.documentElement.classList.add("dark");
      document.body.classList.add("bg-black");
      document.body.classList.remove("bg-gray-100");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-gray-400 hover:text-gray-300 rounded-lg hover:bg-white/5"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
