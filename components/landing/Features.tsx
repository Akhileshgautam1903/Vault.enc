import {
  Feather,
  FileLock,
  LaptopMinimalCheck,
  ShieldCheck,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      key: "feature-1",
      icon: <ShieldCheck className="size-10 lg:size-14 text-accent mt-4" />,
      title: (
        <>
          <span className="accent-text">Locked</span> &nbsp; so hard, even we
          can't read it.
        </>
      ),
      content:
        "AES-256-GCM — the gold standard of encryption. Your data is mathematically protected.",
    },
    {
      key: "feature-2",
      icon: (
        <LaptopMinimalCheck className="size-10 lg:size-14 text-accent mt-4" />
      ),
      title: (
        <>
          Stays on your machine, <span className="accent-text">period.</span>
        </>
      ),
      content:
        "No cloud. No sneaky background uploads. Your passwords live exactly where you put them.",
    },
    {
      key: "feature-3",
      icon: <FileLock className="size-10 lg:size-14 text-accent mt-4" />,
      title: (
        <>
          Your <span className="accent-text">Vault,</span> your rules.
        </>
      ),
      content: "One file. Any device. No account. No lock-in. It's yours.",
    },
    {
      key: "feature-4",
      icon: <Feather className="size-10 lg:size-14 text-accent mt-4" />,
      title: (
        <>
          So <span className="accent-text">Simple,</span> your grandma can use
          it.
        </>
      ),
      content:
        "No manuals. No tutorials. No technical degree. If you can type a password, you're already an expert.",
    },
  ];

  return (
    <section>
      <h2 className="text-5xl font-serif mb-4">
        Key <span className="accent-text">Features</span>
      </h2>
      <div className="py-6 grid lg:grid-cols-3 gap-4">
        {features.map((feature, index) => (
          <div
            key={feature.key}
            className={
              "relative overflow-hidden border border-zinc-800 rounded-xl h-60 p-4 flex flex-col justify-between " +
              (index === 0 || index === 3 ? "lg:col-span-2" : "")
            }
          >
            <div
              className={`absolute -z-10 top-0 h-96 w-96 rounded-full bg-accent/50 blur-3xl ${
                index === 1 || index === 2
                  ? "-right-30 lg:-right-50"
                  : "-right-30"
              }`}
            />
            {feature.icon}
            <div>
              <h3 className="text-2xl font-serif">{feature.title}</h3>
              <p className="text-sm max-w-md">{feature.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
