import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const buttonVariants = {
  primary: "bg-gradient-electric text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-105",
  secondary: "bg-surface text-white border border-secondary hover:border-primary hover:bg-secondary",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white",
  ghost: "text-gray-300 hover:text-white hover:bg-secondary",
  danger: "bg-red-600 text-white hover:bg-red-700 hover:scale-105"
}

const buttonSizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg"
}

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  disabled,
  children, 
  ...props 
}, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
        buttonVariants[variant],
        buttonSizes[size],
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button