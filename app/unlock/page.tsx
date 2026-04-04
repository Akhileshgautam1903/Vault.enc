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

  const handleClick = async() => {
    const res = await fetch("/api/unlock", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({masterPassword: password, fileContents})
    });

    if(res.ok){
      //set entries and masterPassword in context 
      const {data} = await res.json();

      //Populated the vaultContext
      setEntries(data);
      setMasterPassword(password);

      //redirect to /vault
      router.push('/vault');
    }else
      setError("Incorrect Master Password");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => setFileContents(e.target?.result as string);
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black gap-4">
      <h1 className="text-5xl">Unlock page</h1>
      <input type="file" accept=".enc" onChange={(e) => handleFileChange(e)}/>
      <input
        type="password"
        className="border-zinc-600 border-2 outline-0 rounded-md py-1.5 px-2.5"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
};

export default Unlock;
