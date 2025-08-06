import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import FormField from "@/components/molecules/FormField"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { userService } from "@/services/api/userService"
import { lectureService } from "@/services/api/lectureService"
import { programService } from "@/services/api/programService"
import { reviewService } from "@/services/api/reviewService"
import { toast } from "react-toastify"

const ProfilePage = ({ currentUser }) => {
  const [profile, setProfile] = useState({
    email: currentUser?.email || "",
    role: currentUser?.role || "",
    master_cohort: currentUser?.master_cohort || ""
  })
  const [stats, setStats] = useState({
    lecturesWatched: 0,
    programsEnrolled: 0,
    reviewsWritten: 0,
    totalProgress: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [programs, lectures, reviews] = await Promise.all([
        programService.getAll(),
        lectureService.getAll(),
        reviewService.getAll()
      ])

      // Calculate user stats
      const userReviews = reviews.filter(r => r.author_id === currentUser.Id)
      const totalLectures = lectures.length
      const enrolledPrograms = programs.length // For demo, assume user is enrolled in all
      
      setStats({
        lecturesWatched: Math.floor(totalLectures * 0.6), // Demo: 60% watched
        programsEnrolled: enrolledPrograms,
        reviewsWritten: userReviews.length,
        totalProgress: 60 // Demo progress
      })

    } catch (err) {
      setError("Failed to load profile data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [currentUser])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const updatedUser = await userService.update(currentUser.Id, {
        ...currentUser,
        ...profile
      })

      toast.success("Profile updated successfully!")
      
      // Update localStorage if this is the current user
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        localStorage.setItem("currentUser", JSON.stringify(updatedUser))
      }

    } catch (error) {
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsUpdating(false)
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-dark py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center space-x-6"
          >
            <div className="w-20 h-20 bg-gradient-electric rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {currentUser?.email?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
            
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                {currentUser?.email?.split("@")[0] || "User"}
              </h1>
              <div className="flex items-center space-x-4">
                <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm capitalize">
                  {currentUser?.role || "Student"}
                </span>
                {currentUser?.is_admin && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
            >
              {[
                {
                  icon: "PlayCircle",
                  label: "Lectures Watched",
                  value: stats.lecturesWatched,
                  color: "text-blue-400"
                },
                {
                  icon: "BookOpen",
                  label: "Programs Enrolled",
                  value: stats.programsEnrolled,
                  color: "text-green-400"
                },
                {
                  icon: "MessageSquare",
                  label: "Reviews Written",
                  value: stats.reviewsWritten,
                  color: "text-purple-400"
                },
                {
                  icon: "TrendingUp",
                  label: "Overall Progress",
                  value: `${stats.totalProgress}%`,
                  color: "text-primary"
                }
              ].map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6 text-center">
                    <div className={`w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mx-auto mb-3 ${stat.color.replace("text-", "bg-")}`}>
                      <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>

          {/* Profile Settings */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ApperIcon name="Settings" className="w-5 h-5 mr-2 text-primary" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <FormField
                      label="Email Address"
                      type="email"
                      id="profile-email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      required
                    />

                    <FormField
                      label="Role"
                      id="profile-role"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      placeholder="e.g., student, master"
                    />

                    <FormField
                      label="Master Cohort"
                      id="profile-cohort"
                      value={profile.master_cohort}
                      onChange={(e) => setProfile({ ...profile, master_cohort: e.target.value })}
                      placeholder="e.g., 2024-Q1"
                    />

                    <Button
                      type="submit"
                      disabled={isUpdating}
                      className="w-full"
                    >
                      {isUpdating ? (
                        <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ApperIcon name="Save" className="w-4 h-4 mr-2" />
                      )}
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ApperIcon name="Zap" className="w-5 h-5 mr-2 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="BookOpen" className="w-4 h-4 mr-2" />
                    Continue Learning
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="MessageSquare" className="w-4 h-4 mr-2" />
                    Write Review
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                    Community Forum
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <ApperIcon name="Download" className="w-4 h-4 mr-2" />
                    Download Certificate
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ApperIcon name="Award" className="w-5 h-5 mr-2 text-primary" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      icon: "Star",
                      title: "First Review",
                      description: "Shared your first review",
                      earned: stats.reviewsWritten > 0
                    },
                    {
                      icon: "PlayCircle",
                      title: "Getting Started",
                      description: "Watched 5 lectures",
                      earned: stats.lecturesWatched >= 5
                    },
                    {
                      icon: "Target",
                      title: "Half Way There",
                      description: "50% course completion",
                      earned: stats.totalProgress >= 50
                    }
                  ].map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        achievement.earned ? "bg-primary/20" : "bg-gray-600/20"
                      }`}>
                        <ApperIcon 
                          name={achievement.icon} 
                          className={`w-4 h-4 ${achievement.earned ? "text-primary" : "text-gray-500"}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${achievement.earned ? "text-white" : "text-gray-500"}`}>
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-400">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <ApperIcon name="Check" className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage