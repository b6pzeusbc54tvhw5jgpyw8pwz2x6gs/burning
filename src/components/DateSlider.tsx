"use client"

import { useAtom } from "jotai"
import dayjs from "dayjs"
import { useSize } from 'ahooks'
import { useRef } from "react"
import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { currentDateAtom, endDateAtom, startDateAtom } from "@/states/date.state"
import { dateSum } from "@/utils/date.util"

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

  const ref = useRef(null)
  const size = useSize(ref)

  const sliderHandleWidth = 16
  const tooltipTrackWidth = size ? size.width - sliderHandleWidth : 0
  const offsetX = size
    ? (value / max) * tooltipTrackWidth - 50
    : undefined

  return (
    <div className="w-full mt-4">
      <div className="flex flex-col items-center">
        <div
          className="flex"
          style={{width: size ? tooltipTrackWidth : undefined}}
        >
          <div
            className={`text-sm p-2 bg-primary text-secondary w-[100px] text-center rounded-sm`}
            style={{
              transform: size ? `translateX(${offsetX}px)` : undefined,
            }}
          >
            {dayjs(currentDate).format('YYYY-MM-DD')}
          </div>
        </div>
      </div>
      <div className="flex justify-center py-4">
        <Slider
          ref={ref}
          defaultValue={[max]}
          value={[value]}
          max={max}
          step={1}
          className={cn("w-[90%]", className)}
          onValueChange={handleChange}
          {...props}
        />
      </div>
    </div>
  )
}
