import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const items = [
    {
      value: "faq-1",
      trigger: "Where are my passwords actually stored?",
      content: (
        <>
          <p>On your machine. Nowhere else.</p>
          <p className="text-zinc-400 mt-2">
            We generate an encrypted .enc file that lives on your device. No
            servers. No databases. No copies on our end. Ever.
          </p>
        </>
      ),
    },
    {
      value: "faq-2",
      trigger: "Can anyone — including you — see my passwords?",
      content: (
        <>
          <p>No. Not us. Not your network. Nobody.</p>
          <p className="text-zinc-400 mt-2">
            Your passwords are encrypted before anything happens. We don't have
            servers to store them on even if we wanted to.
          </p>
        </>
      ),
    },
    {
      value: "faq-3",
      trigger: "What if I forget my master password?",
      content: (
        <>
          <p>We can't help you. And that's by design.</p>
          <p className="text-zinc-400 mt-2">
            Your master password is never stored anywhere — not on our servers,
            not on your device, nowhere. That's exactly what makes it secure.
            Write it down somewhere safe. Seriously.
          </p>
        </>
      ),
    },
    {
      value: "faq-4",
      trigger: "What is a .enc file?",
      content: (
        <>
          <p>It's your vault.</p>
          <p className="text-zinc-400 mt-2">
            One encrypted file that lives on your device. To open it, visit
            VAULT.enc, upload the file and enter your master password. That's
            it. No account. No login.
          </p>
        </>
      ),
    },
    {
      value: "faq-5",
      trigger: "How safe is this, really?",
      content: (
        <>
          <p>Very.</p>
          <p className="text-zinc-400 mt-2">
            We use AES-256-GCM — the same encryption standard used by banks and
            governments. And since nothing leaves your machine, there's no
            server to hack in the first place.
          </p>
        </>
      ),
    },
    {
      value: "faq-6",
      trigger: "Do I need internet to access my vault?",
      content: (
        <>
          <p>Yes — you need the site to decrypt your vault.</p>
          <p className="text-zinc-400 mt-2">
            But here's the important part: your actual data never travels over
            the internet. Decryption happens entirely in your browser.
          </p>
        </>
      ),
    },
  ];

  return (
    <section>
      <h2 className="text-5xl font-serif mb-4">
        Frequently Asked <span className="accent-text">Questions.</span>
      </h2>
      <Accordion
        type="multiple"
        defaultValue={["faq-1"]}
        className="max-w-6xl"
      >
        {items.map((item) => (
          <AccordionItem key={item.value} value={item.value}>
            <AccordionTrigger className="font-serif text-xl">
              {item.trigger}
            </AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
