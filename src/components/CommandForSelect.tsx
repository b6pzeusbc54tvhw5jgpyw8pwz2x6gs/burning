'use client'

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useEffect, useRef } from "react"
import { Checkbox } from "@/components/ui/checkbox"

interface Item {
  value: string
  label: string
}

export function CommandForSelect(props: {
  placeHolder?: string
  className?: string
  handleClose: () => void
  handleSelect: (accountId: string) => void
  multi?: boolean
  items: Item[]
  selectedItems?: string[]
}) {
  const { items, placeHolder, handleClose, handleSelect, selectedItems = [], multi = false } = props

  const localHandleSelect = (accountId: string) => {
    handleSelect(accountId)
    if (!multi) {
      handleClose()
    }
  }

  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClick = (e: any) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        handleClose()
      }
    }
    const timer = setTimeout(() => {
      window.addEventListener('click', handleClick)
    }, 200)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('click', handleClick)
    }
  }, [handleClose])

  return (
    <div className="w-full absolute z-50">
      <Command ref={listRef}>
        <CommandInput
          ref={inputRef}
          placeholder={placeHolder || "Type a command or search..."}
          onClick={handleClose}
        />
        <CommandList ref={listRef}>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="수익">
            {items.map(account => (
              <CommandItem
                key={account.value}
                onSelect={() => localHandleSelect(account.value)}
              >
                {multi && <Checkbox checked={selectedItems.includes(account.value)} />}
                <span className="ml-2">{account.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}
