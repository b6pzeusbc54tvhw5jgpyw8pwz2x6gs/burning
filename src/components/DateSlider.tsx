"use client"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { currentDateAtom, endDateAtom, startDateAtom } from "@/states/date.state"
import { useAtom } from "jotai"
import { dateSum } from "@/utils/date.util"
import dayjs from "dayjs"

type SliderProps = React.ComponentProps<typeof Slider>

export function DateSlider({ className, ...props }: SliderProps) {
  const [from] = useAtom(startDateAtom)
  const [to] = useAtom(endDateAtom)
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom)

  // 0일 때 from. 하루에 1씩 to 까지 증가
  const max = Math.floor((to.getTime() - from.getTime()) / 86_400_000) // 86,400,000은 1d
  const value = Math.floor((currentDate - from.getTime()) / 86_400_000)

  const handleChange = (v: number[]) => {
    const updated = dateSum(from, v[0])
    setCurrentDate(updated.getTime())
  }

  return (
    <div>
      <div>{dayjs(currentDate).format('YYYY-MM-DD')}</div>
      <Slider
        defaultValue={[max]}
        value={[value]}
        max={max}
        step={1}
        className={cn("w-[60%]", className)}
        onValueChange={handleChange}
        // onValueCommit={v => console.log(v)}
        {...props}
      />
    </div>
  )
}
