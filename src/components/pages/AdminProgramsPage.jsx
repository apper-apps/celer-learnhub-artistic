import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { format } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import SearchBar from "@/components/molecules/SearchBar"
import FormField from "@/components/molecules/FormField"
import Modal from "@/components/molecules/Modal"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { programService } from "@/services/api/programService"
import { lectureService } from "@/services/api/lectureService"
import { toast } from "react-toastify"

const AdminProgramsPage = () => {
  const [programs, setPrograms] = useState([])
  const [filteredPrograms, setFilteredPrograms] = useState([])
  const [lectureCounts, setLectureCounts] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    description: "",
    has_common_course: false
  })

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [programsData, lecturesData] = await Promise.all([
        programService.getAll(),
        lectureService.getAll()
      ])

      const sortedPrograms = programsData.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )

      setPrograms(sortedPrograms)
      setFilteredPrograms(sortedPrograms)

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
        program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        program.slug.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredPrograms(filtered)
    }
  }, [searchTerm, programs])

  const resetForm = () => {
    setFormData({
      slug: "",
      title: "",
      description: "",
      has_common_course: false
    })
    setEditingProgram(null)
  }

  const handleOpenModal = (program = null) => {
    if (program) {
      setEditingProgram(program)
      setFormData({
        slug: program.slug,
        title: program.title,
        description: program.description,
        has_common_course: program.has_common_course
      })
    } else {
      resetForm()
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingProgram) {
        const updated = await programService.update(editingProgram.Id, {
          ...editingProgram,
          ...formData
        })
        setPrograms(prev => prev.map(p => p.Id === editingProgram.Id ? updated : p))
        toast.success("Program updated successfully!")
      } else {
        const created = await programService.create({
          ...formData,
          created_at: new Date().toISOString()
        })
        setPrograms(prev => [created, ...prev])
        toast.success("Program created successfully!")
      }
      handleCloseModal()
    } catch (error) {
      toast.error("Failed to save program. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (programId) => {
    if (!confirm("Are you sure you want to delete this program?")) return

    try {
      await programService.delete(programId)
      setPrograms(prev => prev.filter(p => p.Id !== programId))
      toast.success("Program deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete program")
    }
  }

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-dark py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-6 text-sm">
            <Link to="/admin" className="text-gray-400 hover:text-primary transition-colors duration-200">
              Admin
            </Link>
            <ApperIcon name="ChevronRight" className="w-4 h-4 text-gray-500" />
            <span className="text-white">Programs</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                Program Management
              </h1>
              <p className="text-gray-400">
                Create and manage learning programs
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <SearchBar
                placeholder="Search programs..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full sm:w-80"
              />
              <Button onClick={() => handleOpenModal()}>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Program
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            {
              title: "Total Programs",
              value: programs.length,
              icon: "BookOpen",
              color: "text-blue-400"
            },
            {
              title: "Member Programs",
              value: programs.filter(p => p.slug === "membership").length,
              icon: "Users",
              color: "text-green-400"
            },
            {
              title: "Master Programs",
              value: programs.filter(p => p.slug === "text-influencer").length,
              icon: "Crown",
              color: "text-yellow-400"
            },
            {
              title: "Common Courses",
              value: programs.filter(p => p.has_common_course).length,
              icon: "Share2",
              color: "text-purple-400"
            }
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mx-auto mb-3 ${stat.color.replace("text-", "bg-")}`}>
                  <ApperIcon name={stat.icon} className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="BookOpen" className="w-5 h-5 mr-2 text-primary" />
                Programs ({filteredPrograms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredPrograms.length === 0 ? (
                <Empty
                  title="No programs found"
                  description={
                    searchTerm
                      ? "No programs match your search criteria."
                      : "No programs are available."
                  }
                  icon="BookOpen"
                  actionLabel={searchTerm ? "Clear Search" : "Add Program"}
                  action={searchTerm ? () => setSearchTerm("") : () => handleOpenModal()}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPrograms.map((program) => (
                    <Card key={program.Id} className="group">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl ${program.slug === "membership" ? "bg-blue-500/20" : "bg-yellow-500/20"} flex items-center justify-center mb-4`}>
                            <ApperIcon 
                              name={program.slug === "membership" ? "BookOpen" : "Crown"} 
                              className={`w-6 h-6 ${program.slug === "membership" ? "text-blue-400" : "text-yellow-400"}`} 
                            />
                          </div>
                          {program.has_common_course && (
                            <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                              Common
                            </span>
                          )}
                        </div>
                        <CardTitle className="line-clamp-1">{program.title}</CardTitle>
                        <p className="text-sm text-gray-400 line-clamp-1">{program.slug}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                          {program.description}
                        </p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="text-sm text-gray-400">
                            <ApperIcon name="PlayCircle" className="w-4 h-4 inline mr-1" />
                            {lectureCounts[program.Id] || 0} lectures
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(program.created_at), "MMM d, yyyy")}
                          </div>
                        </div>

                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenModal(program)}
                            className="p-2"
                          >
                            <ApperIcon name="Edit" className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(program.Id)}
                            className="p-2 text-red-400 hover:text-red-300"
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Program Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingProgram ? "Edit Program" : "Create Program"}
        className="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Program Slug"
            id="program-slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="e.g., membership, text-influencer"
            required
          />
          
          <FormField
            label="Program Title"
            id="program-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter program title"
            required
          />
          
          <FormField
            label="Description"
            id="program-description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter program description"
            required
          />
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="has-common-course"
              checked={formData.has_common_course}
              onChange={(e) => setFormData({ ...formData, has_common_course: e.target.checked })}
              className="w-4 h-4 text-primary bg-surface border-secondary rounded focus:ring-primary"
            />
            <label htmlFor="has-common-course" className="text-sm text-gray-300">
              Has common course content
            </label>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? "Saving..." : editingProgram ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminProgramsPage