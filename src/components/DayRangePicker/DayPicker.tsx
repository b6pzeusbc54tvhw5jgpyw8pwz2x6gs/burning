import dayjs from "dayjs"
import { toast } from "react-toastify"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

export const DayPicker = (props: {
  date: Date
  setDate: (date: Date) => void
  checkAndGetInvalidMessage: (date: Date) => string | null
}) => {
  const { date, setDate, checkAndGetInvalidMessage } = props
  const handleSelect = (date?: Date) => {
    if (!date) return

    const msg = checkAndGetInvalidMessage(date)
    if (msg) {
      toast.error("날짜를 선택할 수 없습니다.")
      return
    }
    setDate(date)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Input
          value={dayjs(date).format("YYYY-MM-DD")}
          className="w-24 px-2"
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
