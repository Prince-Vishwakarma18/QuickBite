import React, { useState } from "react";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

function AuthDrawer({ open, setOpen }) {
   const [mode, setMode] = useState("signin");
   const handleModeSwitch = (newMode) => setMode(newMode);

   if (!open) return null;

   return (
      <div
         onClick={() => setOpen(false)}
         className="fixed inset-0 z-50 text-black/60 flex justify-end"
      >
         <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:w-96 bg-yellow-50 h-full flex flex-col px-6 py-8 overflow-y-auto"
         >
            <button
               onClick={() => setOpen(false)}
               className="absolute top-4 right-4 text-black hover:text-gray-800 text-xl"
            >
               ✕
            </button>

            <h1 className="text-center text-2xl font-black mb-1">
               <span className="text-red-500">Quick</span>
               <span className="text-orange-500">Bite</span>
            </h1>

            <h2 className="text-center text-xl font-bold text-black mb-6">
               {mode === "signin" ? "Welcome back!" : "Create account"}
            </h2>

            {/* Toggle */}
            <div className="flex bg-white/10 gap-2  rounded-xl p-1 mb-6">
               <button
                  type="button"
                  onClick={() => handleModeSwitch("signin")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg shadow transition-all ${
                     mode === "signin"
                        ? "bg-black/10 text-orange-500 shadow-sm"
                        : "text-zinc-500"
                  }`}
               >
                  Login
               </button>
               <button
                  type="button"
                  onClick={() => handleModeSwitch("signup")}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg shadow transition-all ${
                     mode === "signup"
                        ? "bg-black/10 text-orange-500 shadow-sm"
                        : "text-zinc-500"
                  }`}
               >
                  Sign Up
               </button>
            </div>

            {mode === "signin" ? (
               <SigninForm setOpen={setOpen} />
            ) : (
               <SignupForm setOpen={setOpen} />
            )}

            <p className="text-sm text-zinc-500 text-center mt-6">
               {mode === "signin"
                  ? "Don't have an account?"
                  : "Already have an account?"}
               <span
                  onClick={() =>
                     handleModeSwitch(mode === "signin" ? "signup" : "signin")
                  }
                  className="text-orange-500 font-bold cursor-pointer ml-1"
               >
                  {mode === "signin" ? "Sign Up" : "Login"}
               </span>
            </p>
         </div>
      </div>
   );
}

export default AuthDrawer;
