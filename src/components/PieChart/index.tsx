import { useAccounts } from '@/data/hooks'
import { TableRowItem } from '@/types/item.type'
import * as d3 from 'd3'
import { useEffect, useMemo, useRef } from 'react'

export const PieChart = (props: {
  sectionId: string
  tableRowItems: TableRowItem[]
}) => {
  const { tableRowItems, sectionId } = props
  const ref = useRef<SVGSVGElement>(null)

  const { data: accounts } = useAccounts(sectionId)

  const data = useMemo(() => {
    if (tableRowItems.some(item => item.evaluatedPrice === null)) {
      return null
    }

    const totalPrice = tableRowItems.reduce((acc, item) => acc + item.totalPrice, 0)
    const totalPricePerAccount = tableRowItems.reduce<{ value: number, label: string }[]>((acc, item) => {
      const account = accounts?.assets?.find(a => a.account_id === item.accountId)
      if (!account) return acc

      const idx = acc.findIndex(a => a.label === account.title)
      if (idx === -1) {
        return [
          ...acc,
          { value: item.totalPrice, label: account.title }
        ]
      }

      const found = acc[idx]
      if (!found?.value) {
        console.log(found)
      }
      return [
        ...acc.slice(0, idx),
        { ...found, value: found.value + item.totalPrice },
        ...acc.slice(idx + 1),
      ]
    }, [] as { value: number, label: string }[])

    return totalPricePerAccount.map(item => ({
      ...item,
      value: (item.value / totalPrice * 100).toFixed(2),
    }))

  }, [tableRowItems, accounts])

  useEffect(() => {
    if (!ref.current) return

    // set the dimensions and margins of the graph
    // const data = [10, 20, 30, 40, 50]
    // const data = [
    //   {value: 10, label: 'AAA'},
    //   {value: 20, label: 'BBB'},
    //   {value: 30, label: 'CCC'},
    //   {value: 40, label: 'DDD'},
    //   {value: 50, label: 'EEE'},
    // ]
    const width = 960
    const height = 320
    const radius = Math.min(width, height) / 2

    // const data = [53245, 28479, 19697, 24037, 40245] // example

    // const color = d3.scale.category20()
    const color = d3.scaleOrdinal(d3.schemeCategory10)
    const pie = d3.pie()
      .value((d: any) => d.value)
      .sort(null)
    // const piedata = pie(dataset.apples)
    const piedata = pie(data as any)

    const arc = d3.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 50)

    const svg = d3
      .select(ref.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")

    const path = svg.selectAll("path")
      .data(piedata)
      .enter()
      .append("path")
      .attr("fill", (_d, i) => color(`${i}`))
      .attr("d", arc as any)

    svg.selectAll("text").data(piedata)
      .enter()
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", function(d: any) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2
        d.cx = Math.cos(a) * (radius - 75)
        return d.x = Math.cos(a) * (radius - 20)
      })
      .attr("y", function(d: any) {
        var a = d.startAngle + (d.endAngle - d.startAngle)/2 - Math.PI/2
        d.cy = Math.sin(a) * (radius - 75)
        return d.y = Math.sin(a) * (radius - 20)
      })
      .text(function(d: any) { return `${d.data.label} (${d.data.value}%)` })
      .each(function(d: any) {
        var bbox = this.getBBox()
        d.sx = d.x - bbox.width/2 - 2
        d.ox = d.x + bbox.width/2 + 2
        d.sy = d.oy = d.y + 5
      })


    svg.append("defs").append("marker")
      .attr("id", "circ")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("refX", 3)
      .attr("refY", 3)
      .append("circle")
      .attr("cx", 3)
      .attr("cy", 3)
      .attr("r", 3)

    svg.selectAll("path.pointer").data(piedata).enter()
      .append("path")
      .attr("class", "pointer")
      .style("fill", "none")
      .style("stroke", "black")
      .attr("marker-end", "url(#circ)")
      .attr("d", function(d: any) {
        if(d.cx > d.ox) {
          return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy
        } else {
          return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy
        }
      })

    return () => {
      svg.remove()
    }
  }, [data])

  if (!data) {
    return null
  }

  return (
    <div className='flex justify-center w-full'>
      <div>
        <svg ref={ref} />
      </div>
    </div>
  )
}

// https://www.tutorialsteacher.com/d3js/create-pie-chart-using-d3js
// https://gist.github.com/dbuezas/9572040
// https://flamingotiger.github.io/frontend/d3/d3-piechart/
