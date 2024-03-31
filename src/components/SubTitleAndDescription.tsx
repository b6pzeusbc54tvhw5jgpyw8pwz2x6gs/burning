
export const SubTitleAndDescription = (props: {
  title: string
  description: string
}) => {
  const { title, description } = props

  return (
    <div>
      <h3 className={"scroll-m-20 text-2xl font-semibold tracking-tight / mb-1"}>
        {title}
      </h3>

      <p className="text-sm text-muted-foreground / mb-3">
        {description}
      </p>
    </div>
  )
}
