import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-row gap-2 ml-6 mt-4">
      <div className="w-3 h-3 rounded-full bg-blue-700 animate-bounce"></div>
      <div className="w-3 h-3 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-3 h-3 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
};

export default Loader;
