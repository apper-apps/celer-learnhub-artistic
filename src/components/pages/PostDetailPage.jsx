import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { format } from "date-fns"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import { Card, CardContent } from "@/components/atoms/Card"
import { postService } from "@/services/api/postService"
import { userService } from "@/services/api/userService"

const PostDetailPage = () => {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [author, setAuthor] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [postsData, usersData] = await Promise.all([
        postService.getAll(),
        userService.getAll()
      ])

      const foundPost = postsData.find(p => p.slug === slug)
      if (!foundPost) {
        setError("Post not found")
        return
      }

      setPost(foundPost)

      const foundAuthor = usersData.find(u => u.Id === foundPost.author_id)
      setAuthor(foundAuthor)

      // Get related posts (excluding current post)
      const related = postsData
        .filter(p => p.Id !== foundPost.Id)
        .slice(0, 3)
      setRelatedPosts(related)

    } catch (err) {
      setError("Failed to load post")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [slug])

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

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Empty 
          title="Post not found"
          description="The post you're looking for doesn't exist or has been removed."
          icon="FileText"
          action={() => window.history.back()}
          actionLabel="Go Back"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <div className="bg-surface/50 border-b border-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            to="/insight"
            className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors duration-200"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            <span>Back to Insights</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article>
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-gray-400">
                {format(new Date(post.published_at || post.created_at), "MMMM d, yyyy")}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {author && (
              <div className="flex items-center space-x-4 p-6 bg-surface/50 rounded-xl border border-secondary/50">
                <div className="w-12 h-12 bg-gradient-electric rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {author.email?.charAt(0).toUpperCase() || "A"}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {author.email?.split("@")[0] || "Author"}
                  </p>
                  <p className="text-gray-400 text-sm capitalize">
                    {author.role || "Contributor"}
                  </p>
                </div>
              </div>
            )}
          </motion.header>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                    {post.content}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-between py-6 border-t border-secondary/50 mb-12"
          >
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <ApperIcon name="Heart" className="w-4 h-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm">
                <ApperIcon name="Share2" className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Eye" className="w-4 h-4" />
                <span>247 views</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" className="w-4 h-4" />
                <span>5 min read</span>
              </div>
            </div>
          </motion.div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8">Related Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.Id} className="group" hover>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-white group-hover:text-primary transition-colors duration-200 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {relatedPost.content.length > 100 
                        ? relatedPost.content.substring(0, 100) + "..." 
                        : relatedPost.content}
                    </p>
                    <Link 
                      to={`/insight/${relatedPost.slug}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      Read more →
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  )
}

export default PostDetailPage