import React from "react";
import { doSignOut } from "../../firebase/auth";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { userLoggedIn } = useAuth();
  return (
    <>
      <div className="max-sm:h-[50px] h-[5rem] shadow-lg border-b-2 gap-0 border-white flex flex-col justify-center items-center fixed top-0 left-0 w-full bg-[#171717]">
        <h2
          style={{ fontFamily: '"Rubik", sans-serif' }}
          className="max-sm:text-2xl text-4xl text-blue-600 font-extrabold"
        >
          NextAi
        </h2>
        <p className="max-sm:text-[10px] text-[15px] font-mono">
          THE AI OF NEXT GENERATION
        </p>
      </div>
      {userLoggedIn && (
        <div
          onClick={doSignOut}
          className=" bg-gray-600 cursor-pointer ml-5 text-[14px] max-sm:ml-3 max-sm:w-[30px] max-sm:h-[30px] w-[50px] h-[50px] top-1 max-sm:right-3 right-4 max-sm:top-0.5 mt-2  absolute rounded-sm flex justify-center items-center"
        >
          <i className="fa-solid fa-right-from-bracket text-white"></i>
        </div>
      )}
    </>
  );
};

export default Navbar;
