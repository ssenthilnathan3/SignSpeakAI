import { useDarkMode } from "@/hooks/use-dark-mode";

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex items-center">
      <span className="material-icons text-gray-500 dark:text-gray-400 mr-2">light_mode</span>
      <div className="relative inline-block w-10 mr-2 align-middle select-none">
        <input 
          id="toggle" 
          type="checkbox" 
          checked={isDarkMode}
          onChange={toggleDarkMode}
          className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 checked:right-0 checked:border-green-500 right-[calc(100%-1.5rem)]"
        />
        <label 
          htmlFor="toggle" 
          className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer checked:bg-green-500"
        />
      </div>
      <span className="material-icons text-gray-500 dark:text-gray-400">dark_mode</span>
    </div>
  );
}
