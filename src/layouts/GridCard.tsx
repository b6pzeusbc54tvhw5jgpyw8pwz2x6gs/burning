import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export const GridCard = (props: {
  title?: string
  className?: string
  children: ReactNode
}) => {
  const { title, className, children } = props
  return (
    <div className={cn(className, "flex bg-card p-4")}>
      {title && (
        <h2 className="text-lg font-bold mb-4">{title}</h2>
      )}
      {children}
    </div>
  )
}
