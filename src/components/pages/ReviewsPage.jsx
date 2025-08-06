import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ReviewCard from "@/components/organisms/ReviewCard"
import FormField from "@/components/molecules/FormField"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { reviewService } from "@/services/api/reviewService"
import { userService } from "@/services/api/userService"
import { toast } from "react-toastify"

const ReviewsPage = ({ currentUser }) => {
  const [reviews, setReviews] = useState([])
  const [authors, setAuthors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [reviewsData, usersData] = await Promise.all([
        reviewService.getAll(),
        userService.getAll()
      ])

      // Sort reviews: featured first, then by date
      const sortedReviews = reviewsData.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return new Date(b.created_at) - new Date(a.created_at)
      })

      setReviews(sortedReviews)

      // Create authors map
      const authorsMap = {}
      usersData.forEach(user => {
        authorsMap[user.Id] = user
      })
      setAuthors(authorsMap)

    } catch (err) {
      setError("Failed to load reviews")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!currentUser || !newReview.trim()) return

    setIsSubmitting(true)
    try {
      const reviewData = {
        text: newReview.trim(),
        author_id: currentUser.Id,
        likes: [],
        featured: false,
        created_at: new Date().toISOString()
      }

      const createdReview = await reviewService.create(reviewData)
      setReviews(prev => [createdReview, ...prev])
      setNewReview("")
      setShowReviewForm(false)
      toast.success("Review submitted successfully!")
    } catch (error) {
      toast.error("Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleLike = async (reviewId) => {
    if (!currentUser) {
      toast.info("Please log in to like reviews")
      return
    }

    try {
      const review = reviews.find(r => r.Id === reviewId)
      if (!review) return

      const currentLikes = review.likes || []
      const userIdString = currentUser.Id.toString()
      let updatedLikes

      if (currentLikes.includes(userIdString)) {
        updatedLikes = currentLikes.filter(id => id !== userIdString)
      } else {
        updatedLikes = [...currentLikes, userIdString]
      }

      const updatedReview = await reviewService.update(reviewId, {
        ...review,
        likes: updatedLikes
      })

      setReviews(prev =>
        prev.map(r => r.Id === reviewId ? updatedReview : r)
      )

    } catch (error) {
      toast.error("Failed to update like. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadData} />
      </div>
    )
  }

  const featuredReviews = reviews.filter(review => review.featured)
  const regularReviews = reviews.filter(review => !review.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-dark py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="MessageSquare" className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Student Reviews
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Read what our community says about their learning experience with LearnHub Pro.
            </p>

            {currentUser && (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="mb-8"
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Review Form */}
        {showReviewForm && currentUser && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-12"
          >
            <Card>
              <CardHeader>
                <CardTitle>Share Your Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <FormField
                    label="Your Review"
                    id="review-text"
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Tell us about your experience with LearnHub Pro..."
                    required
                    className="min-h-32"
                  />
                  <div className="flex items-center justify-end space-x-4">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowReviewForm(false)
                        setNewReview("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || !newReview.trim()}
                    >
                      {isSubmitting ? (
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ApperIcon name="Send" className="w-4 h-4 mr-2" />
                      )}
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* No Reviews State */}
        {reviews.length === 0 ? (
          <Empty
            title="No reviews yet"
            description={
              currentUser
                ? "Be the first to share your experience with LearnHub Pro!"
                : "No reviews are available yet. Join our community to add your review."
            }
            icon="MessageSquare"
            action={currentUser ? () => setShowReviewForm(true) : undefined}
            actionLabel="Write First Review"
          />
        ) : (
          <>
            {/* Featured Reviews */}
            {featuredReviews.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-12"
              >
                <div className="flex items-center space-x-3 mb-8">
                  <ApperIcon name="Star" className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-bold text-white">Featured Reviews</h2>
                </div>

                <div className="space-y-6">
                  {featuredReviews.map((review, index) => (
                    <motion.div
                      key={review.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ReviewCard
                        review={review}
                        author={authors[review.author_id]}
                        currentUser={currentUser}
                        onToggleLike={handleToggleLike}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Regular Reviews */}
            {regularReviews.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: featuredReviews.length * 0.1 }}
              >
                <h2 className="text-2xl font-bold text-white mb-8">
                  Community Reviews ({regularReviews.length})
                </h2>

                <div className="space-y-6">
                  {regularReviews.map((review, index) => (
                    <motion.div
                      key={review.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ReviewCard
                        review={review}
                        author={authors[review.author_id]}
                        currentUser={currentUser}
                        onToggleLike={handleToggleLike}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}
          </>
        )}

        {/* Login CTA for Non-Users */}
        {!currentUser && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12"
          >
            <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/30">
              <CardContent className="p-8 text-center">
                <ApperIcon name="Users" className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">
                  Join Our Community
                </h3>
                <p className="text-gray-400 mb-6">
                  Sign up to write reviews, like posts, and connect with other learners.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button>
                    <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
                    Sign Up Free
                  </Button>
                  <Button variant="outline">
                    <ApperIcon name="LogIn" className="w-4 h-4 mr-2" />
                    Log In
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ReviewsPage