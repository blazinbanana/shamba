import { cn } from '@/lib/utils'

interface FarmerTractorIconProps {
  size?: number
  className?: string
}

export function FarmerTractorIcon({ size = 24, className }: FarmerTractorIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('inline-block shrink-0', className)}
      aria-hidden="true"
    >
      {/* Tractor Body & Cab */}
      <path d="M12 14V7h5v7" />
      <path d="M12 11H5v3h2" />
      <path d="M17 7h2" />
      
      {/* Exhaust & Details */}
      <path d="M7 11V6" />
      <path d="M7 6h2" />
      
      {/* Rear Wheel (Large) */}
      <circle cx="16" cy="15" r="5" />
      
      {/* Front Wheel (Small) */}
      <circle cx="6" cy="16" r="3" />
      
      {/* Steering Wheel/Driver Hint */}
      <path d="M15 10l-1.5 1.5" />
    </svg>
  )
}