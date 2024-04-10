import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../firebase/auth";
import { NavLink, Navigate } from "react-router-dom";
function Login() {
  const { userLoggedIn, setUserLoggedIn } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [email, setEmail] = useState("havyas@gmail.com");
  const [password, setPassword] = useState("Havyas@1234");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password).catch(() => {
        alert("User Not Registered Please SignUp");
      });;
      setIsSigningIn(false);
    }
  };

  const SignInwithGoogle = () => {
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch(() => setIsSigningIn(false));
      setIsSigningIn(false);
    }
  };

  return (
    <div className=" flex flex-col w-[100vw] h-[100vh] justify-center items-center shadow-lg shadow-black">
      <form
        onSubmit={onSubmit}
        className="max-sm:w-[90vw] flex w-[30vw] flex-col bg-blue-600 p-5 gap-3 rounded-lg "
      >
        {userLoggedIn && <Navigate to={"/"} replace={true} />}
        <h3 className="max-sm:text-2xl  text-4xl font-bold  text-center">Login</h3>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-sm:text-lg text-xl py-2 px-3 text-black font-bold rounded-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="max-sm:text-lg text-xl py-2 px-3 text-black font-bold rounded-sm"
        />
        <button
          disabled={isSigningIn}
          type="submit"
          className="max-sm:w-[7rem] max-sm:h-[2.4rem] max-sm:text-[17px] bg-gray-900 w-[9rem] h-[3rem] rounded-md text-xl font-bold"
        >
          Submit
        </button>
      </form>
      <p className="mt-2 font-bold">
        Dont Have an Account? 
         <NavLink to={"/signup"} className={"text-cyan-400 underline"}> Register</NavLink>
      </p>
      <button
        onClick={SignInwithGoogle}
        disabled={isSigningIn}
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

export default Login;
