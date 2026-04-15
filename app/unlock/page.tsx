"use client";

import { useVault } from "@/lib/vaultContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Unlock = () => {
  const [password, setPassword] = useState<string>("");
  const [fileContents, setFileContents] = useState<string>("");
  const [error, setError] = useState<string>("");

  // using router for navigation
  const router = useRouter();

  // getting updater function from vaultContext
  const { setEntries, setMasterPassword } = useVault();

  const handleClick = async () => {
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ masterPassword: password, fileContents }),
    });

    if (res.ok) {
      //set entries and masterPassword in context
      const { data } = await res.json();

      //Populated the vaultContext
      setEntries(data);
      setMasterPassword(password);

      //redirect to /vault
      router.push("/vault");
    } else setError("Incorrect Master Password");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setFileContents(e.target?.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border dark:border-zinc-800 space-y-5">
        <h1 className="text-2xl font-semibold text-center tracking-tight">
          Unlock Vault
        </h1>

        {/* FILE INPUT */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-500">Encrypted File</label>
          <input
            type="file"
            accept=".enc"
            onChange={(e) => handleFileChange(e)}
            className="text-sm file:mr-3 file:px-3 file:py-1.5 file:border-0 file:rounded-md file:bg-zinc-200 dark:file:bg-zinc-700 file:text-zinc-800 dark:file:text-zinc-200 cursor-pointer"
          />
        </div>

        {/* PASSWORD INPUT */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-zinc-500">Master Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-3 py-2 border rounded-md bg-white dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-300 text-sm"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={() => handleClick()}
          className="w-full py-2 text-sm font-medium bg-black text-white rounded-md hover:bg-zinc-800 transition dark:bg-white dark:text-black"
        >
          Unlock
        </button>

        {/* ERROR */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Unlock;
