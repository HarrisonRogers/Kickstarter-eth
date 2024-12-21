import React from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type BackButtonProps = ButtonProps & {
  label?: string;
  href: string;
};

function BackButton({ label, href, ...props }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button
        variant="ghost"
        className={cn('mb-4', props.className)}
        {...props}
      >
        ← {label}
      </Button>
    </Link>
  );
}

export default BackButton;
