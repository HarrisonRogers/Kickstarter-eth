import { cn } from '@/lib/utils'

export type ContainerVariantProps = {
  contentWidth: 'constrained' | 'large' | 'full'
}

export default function containerVariants({
  contentWidth,
}: ContainerVariantProps) {
  return cn(
    'z-10',
    'mx-auto w-full mt-20 whitespace-pre-wrap break-words [word-break:break-word]',
    {
      'lg:max-w-screen-lg': contentWidth === 'constrained',
      'lg:max-w-screen-xl': contentWidth === 'large',
    },
    'flex flex-col items-start',
    'p-2 md:p-3 lg:p-4'
  )
}
