// Copyright 2026 Caleb Maina
import { cn } from '@/lib/utils'

interface FarmerTractorIconProps {
  size?: number
  className?: string
}

export function FarmerTractorIcon({ size = 120, className }: FarmerTractorIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('inline-block shrink-0', className)}
      aria-hidden="true"
    >
      {/* ground shadow */}
      <ellipse cx="128" cy="235" rx="110" ry="10" className="fill-slate-200 dark:fill-slate-800/50" />

      {/* rear wheel*/}
      <circle cx="180" cy="182" r="48" className="fill-slate-900 dark:fill-slate-950" />
      <circle cx="180" cy="182" r="36" className="fill-slate-800 dark:fill-slate-800" />
      <circle cx="180" cy="182" r="10" className="fill-slate-500" />
      <circle cx="180" cy="182" r="36" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" />

      {/* front wheel */}
      <circle cx="52" cy="196" r="26" className="fill-slate-900 dark:fill-slate-950" />
      <circle cx="52" cy="196" r="18" className="fill-slate-800 dark:fill-slate-800" />
      <circle cx="52" cy="196" r="6" className="fill-slate-500" />

      {/* tractor body */}
      <rect x="36" y="140" width="150" height="48" rx="8" className="fill-emerald-600 dark:fill-emerald-500" />
      {/* top highlight */}
      <rect x="36" y="140" width="150" height="8" rx="4" fill="white" opacity="0.15" />
      
      {/* engine hood */}
      <rect x="16" y="150" width="64" height="38" rx="6" className="fill-emerald-700 dark:fill-emerald-600" />
      <circle cx="24" cy="168" r="5" className="fill-yellow-400" /> {/* Headlight */}
      
      {/* exhaust */}
      <rect x="58" y="100" width="8" height="48" rx="4" className="fill-slate-600 dark:fill-slate-400" />

      {/* seat */}
      <rect x="140" y="125" width="36" height="15" rx="4" className="fill-slate-800 dark:fill-slate-700" />
      <path d="M125 118 L140 140" stroke="currentColor" strokeOpacity="0.6" strokeWidth="4" strokeLinecap="round" />
      <circle cx="120" cy="115" r="10" stroke="currentColor" strokeOpacity="0.8" strokeWidth="4" />

      {/* mkulima bomba*/}
      {/* torso */}
      <rect x="148" y="75" width="32" height="40" rx="8" className="fill-emerald-500 dark:fill-emerald-400" />
      {/* neck */}
      <rect x="158" y="60" width="12" height="20" rx="4" className="fill-amber-800 dark:fill-amber-700" />
      {/* head*/}
      <circle cx="164" cy="48" r="16" className="fill-amber-700 dark:fill-amber-600" />
      
      {/* hat*/}
      <ellipse cx="164" cy="30" rx="26" ry="6" className="fill-yellow-800 dark:fill-yellow-700" />
      <path d="M144 30 Q164 5 184 30" className="fill-yellow-700 dark:fill-yellow-600" />

      {/* arm connecting to steering */}
      <path d="M150 85 Q130 95 125 110" stroke="currentColor" strokeOpacity="0.8" strokeWidth="8" strokeLinecap="round" className="text-amber-800 dark:text-amber-700" fill="none" />
    </svg>
  )
}