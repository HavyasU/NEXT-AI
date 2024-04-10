import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  doCreateUserWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../firebase/auth";
import { NavLink, Navigate } from "react-router-dom";
function SignUp() {
  const { userLoggedIn } = useAuth();
  const [isSigningUp, setisSigningUp] = useState(false);
  const [email, setEmail] = useState("havyas@gmail.com");
  const [password, setPassword] = useState("Havyas@1234");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningUp) {
      setisSigningUp(true);
      await doCreateUserWithEmailAndPassword(email, password).catch((err) => {
        alert(err?.toString()?.split("(")[1]?.split("/")[1]);
      });
      setisSigningUp(false);
    }
  };

  const SignInwithGoogle = () => {
    if (!isSigningUp) {
      setisSigningUp(true);
      doSignInWithGoogle().catch(() => setisSigningUp(false));
      setisSigningUp(false);
    }
  };

  return (
    <div className=" flex flex-col w-[100vw] h-[100vh] justify-center items-center shadow-lg shadow-black">
      <form
        onSubmit={onSubmit}
        className="max-sm:w-[90vw] max-sm:py-1 max-sm:gap-1  flex w-[30vw] flex-col bg-blue-600 p-5 gap-3 rounded-lg "
      >
        {userLoggedIn && <Navigate to={"/"} replace={true} />}
        <h3 className="max-sm:text-2xl text-4xl font-bold  text-center">
          SignUp
        </h3>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-sm:rounded-sm max-sm:text-lg text-xl max-sm:p-0 py-2 px-3 text-black font-bold rounded-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="max-sm:rounded-sm max-sm:text-lg text-xl  py-2 px-3 text-black font-bold rounded-sm"
        />
        <button
          disabled={isSigningUp}
          type="submit"
          className="max-sm:w-[7rem] max-sm:h-[2.4rem] max-sm:text-[17px] bg-gray-900 w-[9rem] h-[3rem] rounded-md text-xl font-bold"
        >
          Submit
        </button>
      </form>
      <p className="mt-2 font-bold">
        Already Have an Account?
        <NavLink to={"/login"} className={"text-cyan-400 underline"}>
          {" "}
          Login
        </NavLink>
      </p>
      <button
        onClick={SignInwithGoogle}
        disabled={isSigningUp}
        className="mt-10 inline-flex justify-center items-center gap-2 bg-white text-black py-3 px-5 rounded-full font-bold"
      >
        <img
          src="https://w7.pngwing.com/pngs/326/85/png-transparent-google-logo-google-text-trademark-logo.png"
          alt=""
          width={25}
        />
        Sign in With Google
      </button>
    </div>
  );
}

export default SignUp;
