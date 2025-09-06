import React, { useState } from "react";

const CustomDropdown = ({ options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const handleOptionClick = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        className="block w-full pl-10 pr-10 py-3 bg-white/5 text-white border border-white/10 rounded-lg cursor-pointer focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
        onClick={toggleDropdown}
      >
        {selected}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <svg
            className="w-4 h-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul className="absolute w-full mt-2 bg-white/5 border border-white/10 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 text-white hover:bg-indigo-500 cursor-pointer transition-all"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
