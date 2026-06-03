type StepCardProps = {
  number: string;
  title: React.ReactNode;
  description: string;
};

const StepCard = ({ number, title, description }: StepCardProps) => {
  return (
    <div className="border-2 transition-all duration-300 ease-in-out hover:border-accent/60 rounded-lg p-6 h-full flex-1 flex flex-col gap-2">
      <h2 className="text-3xl font-serif text-accent">{number}</h2>
      <h3 className="text-2xl font-serif">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

export default StepCard;
