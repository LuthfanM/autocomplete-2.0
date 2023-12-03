import React from "react";
import { Search } from "react-feather";
import Image from "next/image";

export const IconInput = ({
  onChange,
  onKeyDown,
  value,
  disabled,
  isLoading,
  placeholder
}) => {
  return (
    <div className="w-max m-auto inline-block" style={{ width: "inherit" }}>
      <div>
        <Search className="absolute mt-2 pl-3" />
        {isLoading && (
          <img
            className="absolute mt-3 mr-2 w-4 h-4 left-auto right-3"
            src="/images/loadings.gif"
            alt="loading..."
          />
        )}
      </div>
      <input
        className="w-full pl-7 text-left p-3 h-8 mt-1 border-2 border-gray-300 rounded-md shadow-sm"
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange(e)}
        onKeyDown={(e) => onKeyDown(e)}
        value={value}
        disabled={disabled}
      />
    </div>
  );
};
