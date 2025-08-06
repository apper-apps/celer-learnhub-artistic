import React, { useState } from "react"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { Card, CardContent } from "@/components/atoms/Card"
import { format } from "date-fns"

const ReviewCard = ({ review, author, currentUser, onToggleLike, className = "" }) => {
  const [isLiking, setIsLiking] = useState(false)
  const hasLiked = currentUser && review.likes?.includes(currentUser.Id?.toString())
  const likesCount = review.likes?.length || 0

  const handleToggleLike = async () => {
    if (!currentUser || isLiking) return
    
    setIsLiking(true)
    try {
      await onToggleLike(review.Id)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card className={`${className} ${review.featured ? "ring-2 ring-primary/30" : ""}`}>
      <CardContent className="p-6">
        {review.featured && (
          <div className="flex items-center space-x-2 mb-4">
            <ApperIcon name="Star" className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-xs font-medium text-yellow-400">Featured Review</span>
          </div>
        )}

        <p className="text-gray-300 mb-4 leading-relaxed">
          {review.text}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-electric rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {author?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            <div>
              <p className="text-sm text-white font-medium">
                {author?.email?.split("@")[0] || "Anonymous"}
              </p>
              <p className="text-xs text-gray-400">
                {format(new Date(review.created_at), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleLike}
                disabled={!currentUser || isLiking}
                className={`p-2 ${hasLiked ? "text-red-400 hover:text-red-300" : "text-gray-400 hover:text-red-400"}`}
              >
                <ApperIcon 
                  name="Heart" 
                  className={`w-4 h-4 ${hasLiked ? "fill-current" : ""} ${isLiking ? "animate-pulse" : ""}`} 
                />
              </Button>
              <span className="text-sm text-gray-400">{likesCount}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReviewCard