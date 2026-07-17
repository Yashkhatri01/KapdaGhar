import {
  useState,
  type ReactNode,
} from "react";

type TooltipProps = {
  children: ReactNode;
  title: string;
  subtitle?: string;
};

function Tooltip({
  children,
  title,
  subtitle,
}: TooltipProps) {

  const [visible, setVisible] =
    useState(false);

  const [position, setPosition] =
    useState({
      x: 0,
      y: 0,
    });

  return (

    <>

      <div

        onMouseEnter={() =>
          setVisible(true)
        }

        onMouseLeave={() =>
          setVisible(false)
        }

        onMouseMove={(e) =>

          setPosition({

            x: e.clientX + 18,

            y: e.clientY + 18,

          })

        }

      >

        {children}

      </div>

      {visible && (

        <div

          style={{

            position: "fixed",

            left: position.x,

            top: position.y,

          }}

          className="
            pointer-events-none
            z-[9999]

            rounded-xl

            bg-gray-900

            px-3
            py-2.5

            shadow-xl

            animate-in
            fade-in
            zoom-in-95

            duration-150
          "

        >

          <p className="text-sm font-semibold text-white">

            {title}

          </p>

          {subtitle && (

            <p className="text-[11px] text-gray-300 mt-0.5">

              {subtitle}

            </p>

          )}

        </div>

      )}

    </>

  );

}

export default Tooltip;