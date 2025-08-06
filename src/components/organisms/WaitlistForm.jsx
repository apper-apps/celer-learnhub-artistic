import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import FormField from "@/components/molecules/FormField"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { waitlistService } from "@/services/api/waitlistService"
import { toast } from "react-toastify"

const WaitlistForm = ({ programSlug, onSuccess, className = "" }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if email is already on waitlist for this program
      const existingEntries = await waitlistService.getAll()
      const alreadyOnWaitlist = existingEntries.some(
        entry => entry.email === email && entry.program_slug === programSlug
      )

      if (alreadyOnWaitlist) {
        toast.info("You're already on the waitlist for this program!")
        return
      }

      await waitlistService.create({
        email,
        program_slug: programSlug,
        created_at: new Date().toISOString()
      })

      toast.success("Successfully joined the waitlist!")
      setEmail("")
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast.error("Failed to join waitlist. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ApperIcon name="Clock" className="w-5 h-5 mr-2 text-primary" />
          Join Waitlist
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-400 text-sm mb-4">
          Get notified when enrollment opens for this program.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Email Address"
            type="email"
            id="waitlist-email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Joining..." : "Join Waitlist"}
          </Button>
        </form>
        
        <p className="text-xs text-gray-500 mt-3 text-center">
          We'll notify you via email when enrollment opens.
        </p>
      </CardContent>
    </Card>
  )
}

export default WaitlistForm