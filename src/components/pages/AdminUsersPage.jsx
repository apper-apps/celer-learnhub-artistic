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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card"
import { userService } from "@/services/api/userService"
import { toast } from "react-toastify"

const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const loadData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const usersData = await userService.getAll()
      
      // Sort users by creation date (newest first)
      const sortedUsers = usersData.sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )

      setUsers(sortedUsers)
      setFilteredUsers(sortedUsers)

    } catch (err) {
      setError("Failed to load users")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (!searchTerm) {
      setFilteredUsers(users)
    } else {
      const filtered = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.master_cohort && user.master_cohort.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredUsers(filtered)
    }
  }, [searchTerm, users])

  const handleToggleAdmin = async (userId) => {
    try {
      const user = users.find(u => u.Id === userId)
      if (!user) return

      const updatedUser = await userService.update(userId, {
        ...user,
        is_admin: !user.is_admin
      })

      setUsers(prev =>
        prev.map(u => u.Id === userId ? updatedUser : u)
      )

      toast.success(`Admin status ${updatedUser.is_admin ? 'granted' : 'revoked'} for ${user.email}`)
    } catch (error) {
      toast.error("Failed to update admin status")
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    try {
      await userService.delete(userId)
      setUsers(prev => prev.filter(u => u.Id !== userId))
      toast.success("User deleted successfully")
    } catch (error) {
      toast.error("Failed to delete user")
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
            <span className="text-white">Users</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">
                User Management
              </h1>
              <p className="text-gray-400">
                Manage user accounts, roles, and permissions
              </p>
            </div>

            <SearchBar
              placeholder="Search users..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="w-full sm:w-80"
            />
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
              title: "Total Users",
              value: users.length,
              icon: "Users",
              color: "text-blue-400"
            },
            {
              title: "Admin Users",
              value: users.filter(u => u.is_admin).length,
              icon: "Shield",
              color: "text-purple-400"
            },
            {
              title: "Student Users",
              value: users.filter(u => u.role === "student").length,
              icon: "GraduationCap",
              color: "text-green-400"
            },
            {
              title: "Master Users",
              value: users.filter(u => u.role === "master").length,
              icon: "Crown",
              color: "text-yellow-400"
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

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <ApperIcon name="Users" className="w-5 h-5 mr-2 text-primary" />
                  Users ({filteredUsers.length})
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <Empty
                  title="No users found"
                  description={
                    searchTerm
                      ? "No users match your search criteria."
                      : "No users are available."
                  }
                  icon="Users"
                  actionLabel="Clear Search"
                  action={searchTerm ? () => setSearchTerm("") : undefined}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-secondary">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Cohort</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Joined</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.Id} className="border-b border-secondary/50 hover:bg-surface/30 transition-colors duration-200">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gradient-electric rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {user.email?.charAt(0).toUpperCase() || "U"}
                                </span>
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {user.email?.split("@")[0] || "Unknown"}
                                </p>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === "master" 
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-blue-500/20 text-blue-400"
                            }`}>
                              {user.role || "Student"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300 text-sm">
                              {user.master_cohort || "-"}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="text-green-400 text-sm">Active</span>
                              {user.is_admin && (
                                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                                  Admin
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-400 text-sm">
                              {format(new Date(user.created_at), "MMM d, yyyy")}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleAdmin(user.Id)}
                                className="p-2"
                              >
                                <ApperIcon 
                                  name={user.is_admin ? "ShieldOff" : "Shield"} 
                                  className={`w-4 h-4 ${user.is_admin ? "text-purple-400" : "text-gray-400"}`} 
                                />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user.Id)}
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
    </div>
  )
}

export default AdminUsersPage