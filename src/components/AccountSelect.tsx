import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react"

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
import { useAccounts } from "@/data/hooks"
import { useEffect, useRef } from "react"

export function AccountSelect(props: {
  sectionId: string
  className?: string
  opened: boolean
  handleClose: () => void
  handleSelect: (accountId: string) => void
}) {
  const { sectionId, opened, handleClose, handleSelect } = props

  const { data: accounts} = useAccounts(sectionId)
  const income = accounts?.income

  const ref = useRef<HTMLInputElement>(null)

  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <Command>
      <CommandInput ref={ref} placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="수익">
          {income?.map(account => (
            <CommandItem
              key={account.account_id}
              onSelect={() => {
                handleSelect(account.account_id)
                handleClose()
              }}
            >
              <span>{account.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
