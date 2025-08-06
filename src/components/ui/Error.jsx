import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <div className={`min-h-64 flex flex-col items-center justify-center text-center space-y-4 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-red-400" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">Oops! Something went wrong</h3>
        <p className="text-gray-400 max-w-sm">{message}</p>
      </div>
      
      {onRetry && (
        <Button onClick={onRetry} className="mt-4">
          <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
}

export default Error