"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useVault } from "@/lib/vaultContext";

export default function page() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { setMasterPassword } = useVault();

  const router = useRouter();

  //Check if the password and confirm password matches
  const handleClick = () => {
    if (isMatch()) initializeVault();
    else setError("Password do not match");
  };

  const isMatch = () =>
    password.length > 0 && password.trim() == confirmPassword.trim();

  //Api for saving the data and redirecting to /vault
  const initializeVault = () => {
    setMasterPassword(password);
    router.push("/vault");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border dark:border-zinc-800 space-y-5">
        <h1 className="text-2xl font-semibold text-center tracking-tight">
          Set Master Password
        </h1>

        {/* PASSWORD */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-500">Master Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 text-sm"
          />
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-500">Confirm Password</label>
          <input
            type="password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 text-sm"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={() => handleClick()}
          className="w-full py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-zinc-800 transition dark:bg-white dark:text-black"
        >
          Continue
        </button>

        {/* ERROR */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}
