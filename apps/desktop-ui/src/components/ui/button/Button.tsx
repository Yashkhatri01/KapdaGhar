import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import clsx from "clsx";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    loading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
  };

const variantClasses: Record<
  ButtonVariant,
  string
> = {
  primary: `
  bg-blue-600
  text-white

  hover:bg-blue-700

  shadow-blue-200
`,

  secondary:
    `
    bg-gray-100
    text-gray-800

    hover:bg-gray-200
    shadow-gray-200
    `,

  danger:
    `
    bg-red-600
    text-white

    hover:bg-red-700
    shadow-red-200
    `,

  outline:
    `
    border
    border-gray-300

    bg-white
    text-gray-700

    hover:bg-gray-50
    `,
};

function Button({

  children,

  variant = "primary",

  loading = false,

  disabled,

  leftIcon,

  rightIcon,

  className,

  ...props

}: ButtonProps) {

  return (

    <button

      {...props}

      disabled={disabled || loading}

      className={clsx(

        `
        group
        relative
        overflow-hidden

        inline-flex
        items-center
        justify-center
        gap-2

        rounded-xl

        px-4
        py-2.5

        text-sm
        font-semibold

        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:shadow-xl

        active:translate-y-0
        active:scale-[0.97]

        disabled:opacity-50
        disabled:pointer-events-none
        `,

        variantClasses[variant],

        className

      )}

    >

      {/* Glass Reflection */}

      <span
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
          rounded-xl
        "
      >
        <span
          className="
            absolute
            top-0
            -left-[140%]

            h-full
            w-14

            rotate-12

            bg-white/25
            blur-sm

            transition-all
            duration-700

            group-hover:left-[160%]
          "
        />
      </span>

      {/* Content */}

      <span
        className="
          relative
          z-10

          inline-flex
          items-center
          gap-2
        "
      >

        {loading ? (

          "Saving..."

        ) : (

          <>

            {leftIcon}

            {children}

            {rightIcon}

          </>

        )}

      </span>

    </button>

  );

}

export default Button;