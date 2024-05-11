import { ReactNode } from 'react'

export const GridCard = (props: {
  children: ReactNode
}) => {
  const { children } = props
  return (
    <div className="bg-card p-4">
      {children}
    </div>
  )
}
