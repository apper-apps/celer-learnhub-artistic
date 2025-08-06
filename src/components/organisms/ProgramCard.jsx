import React from "react"
import { Link } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"

const ProgramCard = ({ program, lectureCount = 0, className = "" }) => {
  const isCommonCourse = program.has_common_course
  const programType = program.slug === "membership" ? "Member Course" : "Master Course"
  const icon = program.slug === "membership" ? "BookOpen" : "Crown"

  return (
    <Card className={`group ${className}`} hover>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-xl ${program.slug === "membership" ? "bg-blue-500/20" : "bg-yellow-500/20"} flex items-center justify-center mb-4`}>
            <ApperIcon 
              name={icon} 
              className={`w-6 h-6 ${program.slug === "membership" ? "text-blue-400" : "text-yellow-400"}`} 
            />
          </div>
          {isCommonCourse && (
            <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
              Common Course
            </span>
          )}
        </div>
        
        <CardTitle className="group-hover:text-primary transition-colors duration-200">
          {program.title}
        </CardTitle>
        <p className="text-sm text-primary font-medium">{programType}</p>
      </CardHeader>

      <CardContent>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {program.description}
        </p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <ApperIcon name="PlayCircle" className="w-4 h-4" />
              <span>{lectureCount} Lectures</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Clock" className="w-4 h-4" />
              <span>Self-paced</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 bg-gradient-electric rounded-full border-2 border-surface flex items-center justify-center"
                >
                  <span className="text-xs text-white font-medium">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-2">+50 students</span>
          </div>

          <Link to={`/program/${program.slug}`}>
            <Button size="sm" className="group-hover:scale-105 transition-transform duration-200">
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-1" />
              View Program
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgramCard