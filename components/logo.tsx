export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Decorative SVG Lines */}
      <svg
        className="absolute top-1/2 -left-8 -translate-y-1/2 opacity-30"
        width="24"
        height="32"
        viewBox="0 0 24 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 2C8 8 16 12 22 18C16 22 8 26 2 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary/40"
        />
      </svg>

      {/* Main Logo Text */}
      <div className="relative">
        <h1 className="font-heading text-xl font-bold tracking-tight">
          <span className="text-primary">Nite</span>
          <span className="text-foreground">Lite</span>
        </h1>

        {/* Subtle underline accent */}
        <div className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-primary/60 via-accent/40 to-transparent" />

        {/* Small decorative dot */}
        <div className="absolute -top-1 -right-2 h-2 w-2 animate-pulse rounded-full bg-primary/60" />
      </div>

      {/* Decorative SVG Lines - Right */}
      <svg
        className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-30"
        width="24"
        height="32"
        viewBox="0 0 24 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M22 2C16 8 8 12 2 18C8 22 16 26 22 30"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-primary/40"
        />
      </svg>
    </div>
  );
}

export function LogoCompact({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <div className="relative">
        <span className="font-heading text-xl font-bold tracking-tight">
          <span className="text-primary">N</span>
          <span className="text-foreground">L</span>
        </span>
        <div className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-gradient-to-r from-primary/60 to-accent/40" />
      </div>
    </div>
  );
}
