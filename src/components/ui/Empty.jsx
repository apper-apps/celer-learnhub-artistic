import React from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item",
  icon = "Package",
  action,
  actionLabel = "Add Item",
  className = "" 
}) => {
  return (
    <div className={`min-h-64 flex flex-col items-center justify-center text-center space-y-4 ${className}`}>
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-2">
        <ApperIcon name={icon} className="w-8 h-8 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-gray-400 max-w-sm">{description}</p>
      </div>
      
      {action && (
        <Button onClick={action} className="mt-4">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

export default Empty