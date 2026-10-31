import { Moon, Sun } from "lucide-react";

const ThemeToggle = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-800 dark:text-yellow-400 dark:hover:bg-gray-700"
      title="Toggle Theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
};

export default ThemeToggle;
