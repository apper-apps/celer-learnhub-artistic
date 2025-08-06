import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import ProgramCard from "@/components/organisms/ProgramCard"
import PostCard from "@/components/organisms/PostCard"
import { programService } from "@/services/api/programService"
import { postService } from "@/services/api/postService"
import { userService } from "@/services/api/userService"
import { lectureService } from "@/services/api/lectureService"

const HomePage = () => {
  const [programs, setPrograms] = useState([])
  const [posts, setPosts] = useState([])
  const [authors, setAuthors] = useState({})
  const [lectureCounts, setLectureCounts] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [programsData, postsData, usersData, lecturesData] = await Promise.all([
        programService.getAll(),
        postService.getAll(),
        userService.getAll(),
        lectureService.getAll()
      ])

      setPrograms(programsData.slice(0, 2)) // Show only featured programs
      setPosts(postsData.slice(0, 3)) // Show latest 3 posts

      // Create authors map
      const authorsMap = {}
      usersData.forEach(user => {
        authorsMap[user.Id] = user
      })
      setAuthors(authorsMap)

      // Count lectures per program
      const counts = {}
      programsData.forEach(program => {
        const count = lecturesData.filter(lecture => lecture.program_id === program.Id).length
        counts[program.Id] = count
      })
      setLectureCounts(counts)

    } catch (err) {
      setError("Failed to load homepage content")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-dark overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-background"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl sm:text-6xl font-display font-bold text-white mb-6">
                Master Your Skills with
                <span className="text-gradient block mt-2">LearnHub Pro</span>
              </h1>
              
              <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
                Access premium courses, connect with a vibrant community, and accelerate your learning journey with our structured programs designed for real-world success.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/program">
                  <Button size="xl" className="min-w-48">
                    <ApperIcon name="Rocket" className="w-5 h-5 mr-2" />
                    Explore Programs
                  </Button>
                </Link>
                <Link to="/insight">
                  <Button variant="outline" size="xl" className="min-w-48">
                    <ApperIcon name="BookOpen" className="w-5 h-5 mr-2" />
                    Read Insights
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: "Users", value: "1,200+", label: "Active Learners" },
              { icon: "BookOpen", value: "50+", label: "Expert Courses" },
              { icon: "Award", value: "95%", label: "Completion Rate" },
              { icon: "Star", value: "4.9", label: "Average Rating" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-electric rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name={stat.icon} className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Programs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Featured Programs
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover our most popular learning paths designed to help you achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {programs.map((program, index) => (
              <motion.div
                key={program.Id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ProgramCard 
                  program={program} 
                  lectureCount={lectureCounts[program.Id] || 0}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/program">
              <Button variant="outline" size="lg">
                View All Programs
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Insights */}
      <section className="py-16 bg-surface/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Latest Insights
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Stay updated with the latest trends, tips, and insights from our community of experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {posts.map((post, index) => (
              <motion.div
                key={post.Id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <PostCard 
                  post={post}
                  author={authors[post.author_id]}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/insight">
              <Button variant="outline" size="lg">
                Read More Insights
                <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/5"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of learners who are already advancing their skills with LearnHub Pro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/program">
                <Button size="xl">
                  <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                  Start Learning Today
                </Button>
              </Link>
              <Link to="/reviews">
                <Button variant="outline" size="xl">
                  <ApperIcon name="MessageCircle" className="w-5 h-5 mr-2" />
                  Read Reviews
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage