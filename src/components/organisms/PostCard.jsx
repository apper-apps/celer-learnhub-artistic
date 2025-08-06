import React from "react"
import { Link } from "react-router-dom"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"

const PostCard = ({ post, author, className = "" }) => {
  const excerpt = post.content?.length > 150 
    ? post.content.substring(0, 150) + "..." 
    : post.content

  return (
    <Card className={`group ${className}`} hover>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
            <ApperIcon name="FileText" className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs text-gray-400">
            {format(new Date(post.published_at || post.created_at), "MMM d, yyyy")}
          </span>
        </div>
        
        <CardTitle className="group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {post.title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-electric rounded-full flex items-center justify-center">
              <span className="text-xs text-white font-medium">
                {author?.email?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              {author?.email?.split("@")[0] || "Author"}
            </span>
          </div>

          <Link to={`/insight/${post.slug}`}>
            <Button size="sm" variant="ghost" className="group-hover:bg-primary group-hover:text-white transition-all duration-200">
              <span className="mr-2">Read More</span>
              <ApperIcon name="ArrowRight" className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default PostCard