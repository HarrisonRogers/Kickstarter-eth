import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type LinkProps = React.ComponentPropsWithoutRef<typeof Link>

function LinkComponent({ className, ...props }: LinkProps) {
  return (
    <Link
      className={cn(
        'mt-4 text-center underline underline-offset-2 hover:no-underline active:scale-95 transition-transform duration-150 ease-in-out',
        className
      )}
      {...props}
    />
  )
}

export default LinkComponent
