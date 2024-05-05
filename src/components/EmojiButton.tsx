export const EmojiButton = (props: {
  emoji: string
  onClick: () => void
  disabled?: boolean
}) => {
  const { emoji, onClick, disabled } = props
  return (
    <button
      onClick={onClick}
      className={`${disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
    >
      {emoji}
    </button>
  )
}
