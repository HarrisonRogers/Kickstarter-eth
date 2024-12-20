'use client';

import React from 'react';
import { Button, ButtonProps } from './button';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
type BackButtonProps = ButtonProps & {
  label?: string;
};

function BackButton({ label, ...props }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant="ghost"
      className={cn('mb-4', props.className)}
      {...props}
    >
      ← {label}
    </Button>
  );
}

export default BackButton;
