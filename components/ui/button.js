import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva('ui-button', {
  variants: {
    variant: {
      default: 'ui-button--default',
      secondary: 'ui-button--secondary',
      destructive: 'ui-button--destructive',
      ghost: 'ui-button--ghost',
      link: 'ui-button--link',
    },
    size: {
      default: 'ui-button--size-default',
      sm: 'ui-button--size-sm',
      lg: 'ui-button--size-lg',
      icon: 'ui-button--size-icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export function Button({ className, variant, size, type = 'button', ...props }) {
  return <button type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
