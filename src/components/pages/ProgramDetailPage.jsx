import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import LectureList from "@/components/organisms/LectureList"
import WaitlistForm from "@/components/organisms/WaitlistForm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { programService } from "@/services/api/programService"
import { lectureService } from "@/services/api/lectureService"

const ProgramDetailPage = ({ currentUser }) => {
  const { slug } = useParams()
  const [program, setProgram] = useState(null)
  const [lectures, setLectures] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showWaitlist, setShowWaitlist] = useState(false)

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [programsData, lecturesData] = await Promise.all([
        programService.getAll(),
        lectureService.getAll()
      ])

      const foundProgram = programsData.find(p => p.slug === slug)
      if (!foundProgram) {
        setError("Program not found")
        return
      }

      setProgram(foundProgram)

      const programLectures = lecturesData.filter(
        lecture => lecture.program_id === foundProgram.Id
      )
      setLectures(programLectures)

    } catch (err) {
      setError("Failed to load program details")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [slug])

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

  if (!program) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Empty 
          title="Program not found"
          description="The program you're looking for doesn't exist or has been removed."
          icon="BookOpen"
          action={() => window.history.back()}
          actionLabel="Go Back"
        />
      </div>
    )
  }

  const programType = program.slug === "membership" ? "Member Course" : "Master Course"
  const icon = program.slug === "membership" ? "BookOpen" : "Crown"
  const canEnroll = true // For demo purposes, assume enrollment is always possible

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-6">
            <Link 
              to="/program" 
              className="text-gray-400 hover:text-primary transition-colors duration-200"
            >
              Programs
            </Link>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-500" />
            <span className="text-white">{program.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-12"
          >
            <div className="lg:col-span-2">
              <div className="flex items-start space-x-4 mb-6">
                <div className={`w-16 h-16 rounded-xl ${program.slug === "membership" ? "bg-blue-500/20" : "bg-yellow-500/20"} flex items-center justify-center`}>
                  <ApperIcon 
                    name={icon} 
                    className={`w-8 h-8 ${program.slug === "membership" ? "text-blue-400" : "text-yellow-400"}`} 
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
                      {programType}
                    </span>
                    {program.has_common_course && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                        Common Course Available
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-display font-bold text-white mb-4">
                    {program.title}
                  </h1>
                </div>
              </div>

              <p className="text-xl text-gray-400 mb-8 leading-relaxed">
                {program.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">{lectures.length}</div>
                  <div className="text-gray-400 text-sm">Lectures</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">Self-paced</div>
                  <div className="text-gray-400 text-sm">Learning</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">∞</div>
                  <div className="text-gray-400 text-sm">Lifetime Access</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">24/7</div>
                  <div className="text-gray-400 text-sm">Support</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {canEnroll ? (
                  <>
                    <Button size="lg" className="flex-1 sm:flex-none">
                      <ApperIcon name="Play" className="w-5 h-5 mr-2" />
                      Start Learning
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      onClick={() => setShowWaitlist(true)}
                    >
                      <ApperIcon name="Bell" className="w-5 h-5 mr-2" />
                      Get Updates
                    </Button>
                  </>
                ) : (
                  <Button 
                    size="lg" 
                    onClick={() => setShowWaitlist(true)}
                    className="flex-1 sm:flex-none"
                  >
                    <ApperIcon name="Clock" className="w-5 h-5 mr-2" />
                    Join Waitlist
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {showWaitlist && (
                <WaitlistForm 
                  programSlug={program.slug}
                  onSuccess={() => setShowWaitlist(false)}
                />
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ApperIcon name="Users" className="w-5 h-5 mr-2 text-primary" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Active Learners</span>
                      <span className="text-white font-medium">1,247</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Completion Rate</span>
                      <span className="text-green-400 font-medium">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Average Rating</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-yellow-400 font-medium">4.8</span>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <ApperIcon 
                              key={i} 
                              name="Star" 
                              className={`w-4 h-4 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ApperIcon name="Award" className="w-5 h-5 mr-2 text-primary" />
                    What You'll Get
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {[
                      "Lifetime access to all content",
                      "Mobile and desktop compatible",
                      "Community forum access",
                      "Expert instructor support",
                      "Certificate of completion",
                      "Regular content updates"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <ApperIcon name="Check" className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Course Curriculum
            </h2>
            <p className="text-gray-400 max-w-3xl">
              Explore our comprehensive curriculum designed to take you from beginner to expert level.
            </p>
          </div>

          {lectures.length === 0 ? (
            <Empty 
              title="No lectures available"
              description="This program is currently being developed. Join the waitlist to be notified when content becomes available."
              icon="PlayCircle"
              action={() => setShowWaitlist(true)}
              actionLabel="Join Waitlist"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LectureList 
                lectures={lectures} 
                currentUser={currentUser}
                programSlug={program.slug}
              />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProgramDetailPage