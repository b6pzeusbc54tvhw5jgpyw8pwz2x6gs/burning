import dayjs from "dayjs"
import { toast } from "react-toastify"
import { Popover, PopoverTrigger, PopoverContent } from "@radix-ui/react-popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { useAtom } from "jotai"
import { monthAtom, quarterAtom, recentAtom, yearAtom } from "@/states/date.state"

export const DayPicker = (props: {
  date: Date
  setDate: (date: Date) => void
  checkAndGetInvalidMessage: (date: Date) => string | null
}) => {
  const { date, setDate, checkAndGetInvalidMessage } = props

  const [year, setYear] = useAtom(yearAtom)
  const [quarter, setQuarter] = useAtom(quarterAtom)
  const [month, setMonth] = useAtom(monthAtom)
  const [recent, setRecent] = useAtom(recentAtom)

  const handleSelect = (updatedDate?: Date) => {
    if (!updatedDate) return

    const msg = checkAndGetInvalidMessage(updatedDate)
    if (msg) {
      toast.error("날짜를 선택할 수 없습니다.")
      return
    }

    if (date.getTime() !== updatedDate.getTime()) {
      setDate(updatedDate)
      setYear(null)
      setQuarter(null)
      setMonth(null)
      setRecent(null)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div>
          <Input
            value={dayjs(date).format("YYYY-MM-DD")}
            className="w-28 p-0 text-center"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 z-300 bg-card"
        align="start"
        style={{
          boxShadow: '0 1px 6px 1px rgba(0,0,0,.78)',
        }}
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>

  // <Popover>
  //   <PopoverTrigger asChild>
  //     <Button variant="outline">Open popover</Button>
  //   </PopoverTrigger>
  //   <PopoverContent className="w-80 bg-card z-300 p-3">
  //     <div className="grid gap-4">
  //       <div className="space-y-2">
  //         <h4 className="font-medium leading-none">Dimensions</h4>
  //         <p className="text-sm text-muted-foreground">
  //     Set the dimensions for the layer.
  //         </p>
  //       </div>
  //       <div className="grid gap-2">
  //         <div className="grid grid-cols-3 items-center gap-4">
  //           <Label htmlFor="width">Width</Label>
  //           <Input
  //             id="width"
  //             defaultValue="100%"
  //             className="col-span-2 h-8"
  //           />
  //         </div>
  //         <div className="grid grid-cols-3 items-center gap-4">
  //           <Label htmlFor="maxWidth">Max. width</Label>
  //           <Input
  //             id="maxWidth"
  //             defaultValue="300px"
  //             className="col-span-2 h-8"
  //           />
  //         </div>
  //         <div className="grid grid-cols-3 items-center gap-4">
  //           <Label htmlFor="height">Height</Label>
  //           <Input
  //             id="height"
  //             defaultValue="25px"
  //             className="col-span-2 h-8"
  //           />
  //         </div>
  //         <div className="grid grid-cols-3 items-center gap-4">
  //           <Label htmlFor="maxHeight">Max. height</Label>
  //           <Input
  //             id="maxHeight"
  //             defaultValue="none"
  //             className="col-span-2 h-8"
  //           />
  //         </div>
  //       </div>
  //     </div>
  //   </PopoverContent>
  // </Popover>


  )
}
