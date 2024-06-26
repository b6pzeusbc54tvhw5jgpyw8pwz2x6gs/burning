import * as React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const WhooingStyleSelect = (props: {
  title: string
  options: string[]
  now?: string
  value: string | null
  setValue: (value: string) => void
}) => {
  const { title, options, now, value, setValue } = props
  const [open, setOpen] = useState(false)
  const selectedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    selectedRef.current?.scrollIntoView({ block: "center" })
  }, [open, value])

  const isCenter = (option: string | null) => {
    if (value) {
      return value === option
    }

    return now === option
  }

  return (
    <div
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div
        className={cn("w-[92px] relative text-xs py-3 text-center bg-card",
          value && "bg-background"
        )}
      >
        {value ? value : title}
      </div>
      {open && (
        <div
          className="absolute w-[92px] z-10 max-h-48 overflow-y-scroll mt-[1px]"
          style={{
            display: open ? "block" : "none",
            boxShadow: '0 1px 6px 1px rgba(0,0,0,.78)',
          }}
        >
          {options.map(option => (
            <div
              className={cn(
                "w-full border-b-2 border-border bg-card text-center py-2 text-xs cursor-pointer",
                option === value && "border-l-2 border-l-accent-foreground",
                option === now && "text-red-500",
              )}
              ref={isCenter(option) ? selectedRef : null}
              onClick={() => {
                setValue(option)
                setOpen(false)
              }}
              key={option}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
