import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  `
    inline-flex shrink-0 cursor-pointer items-center justify-center gap-2
    rounded-md text-small font-semibold whitespace-nowrap
    transition-[color,background-color,border-color,box-shadow,transform]
    duration-200 outline-none
    focus-visible:border-ring focus-visible:ring-[3px]
    focus-visible:ring-ring/35
    active:translate-y-px
    disabled:pointer-events-none disabled:opacity-50
    aria-invalid:border-destructive aria-invalid:ring-destructive/20
    dark:aria-invalid:ring-destructive/40
    [&_svg]:shrink-0
    [&_svg:not([class*="size-"])]:size-4
  `,
  {
    variants: {
      variant: {
        default:
          `
            bg-primary text-primary-foreground shadow-sm
            hover:bg-primary/90 hover:shadow-md
          `,
        destructive:
          `
            bg-destructive text-white
            hover:bg-destructive/90
            focus-visible:ring-destructive/20
            dark:bg-destructive/60
            dark:focus-visible:ring-destructive/40
          `,
        outline:
          `
            border border-input bg-background/40 shadow-none
            hover:bg-muted hover:text-foreground
          `,
        secondary:
          `
            bg-secondary text-secondary-foreground shadow-sm
            hover:bg-secondary/90 hover:shadow-md
          `,
        ghost:
          'hover:bg-muted hover:text-foreground',
        link: `
          text-primary underline-offset-4
          hover:underline
        `,
      },
      size: {
        'default': `
          h-11 px-4 py-2
          has-[>svg]:px-3.5
        `,
        'sm': `
          h-11 gap-1.5 rounded-md px-3
          has-[>svg]:px-2.5
        `,
        'lg': `
          h-12 rounded-md px-6
          has-[>svg]:px-4.5
        `,
        'icon': 'size-11',
        'icon-sm': 'size-11',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);
