import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-5xl font-serif font-black">
          Vault.<span className="italic font-extralight">enc</span>
        </h1>
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h2 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            All in one place for your passwords
          </h2>
          <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            <ul>
              <li>Keep you password safe and in one place</li>
              <li>Your password never leaves ur system</li>
              <li>Export a .enc file after you finish adding ur password</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <Link
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-39.5"
            href="/setup"
          >
            Start Fresh
          </Link>
          <Link
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="/unlock"
          >
            Upload .enc file
          </Link>
        </div>
      </main>
    </div>
  );
}
