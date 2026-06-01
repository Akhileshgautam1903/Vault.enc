type StepCardProps = {
  number: string,
  title: string,
  description: string
}

const StepCard = ({number, title, description}: StepCardProps) => {

  return (
    <div className="border-2 border-accent/60 rounded-lg p-6 h-full flex flex-col">
      <h2 className="text-3xl font-serif text-accent">{number}</h2>
      <h3 className="text-2xl font-serif">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  )
}

export default StepCard