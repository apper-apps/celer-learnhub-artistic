import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import PostCard from "@/components/organisms/PostCard"
import SearchBar from "@/components/molecules/SearchBar"
import { postService } from "@/services/api/postService"
import { userService } from "@/services/api/userService"

const InsightPage = () => {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [authors, setAuthors] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [postsData, usersData] = await Promise.all([
        postService.getAll(),
        userService.getAll()
      ])

      // Sort posts by published date (newest first)
      const sortedPosts = postsData.sort((a, b) => 
        new Date(b.published_at || b.created_at) - new Date(a.published_at || a.created_at)
      )

      setPosts(sortedPosts)
      setFilteredPosts(sortedPosts)

      // Create authors map
      const authorsMap = {}
      usersData.forEach(user => {
        authorsMap[user.Id] = user
      })
      setAuthors(authorsMap)

    } catch (err) {
      setError("Failed to load insights")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPosts(posts)
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPosts(filtered)
    }
  }, [searchTerm, posts])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="h-8 bg-surface rounded w-48 mb-4 animate-pulse"></div>
          <div className="h-4 bg-surface rounded w-96 mb-8 animate-pulse"></div>
          <div className="h-12 bg-surface rounded-lg w-full max-w-md animate-pulse"></div>
        </div>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Error message={error} onRetry={loadData} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary/20 rounded-xl flex items-center justify-center mx-auto mb-6">
              <ApperIcon name="BookOpen" className="w-8 h-8 text-primary" />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Learning Insights
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Discover the latest trends, expert tips, and valuable insights from our community of educators and learners.
            </p>

            <div className="max-w-md mx-auto">
              <SearchBar
                placeholder="Search insights..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Section */}
      {posts.length > 0 && !searchTerm && (
        <section className="py-16 bg-surface/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-3 mb-8">
              <ApperIcon name="Star" className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Featured Insight</h2>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <PostCard 
                post={posts[0]}
                author={authors[posts[0].author_id]}
                className="ring-2 ring-primary/30"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <Empty
              title="No insights found"
              description={
                searchTerm
                  ? "No insights match your search criteria. Try adjusting your search term."
                  : "No insights are currently available."
              }
              icon="FileText"
              actionLabel="Clear Search"
              action={searchTerm ? () => setSearchTerm("") : undefined}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {searchTerm ? `Search Results (${filteredPosts.length})` : "Latest Insights"}
                  </h2>
                  <p className="text-gray-400">
                    {searchTerm
                      ? `Found ${filteredPosts.length} insight${filteredPosts.length !== 1 ? "s" : ""} matching "${searchTerm}"`
                      : `Explore ${filteredPosts.length} thought-provoking article${filteredPosts.length !== 1 ? "s" : ""} and insights`
                    }
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <ApperIcon name="Filter" className="w-4 h-4" />
                  <span>{filteredPosts.length} Articles</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(searchTerm ? filteredPosts : filteredPosts.slice(1)).map((post, index) => (
                  <motion.div
                    key={post.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <PostCard 
                      post={post}
                      author={authors[post.author_id]}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <ApperIcon name="Mail" className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Get the latest insights and learning tips delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-surface border border-secondary rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-electric text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default InsightPage