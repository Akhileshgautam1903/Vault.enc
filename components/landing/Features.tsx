const Features = () => {
  return (
    <section>
      <h2 className="text-5xl font-serif mb-4">
        Key <span className="accent-text">Features</span>
      </h2>
      <div className="py-6 grid lg:grid-cols-3 gap-4">
        <div className="border border-zinc-800 rounded-xl h-60 lg:col-span-2 p-6 flex flex-col justify-end">
          <h3 className="text-2xl font-serif">
            Stays on your machine, <span className="accent-text">period.</span>
          </h3>
          <p className="text-sm max-w-md">
            No cloud. No sync. No sneaky background uploads. Your passwords live
            exactly where you put them.
          </p>
        </div>
        <div className="border border-zinc-800 rounded-xl h-60 p-4 flex flex-col justify-end">
          <h3 className="text-2xl font-serif">
            <span className="accent-text">Encrypted</span> &nbsp; so hard, even we
            can't read it.
          </h3>
          <p className="text-sm max-w-md">
            AES-256-GCM — the gold standard of encryption. Your data is
            mathematically protected.
          </p>
        </div>
        <div className="border border-zinc-800 rounded-xl h-60 p-4 flex flex-col justify-end">
          <h3 className="text-2xl font-serif">
            So <span className="accent-text">Simple,</span> your grandma can use
            it.
          </h3>
          <p className="text-sm max-w-md">
            No manuals. No tutorials. No technical degree. If you can type a
            password, you're already an expert.
          </p>
        </div>
        <div className="border border-zinc-800 rounded-xl h-60 lg:col-span-2 p-4 flex flex-col justify-end">
          <h3 className="text-2xl font-serif">
            Your <span className="accent-text">Vault,</span> your rules
          </h3>
          <p className="text-sm max-w-md">
            One file. Any device. No account. No lock-in. Carry it on a USB if
            you want. We don't care. It's yours.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
