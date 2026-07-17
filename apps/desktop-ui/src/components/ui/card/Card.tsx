import type { ReactNode } from "react";
import clsx from "clsx";

type CardProps = {
  children: ReactNode;
  className?: string;
};

function Card({
  children,
  className,
}: CardProps) {

  return (

    <div
      className={clsx(
        "rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >

      {children}

    </div>

  );

}

export default Card;