// src/components/Spinner.tsx

  type Props = {
  size?: 'sm' | 'md' | 'lg'
}

export default function Spinner({ size = 'md' }: Props) {
  const sizeClasses =
    size === 'sm'
      ? 'w-4 h-4'
      : size === 'lg'
      ? 'w-10 h-10'
      : 'w-6 h-6' // default 'md'
  return (
    <div
       className={`rounded-full border-4 border-teal-500 border-t-transparent animate-spin ${sizeClasses}`}
    />
      
  )
}
