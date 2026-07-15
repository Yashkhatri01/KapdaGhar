type CardProps = {
  children: React.ReactNode;
  className?: string;
};

function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-4 ${className}`}>
      {children}
    </div>
  );
}

export default Card;