import * as d3 from 'd3'
import { useEffect, useRef } from 'react'

export const PieChart = () => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // set the dimensions and margins of the graph
    // const data = [10, 20, 30, 40, 50]
    const data = [
      {value: 10, label: 'AAA'},
      {value: 20, label: 'BBB'},
      {value: 30, label: 'CCC'},
      {value: 40, label: 'DDD'},
      {value: 50, label: 'EEE'},
    ]
    const width = 640
    const height = 640

    const currentEl = ref.current
    const svg = d3
      .select(currentEl)
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    svg.append('text')
      .attr('x', 200)
      .attr('y', 200)
      .text('hello world')

    return () => {
      svg.remove()
      // d3.select(currentEl).selectAll('svg').remove()
    }
  }, [])

  return <div className="mysvg" ref={ref}></div>
}
