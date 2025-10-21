import * as React from "react"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cva } from "class-variance-authority"
import { ChevronDown, Menu, X } from "lucide-react"

import { cn } from "@/lib/utils"

const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root> & {
    variant?: "purple" | "white"
  }
>(({ className, children, variant = "purple", ...props }, ref) => {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  
  const bgClass = variant === "white" 
    ? "bg-white shadow-sm" 
    : ""
  
  const textClass = variant === "white" 
    ? "text-gray-900" 
    : "text-white"

  return (
    <nav className={cn("w-full", bgClass)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo placeholder - replace with your actual logo */}
          <div className={cn("text-2xl font-bold", textClass)}>
            
          </div>

          {/* Desktop Menu */}
          <NavigationMenuPrimitive.Root
            ref={ref}
            className={cn("hidden lg:flex items-center", className)}
            {...props}
          >
            {children}
            <NavigationMenuViewport variant={variant} />
          </NavigationMenuPrimitive.Root>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              variant === "white" 
                ? "hover:bg-gray-100" 
                : "hover:bg-white/10",
              textClass
            )}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className={cn(
            "lg:hidden py-4 space-y-1 border-t",
            variant === "white" ? "border-gray-200" : "border-white/10"
          )}>
            {children}
          </div>
        )}
      </div>
    </nav>
  )
})
NavigationMenu.displayName = "NavigationMenu"

const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      "group flex flex-col lg:flex-row list-none items-stretch lg:items-center lg:space-x-2",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

const NavigationMenuItem = NavigationMenuPrimitive.Item

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-full lg:w-max items-center justify-start rounded-lg px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        purple: "text-white/80 hover:text-white hover:bg-white/5 focus:bg-white/5 data-[active]:text-white data-[state=open]:text-white data-[state=open]:bg-white/5",
        white: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:bg-gray-50 data-[active]:text-gray-900 data-[state=open]:bg-gray-50"
      }
    },
    defaultVariants: {
      variant: "purple"
    }
  }
)

const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger> & {
    variant?: "purple" | "white"
  }
>(({ className, children, variant = "purple", ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    className={cn(navigationMenuTriggerStyle({ variant }), "group", className)}
    {...props}
  >
    {children}{" "}
    <ChevronDown
      className="relative ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content> & {
    variant?: "purple" | "white"
  }
>(({ className, variant = "purple", ...props }, ref) => {
  const bgClass = variant === "white" 
    ? "bg-white border-gray-200" 
    : "bg-[#1a0b2e] border-purple-800/50"
  
  const textClass = variant === "white" 
    ? "text-gray-900" 
    : "text-white"
  
  return (
    <NavigationMenuPrimitive.Content
      ref={ref}
      className={cn(
        "left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out lg:data-[motion=from-end]:slide-in-from-right-52 lg:data-[motion=from-start]:slide-in-from-left-52 lg:data-[motion=to-end]:slide-out-to-right-52 lg:data-[motion=to-start]:slide-out-to-left-52 lg:absolute lg:w-auto",
        bgClass,
        textClass,
        className
      )}
      {...props}
    />
  )
})
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

const NavigationMenuLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Link>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Link> & {
    variant?: "purple" | "white"
  }
>(({ className, variant = "purple", ...props }, ref) => {
  const hoverClass = variant === "white"
    ? "hover:bg-gray-50"
    : "hover:bg-white/5"
    
  return (
    <NavigationMenuPrimitive.Link
      ref={ref}
      className={cn(
        "block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors",
        hoverClass,
        className
      )}
      {...props}
    />
  )
})
NavigationMenuLink.displayName = "NavigationMenuLink"

const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport> & {
    variant?: "purple" | "white"
  }
>(({ className, variant = "purple", ...props }, ref) => {
  const bgClass = variant === "white" 
    ? "bg-white border-gray-200" 
    : "bg-[#1a0b2e] border-purple-800/50"
  
  return (
    <div className={cn("absolute left-0 top-full flex justify-center")}>
      <NavigationMenuPrimitive.Viewport
        className={cn(
          "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-lg border shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 lg:w-[var(--radix-navigation-menu-viewport-width)]",
          bgClass,
          className
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
})
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-purple-600 shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
