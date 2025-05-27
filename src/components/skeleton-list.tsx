import { Skeleton } from "./ui/skeleton"

interface SkeletonListProps {
  count?: number
  className?: string
}

export function SkeletonList({ count = 4, className = "h-24 w-full animate-pulse rounded-3xl" }: SkeletonListProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <Skeleton key={idx} className={className} />
      ))}
    </>
  )
}
