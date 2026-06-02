import { MoveDown, MoveRight } from "lucide-react";
import StepCard from "./StepCard";

const HowItWorks = () => {
  return (
    <section>
      <h2 className="text-5xl font-serif mb-6">
        How it <span className="accent-text">Works...</span>
      </h2>
      <div className="flex flex-col lg:flex-row justify-between lg:items-stretch h-50 gap-4">
        <StepCard
          number="01"
          title="Create your master password."
          description="One password to rule them all. Pick something strong — we'll never store it. Not even us."
        />
        <div className="flex items-center self-center">
          <MoveRight className="hidden lg:block text-accent" />
          <MoveDown className="block lg:hidden text-accent" />
        </div>
        <StepCard
          number="02"
          title="Add your passwords."
          description="Like writing in a secret diary, but this one doesn't fit under your mattress. Add as many as you need."
        />
        <div className="flex items-center self-center">
          <MoveRight className="hidden lg:block text-accent" />
          <MoveDown className="block lg:hidden text-accent" />
        </div>
        <StepCard
          number="03"
          title="Lock and export."
          description="One click. One encrypted file. Yours to keep, yours to carry. Even we don't get a copy."
        />
      </div>
    </section>
  );
};

export default HowItWorks;
