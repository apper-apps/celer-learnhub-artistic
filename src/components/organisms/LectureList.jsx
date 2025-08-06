import React from "react";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { Card, CardContent } from "@/components/atoms/Card";

const LectureList = ({ lectures, currentUser, programSlug }) => {
  // Group lectures by category
  const lecturesByCategory = lectures.reduce((acc, lecture) => {
    const category = lecture.category || "General"
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(lecture)
    return acc
  }, {})

const canAccessLecture = (lecture, index) => {
    // For membership program, check user role and lecture position
    if (programSlug === "membership") {
      // First lecture is always accessible
      if (index === 0) return true
      
      // If no user or free role, only first lecture accessible
      if (!currentUser || currentUser.role === "free") return false
      
      // Member and both roles can access all lectures
      if (currentUser.role === "member" || currentUser.role === "both") return true
    }
    
    // For master program, check if user has master role or if it's a common lecture
    if (programSlug === "text-influencer") {
      if (!currentUser) return lecture.level === "master_common"
      return currentUser.role === "master" || lecture.level === "master_common"
    }
    
    return true
  }

  return (
    <div className="space-y-6">
      {Object.entries(lecturesByCategory).map(([category, categoryLectures]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <ApperIcon name="Folder" className="w-5 h-5 mr-2 text-primary" />
            {category}
          </h3>
          
          <div className="space-y-3">
{categoryLectures
              .sort((a, b) => a.order - b.order)
              .map((lecture, index) => {
                const hasAccess = canAccessLecture(lecture, index)
                const isBlurred = programSlug === "membership" && !hasAccess
                
                return (
                  <div key={lecture.Id} className="relative">
                    <Card className={`group ${isBlurred ? "blur-sm" : ""}`} hover={hasAccess}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 flex-1">
                            <div className={`w-10 h-10 rounded-lg ${hasAccess ? "bg-primary/20" : "bg-gray-600/20"} flex items-center justify-center`}>
                              <ApperIcon 
                                name={hasAccess ? "Play" : "Lock"} 
                                className={`w-5 h-5 ${hasAccess ? "text-primary" : "text-gray-500"}`} 
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium ${hasAccess ? "text-white group-hover:text-primary" : "text-gray-500"} transition-colors duration-200`}>
                                {lecture.title}
                              </h4>
                              <div className="flex items-center space-x-4 mt-1">
                                <span className="text-xs text-gray-400">
                                  Lecture {lecture.order}
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
                            </div>
                          </div>

                          {hasAccess ? (
                            <Link to={`/lecture/${lecture.Id}`}>
                              <ApperIcon 
                                name="ChevronRight" 
                                className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" 
                              />
                            </Link>
                          ) : (
                            <div className="flex items-center space-x-2">
                              {programSlug === "membership" ? (
                                <ApperIcon name="Lock" className="w-4 h-4 text-gray-500" />
                              ) : !currentUser ? (
                                <span className="text-xs text-gray-500">Login required</span>
                              ) : (
                                <span className="text-xs text-gray-500">Master access required</span>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    
                    {isBlurred && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm">
                        <div className="text-center p-6">
                          <ApperIcon name="Lock" className="w-8 h-8 text-primary mx-auto mb-3" />
                          <p className="text-white font-medium mb-2">Log In to unlock</p>
                          <p className="text-gray-400 text-sm mb-4">
                            Sign in to access all membership content
                          </p>
                          <Link to="/auth">
                            <Button size="sm" className="bg-primary hover:bg-primary/90">
                              <ApperIcon name="LogIn" className="w-4 h-4 mr-2" />
                              Sign In
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default LectureList