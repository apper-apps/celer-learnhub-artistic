import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { programService } from "@/services/api/programService"
import { lectureService } from "@/services/api/lectureService"
import { postService } from "@/services/api/postService"
import { reviewService } from "@/services/api/reviewService"
import { userService } from "@/services/api/userService"
import { waitlistService } from "@/services/api/waitlistService"

const AdminPage = () => {
  const [stats, setStats] = useState({
    users: 0,
    programs: 0,
    lectures: 0,
    posts: 0,
    reviews: 0,
    waitlist: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [
        users,
        programs,
        lectures,
        posts,
        reviews,
        waitlist
      ] = await Promise.all([
        userService.getAll(),
        programService.getAll(),
        lectureService.getAll(),
        postService.getAll(),
        reviewService.getAll(),
        waitlistService.getAll()
      ])

      setStats({
        users: users.length,
        programs: programs.length,
        lectures: lectures.length,
        posts: posts.length,
        reviews: reviews.length,
        waitlist: waitlist.length
      })

    } catch (err) {
      setError("Failed to load admin data")
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

  const adminSections = [
    {
      title: "Users",
      icon: "Users",
      count: stats.users,
      description: "Manage user accounts and permissions",
      path: "/admin/users",
      color: "blue"
    },
    {
      title: "Programs",
      icon: "BookOpen",
      count: stats.programs,
      description: "Create and manage learning programs",
      path: "/admin/programs",
      color: "green"
    },
    {
      title: "Lectures",
      icon: "PlayCircle",
      count: stats.lectures,
      description: "Organize course content and lectures",
      path: "/admin/lectures",
      color: "purple"
    },
    {
      title: "Posts",
      icon: "FileText",
      count: stats.posts,
      description: "Manage blog posts and insights",
      path: "/admin/posts",
      color: "yellow"
    }
  ]

  const quickStats = [
    {
      title: "Total Reviews",
      value: stats.reviews,
      icon: "MessageSquare",
      trend: "+12%",
      color: "text-green-400"
    },
    {
      title: "Waitlist Entries",
      value: stats.waitlist,
      icon: "Clock",
      trend: "+5%",
      color: "text-blue-400"
    },
    {
      title: "Active Programs",
      value: stats.programs,
      icon: "Target",
      trend: "stable",
      color: "text-purple-400"
    },
    {
      title: "Content Items",
      value: stats.lectures + stats.posts,
      icon: "Archive",
      trend: "+8%",
      color: "text-yellow-400"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-electric rounded-xl flex items-center justify-center">
                <ApperIcon name="Shield" className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-display font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-400">
                  Manage your LearnHub Pro platform
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className={`text-xs ${stat.color} font-medium`}>{stat.trend}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center ${stat.color.replace("text-", "bg-")}`}>
                    <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Admin Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-8">Management Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {adminSections.map((section, index) => (
              <Link key={index} to={section.path}>
                <Card className="group h-full" hover>
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl bg-${section.color}-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <ApperIcon 
                        name={section.icon} 
                        className={`w-6 h-6 text-${section.color}-400`} 
                      />
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors duration-200">
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gradient">
                        {section.count}
                      </span>
                      <ApperIcon 
                        name="ArrowRight" 
                        className="w-5 h-5 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" 
                      />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="Activity" className="w-5 h-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    action: "New user registration",
                    user: "john@example.com",
                    time: "2 minutes ago",
                    icon: "UserPlus",
                    color: "text-green-400"
                  },
                  {
                    action: "Review submitted",
                    user: "sarah@example.com",
                    time: "15 minutes ago",
                    icon: "MessageSquare",
                    color: "text-blue-400"
                  },
                  {
                    action: "Program enrollment",
                    user: "mike@example.com",
                    time: "1 hour ago",
                    icon: "BookOpen",
                    color: "text-purple-400"
                  },
                  {
                    action: "Waitlist signup",
                    user: "anna@example.com",
                    time: "2 hours ago",
                    icon: "Clock",
                    color: "text-yellow-400"
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-surface/30 hover:bg-surface/50 transition-colors duration-200">
                    <div className={`w-8 h-8 rounded-lg bg-opacity-20 flex items-center justify-center ${activity.color.replace("text-", "bg-")}`}>
                      <ApperIcon name={activity.icon} className={`w-4 h-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-gray-400 text-xs">{activity.user}</p>
                    </div>
                    <span className="text-gray-500 text-xs">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminPage