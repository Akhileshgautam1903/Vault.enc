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
    if (isMatch()) saveWithEmpty();
    else setError("Password do not match");
  };

  const isMatch = () =>
    password.length > 0 && password.trim() == confirmPassword.trim();

  //Api for saving the data and redirecting to /vault
  const saveWithEmpty = async () => {
    const res = await fetch("/api/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ masterPassword: password, entries: [] }),
    });

    if (res.ok) {
      setMasterPassword(password);
      router.push("/vault");
    } else setError("Something went wrong. Please try again.");
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-4">
      <input
        className="border-zinc-600 border-2 outline-0 rounded-md py-1.5 px-2.5"
        type="password"
        placeholder="Enter Master password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="border-zinc-600 border-2 outline-0 rounded-md py-1.5 px-2.5"
        type="password"
        placeholder="Confirm Master password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button
        className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-39.5"
        onClick={() => handleClick()}
      >
        Submit
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
