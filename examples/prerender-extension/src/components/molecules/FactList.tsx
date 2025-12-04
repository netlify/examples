
interface Fact {
  label: string;
  value: string;
}

interface FactListProps {
  facts: Fact[];
  className?: string;
}

export const FactList = ({ facts, className = '' }: FactListProps) => {
  return (
    <dl className={`fact-list ${className}`}>
      {facts.map((fact, index) => (
        <div key={index} className="fact-item">
          <dt className="fact-label">{fact.label}</dt>
          <dd className="fact-value">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
};
