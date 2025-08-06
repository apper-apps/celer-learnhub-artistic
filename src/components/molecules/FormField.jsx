import React from "react"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"

const FormField = ({ 
  label, 
  id, 
  error, 
  required = false,
  className = "",
  ...inputProps 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor={id} className={required ? "after:content-['*'] after:text-red-400 after:ml-1" : ""}>
          {label}
        </Label>
      )}
      <Input
        id={id}
        {...inputProps}
        className={error ? "border-red-500 focus:ring-red-500" : ""}
      />
      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  )
}

export default FormField