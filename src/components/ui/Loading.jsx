import React from "react"

const Loading = ({ className = "" }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Navigation skeleton */}
      <div className="animate-pulse">
        <div className="h-16 bg-surface rounded-lg mb-6"></div>
      </div>
      
      {/* Content grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-surface rounded-xl p-6 space-y-4">
              <div className="h-32 bg-secondary rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-6 bg-secondary rounded w-3/4"></div>
                <div className="h-4 bg-secondary rounded w-full"></div>
                <div className="h-4 bg-secondary rounded w-2/3"></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="h-8 bg-secondary rounded w-20"></div>
                <div className="h-10 bg-primary/20 rounded-lg w-24"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading