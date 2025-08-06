import React, { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { Card, CardContent } from "@/components/atoms/Card"
import { lectureService } from "@/services/api/lectureService"
import { programService } from "@/services/api/programService"

const LectureViewPage = ({ currentUser }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lecture, setLecture] = useState(null)
  const [program, setProgram] = useState(null)
  const [allLectures, setAllLectures] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [lectureData, lecturesData, programsData] = await Promise.all([
        lectureService.getById(parseInt(id)),
        lectureService.getAll(),
        programService.getAll()
      ])

      if (!lectureData) {
        setError("Lecture not found")
        return
      }

      setLecture(lectureData)

      const relatedProgram = programsData.find(p => p.Id === lectureData.program_id)
      setProgram(relatedProgram)

      const programLectures = lecturesData
        .filter(l => l.program_id === lectureData.program_id)
        .sort((a, b) => a.order - b.order)
      setAllLectures(programLectures)

    } catch (err) {
      setError("Failed to load lecture")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const canAccess = (lecture) => {
    if (!lecture) return false
    
    // For membership program, all users can access
    if (program?.slug === "membership") return true
    
    // For master program, check if user has master role or if it's a common lecture
    if (program?.slug === "text-influencer") {
      if (!currentUser) return lecture.level === "master_common"
      return currentUser.role === "master" || lecture.level === "master_common"
    }
    
    return true
  }

  const getCurrentLectureIndex = () => {
    return allLectures.findIndex(l => l.Id === lecture?.Id)
  }

  const getNextLecture = () => {
    const currentIndex = getCurrentLectureIndex()
    const nextLectures = allLectures.slice(currentIndex + 1)
    return nextLectures.find(l => canAccess(l))
  }

  const getPreviousLecture = () => {
    const currentIndex = getCurrentLectureIndex()
    const previousLectures = allLectures.slice(0, currentIndex).reverse()
    return previousLectures.find(l => canAccess(l))
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

  if (!lecture || !canAccess(lecture)) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="Lock" className="w-8 h-8 text-yellow-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Access Restricted</h2>
            <p className="text-gray-400 mb-6">
              {!currentUser 
                ? "Please log in to access this lecture."
                : "This lecture requires master level access."
              }
            </p>
            {program && (
              <Link to={`/program/${program.slug}`}>
                <Button>
                  <ApperIcon name="ArrowLeft" className="w-4 h-4 mr-2" />
                  Back to Program
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  const nextLecture = getNextLecture()
  const previousLecture = getPreviousLecture()
  const currentIndex = getCurrentLectureIndex()
  const totalLectures = allLectures.filter(l => canAccess(l)).length

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="bg-surface/50 border-b border-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {program && (
                <Link 
                  to={`/program/${program.slug}`}
                  className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors duration-200"
                >
                  <ApperIcon name="ArrowLeft" className="w-4 h-4" />
                  <span>Back to {program.title}</span>
                </Link>
              )}
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>Lecture {currentIndex + 1} of {allLectures.length}</span>
              <div className="w-32 bg-secondary rounded-full h-2">
                <div 
                  className="bg-gradient-electric h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / allLectures.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Lecture Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <ApperIcon name="Play" className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className="text-sm text-primary font-medium">
                  {lecture.category || "General"}
                </span>
                {lecture.level && lecture.level !== "member" && (
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    lecture.level === "master_common" 
                      ? "bg-green-500/20 text-green-400" 
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {lecture.level === "master_common" ? "Common" : "Master Only"}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-display font-bold text-white">
                {lecture.title}
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Video/Content Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="text-center">
                <ApperIcon name="Play" className="w-16 h-16 text-primary mx-auto mb-4" />
                <p className="text-gray-400">Video content would be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">Interactive learning experience</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Lecture Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Card>
            <CardContent className="p-8">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-gray-300 leading-relaxed">
                  {lecture.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {previousLecture ? (
                    <Link to={`/lecture/${previousLecture.Id}`}>
                      <Button variant="outline" className="group">
                        <ApperIcon name="ChevronLeft" className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        Previous: {previousLecture.title}
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-gray-500 text-sm">First lecture</div>
                  )}
                </div>

                <div className="flex-1 text-center">
                  <div className="text-sm text-gray-400">
                    Progress: {currentIndex + 1} of {allLectures.length}
                  </div>
                </div>

                <div className="flex-1 text-right">
                  {nextLecture ? (
                    <Link to={`/lecture/${nextLecture.Id}`}>
                      <Button className="group">
                        Next: {nextLecture.title}
                        <ApperIcon name="ChevronRight" className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-gray-500 text-sm">Last lecture</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default LectureViewPage