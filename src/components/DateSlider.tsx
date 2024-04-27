"use client"

import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { currentDateAtom, endDateAtom, startDateAtom } from "@/states/date.state"
import { useAtom } from "jotai"
import { dateSum } from "@/utils/date.util"

type SliderProps = React.ComponentProps<typeof Slider>

export function DateSlider({ className, ...props }: SliderProps) {
  const [from] = useAtom(startDateAtom)
  const [to] = useAtom(endDateAtom)
  const [currentDate, setCurrentDate] = useAtom(currentDateAtom)

  // 0일 때 from. 하루에 1씩 to 까지 증가
  const max = Math.floor((to.getTime() - from.getTime()) / 86400000) // 86,400,000은 1d

  const handleChange = (v: number[]) => {
    setCurrentDate(dateSum(from, v[0] + 1))
  }

  return (
    <div>
      <div>{currentDate.toISOString()}</div>
      <Slider
        defaultValue={[max]}
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
