import React, { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface FarmerTractorIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  title?: string
}

export const FarmerTractorIcon = forwardRef<SVGSVGElement, FarmerTractorIconProps>(
  ({ size = 40, className, title = 'Farmer on Tractor', ...props }, ref) => {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={title}
        className={cn('inline-block shrink-0', className)}
        {...props}
      >
        {/* Render a title for screen readers and native browser tooltips */}
        {title && <title>{title}</title>}

        {/* Group 1: Tractor Body */}
        <g id="tractor-body">
          <rect x="60" y="120" width="6" height="28" rx="3" fill="#374151" />
          <rect x="36" y="140" width="150" height="48" rx="10" fill="#059669" />
          <rect x="36" y="140" width="150" height="20" rx="10" fill="white" opacity="0.06" />
          <rect x="16" y="150" width="64" height="38" rx="8" fill="#047857" />
          <circle cx="24" cy="168" r="4" fill="#facc15" />
        </g>

        {/* Group 2: Wheels */}
        <g id="wheels">
          {/* Rear Wheel */}
          <circle cx="180" cy="182" r="48" fill="#111827" />
          <circle cx="180" cy="182" r="36" fill="#1f2937" />
          <circle cx="180" cy="182" r="10" fill="#374151" />
          <circle cx="180" cy="182" r="36" stroke="white" strokeOpacity="0.06" strokeWidth="2" />

          {/* Front Wheel */}
          <circle cx="52" cy="204" r="26" fill="#111827" />
          <circle cx="52" cy="204" r="18" fill="#1f2937" />
          <circle cx="52" cy="204" r="6" fill="#374151" />
        </g>

        {/* Group 3: Cab & Steering */}
        <g id="cab-and-steering">
          {/* Seat frame connecting properly to the body */}
          <rect x="170" y="110" width="6" height="30" rx="3" fill="#374151" />
          <rect x="140" y="120" width="36" height="14" rx="5" fill="#065f46" />
          <circle cx="130" cy="118" r="12" stroke="#374151" strokeWidth="3" />
        </g>

        {/* Group 4: Mkulima  */}
        <g id="mkulima">
          {/* Torso & Neck */}
          <rect x="150" y="70" width="28" height="40" rx="8" fill="#059669" />
          <rect x="158" y="58" width="12" height="14" rx="4" fill="#78350f" />
          
          {/* Head & Face */}
          <circle cx="164" cy="44" r="16" fill="#92400e" />
          <circle cx="158" cy="44" r="1.8" fill="#1a0a00" />
          <circle cx="170" cy="44" r="1.8" fill="#1a0a00" />
          <path d="M158 52 Q164 56 170 52" stroke="#7c3404" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Hat */}
          <ellipse cx="164" cy="26" rx="24" ry="6" fill="#854d0e" />
          <rect x="146" y="10" width="36" height="18" rx="6" fill="#92400e" />
          <rect x="146" y="22" width="36" height="5" rx="2" fill="#059669" />
          
          {/* Arms & Hands */}
          <rect x="134" y="80" width="18" height="8" rx="4" fill="#78350f" />
          <rect x="178" y="80" width="14" height="8" rx="4" fill="#78350f" />
          <circle cx="130" cy="112" r="5" fill="#92400e" />
        </g>
      </svg>
    )
  }
)

FarmerTractorIcon.displayName = 'FarmerTractorIcon'