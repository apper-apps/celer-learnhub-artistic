import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ProgramCard from "@/components/organisms/ProgramCard"
import SearchBar from "@/components/molecules/SearchBar"
import { programService } from "@/services/api/programService"
import { lectureService } from "@/services/api/lectureService"

const ProgramListPage = () => {
  const [programs, setPrograms] = useState([])
  const [filteredPrograms, setFilteredPrograms] = useState([])
  const [lectureCounts, setLectureCounts] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [programsData, lecturesData] = await Promise.all([
        programService.getAll(),
        lectureService.getAll()
      ])

      setPrograms(programsData)
      setFilteredPrograms(programsData)

      // Count lectures per program
      const counts = {}
      programsData.forEach(program => {
        const count = lecturesData.filter(lecture => lecture.program_id === program.Id).length
        counts[program.Id] = count
      })
      setLectureCounts(counts)

    } catch (err) {
      setError("Failed to load programs")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredPrograms(programs)
    } else {
      const filtered = programs.filter(program =>
        program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPrograms(filtered)
    }
  }, [searchTerm, programs])

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
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
              Learning Programs
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Choose from our curated selection of comprehensive learning programs designed to accelerate your professional growth.
            </p>

            <div className="max-w-md mx-auto">
              <SearchBar
                placeholder="Search programs..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPrograms.length === 0 ? (
            <Empty
              title="No programs found"
              description={
                searchTerm
                  ? "No programs match your search criteria. Try adjusting your search term."
                  : "No programs are currently available."
              }
              icon="BookOpen"
              actionLabel="Clear Search"
              action={searchTerm ? () => setSearchTerm("") : undefined}
            />
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {searchTerm ? `Search Results (${filteredPrograms.length})` : "All Programs"}
                  </h2>
                  <p className="text-gray-400">
                    {searchTerm
                      ? `Found ${filteredPrograms.length} program${filteredPrograms.length !== 1 ? "s" : ""} matching "${searchTerm}"`
                      : `Discover ${filteredPrograms.length} comprehensive learning program${filteredPrograms.length !== 1 ? "s" : ""}`
                    }
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <ApperIcon name="Filter" className="w-4 h-4" />
                  <span>{filteredPrograms.length} Programs</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPrograms.map((program, index) => (
                  <motion.div
                    key={program.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProgramCard 
                      program={program} 
                      lectureCount={lectureCounts[program.Id] || 0}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default ProgramListPage