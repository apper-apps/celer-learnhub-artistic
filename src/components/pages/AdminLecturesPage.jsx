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
import { lectureService } from "@/services/api/lectureService"
import { programService } from "@/services/api/programService"
import { toast } from "react-toastify"

const AdminLecturesPage = () => {
  const [lectures, setLectures] = useState([])
  const [filteredLectures, setFilteredLectures] = useState([])
  const [programs, setPrograms] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingLecture, setEditingLecture] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    program_id: "",
    title: "",
    content: "",
    category: "",
    level: "member",
    order: 1
  })

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const [lecturesData, programsData] = await Promise.all([
        lectureService.getAll(),
        programService.getAll()
      ])

      const sortedLectures = lecturesData.sort((a, b) => 
        a.program_id === b.program_id 
          ? a.order - b.order
          : new Date(b.created_at) - new Date(a.created_at)
      )

      setLectures(sortedLectures)
      setFilteredLectures(sortedLectures)
      setPrograms(programsData)

    } catch (err) {
      setError("Failed to load lectures")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredLectures(lectures)
    } else {
      const filtered = lectures.filter(lecture =>
        lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredLectures(filtered)
    }
  }, [searchTerm, lectures])

  const resetForm = () => {
    setFormData({
      program_id: programs[0]?.Id || "",
      title: "",
      content: "",
      category: "",
      level: "member",
      order: 1
    })
    setEditingLecture(null)
  }

  const handleOpenModal = (lecture = null) => {
    if (lecture) {
      setEditingLecture(lecture)
      setFormData({
        program_id: lecture.program_id,
        title: lecture.title,
        content: lecture.content,
        category: lecture.category,
        level: lecture.level,
        order: lecture.order
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
      if (editingLecture) {
        const updated = await lectureService.update(editingLecture.Id, {
          ...editingLecture,
          ...formData,
          program_id: parseInt(formData.program_id),
          order: parseInt(formData.order)
        })
        setLectures(prev => prev.map(l => l.Id === editingLecture.Id ? updated : l))
        toast.success("Lecture updated successfully!")
      } else {
        const created = await lectureService.create({
          ...formData,
          program_id: parseInt(formData.program_id),
          order: parseInt(formData.order),
          created_at: new Date().toISOString()
        })
        setLectures(prev => [created, ...prev])
        toast.success("Lecture created successfully!")
      }
      handleCloseModal()
    } catch (error) {
      toast.error("Failed to save lecture. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (lectureId) => {
    if (!confirm("Are you sure you want to delete this lecture?")) return

    try {
      await lectureService.delete(lectureId)
      setLectures(prev => prev.filter(l => l.Id !== lectureId))
      toast.success("Lecture deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete lecture")
    }
  }

  const getProgramTitle = (programId) => {
    const program = programs.find(p => p.Id === programId)
    return program?.title || "Unknown Program"
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
            <span className="text-white">Lectures</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                Lecture Management
              </h1>
              <p className="text-gray-400">
                Organize course content and lectures
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <SearchBar
                placeholder="Search lectures..."
                value={searchTerm}
                onChange={setSearchTerm}
                className="w-full sm:w-80"
              />
              <Button onClick={() => handleOpenModal()}>
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Lecture
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
              title: "Total Lectures",
              value: lectures.length,
              icon: "PlayCircle",
              color: "text-blue-400"
            },
            {
              title: "Member Lectures",
              value: lectures.filter(l => l.level === "member").length,
              icon: "Users",
              color: "text-green-400"
            },
            {
              title: "Master Lectures",
              value: lectures.filter(l => l.level === "master").length,
              icon: "Crown",
              color: "text-yellow-400"
            },
            {
              title: "Common Lectures",
              value: lectures.filter(l => l.level === "master_common").length,
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

        {/* Lectures Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ApperIcon name="PlayCircle" className="w-5 h-5 mr-2 text-primary" />
                Lectures ({filteredLectures.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredLectures.length === 0 ? (
                <Empty
                  title="No lectures found"
                  description={
                    searchTerm
                      ? "No lectures match your search criteria."
                      : "No lectures are available."
                  }
                  icon="PlayCircle"
                  actionLabel={searchTerm ? "Clear Search" : "Add Lecture"}
                  action={searchTerm ? () => setSearchTerm("") : () => handleOpenModal()}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Lecture</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Program</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Category</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Level</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Order</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Created</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLectures.map((lecture) => (
                        <tr key={lecture.Id} className="border-b border-secondary/50 hover:bg-surface/30 transition-colors duration-200">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                                <ApperIcon name="Play" className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-white font-medium line-clamp-1">
                                  {lecture.title}
                                </p>
                                <p className="text-gray-400 text-sm line-clamp-1">
                                  {lecture.content.substring(0, 50)}...
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300 text-sm">
                              {getProgramTitle(lecture.program_id)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                              {lecture.category}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              lecture.level === "master" 
                                ? "bg-yellow-500/20 text-yellow-400"
                                : lecture.level === "master_common"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}>
                              {lecture.level === "master_common" ? "Common" : lecture.level}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-400 text-sm">
                              #{lecture.order}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-400 text-sm">
                              {format(new Date(lecture.created_at), "MMM d, yyyy")}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenModal(lecture)}
                                className="p-2"
                              >
                                <ApperIcon name="Edit" className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(lecture.Id)}
                                className="p-2 text-red-400 hover:text-red-300"
                              >
                                <ApperIcon name="Trash2" className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Lecture Form Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingLecture ? "Edit Lecture" : "Create Lecture"}
        className="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Program
              </label>
              <select
                value={formData.program_id}
                onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Program</option>
                {programs.map((program) => (
                  <option key={program.Id} value={program.Id}>
                    {program.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-secondary rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="member">Member</option>
                <option value="master">Master</option>
                <option value="master_common">Master Common</option>
              </select>
            </div>
          </div>

          <FormField
            label="Lecture Title"
            id="lecture-title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter lecture title"
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Category"
              id="lecture-category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Getting Started, Advanced"
              required
            />

            <FormField
              label="Order"
              id="lecture-order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter lecture content"
              rows={6}
              className="w-full px-4 py-3 bg-surface border border-secondary rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
              required
            />
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
              {isSubmitting ? "Saving..." : editingLecture ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default AdminLecturesPage