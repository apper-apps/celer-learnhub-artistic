import React, { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import HomePage from "@/components/pages/HomePage"
import ProgramListPage from "@/components/pages/ProgramListPage"
import ProgramDetailPage from "@/components/pages/ProgramDetailPage"
import LectureViewPage from "@/components/pages/LectureViewPage"
import InsightPage from "@/components/pages/InsightPage"
import PostDetailPage from "@/components/pages/PostDetailPage"
import ReviewsPage from "@/components/pages/ReviewsPage"
import ProfilePage from "@/components/pages/ProfilePage"
import AdminPage from "@/components/pages/AdminPage"
import AdminUsersPage from "@/components/pages/AdminUsersPage"
import AdminProgramsPage from "@/components/pages/AdminProgramsPage"
import AdminLecturesPage from "@/components/pages/AdminLecturesPage"
import { seedData } from "@/services/api/seedService"

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Seed data on app initialization
        await seedData()
        
        // Check for existing user session
        const savedUser = localStorage.getItem("currentUser")
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error("Failed to initialize app:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleLogin = (userData) => {
    setCurrentUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem("currentUser")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        <Layout currentUser={currentUser} onLogin={handleLogin} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/program" element={<ProgramListPage />} />
            <Route path="/program/:slug" element={<ProgramDetailPage currentUser={currentUser} />} />
            <Route path="/lecture/:id" element={<LectureViewPage currentUser={currentUser} />} />
            <Route path="/insight" element={<InsightPage />} />
            <Route path="/insight/:slug" element={<PostDetailPage />} />
            <Route path="/reviews" element={<ReviewsPage currentUser={currentUser} />} />
            {currentUser && <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />}
{currentUser?.is_admin && (
              <>
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />
                <Route path="/admin/programs" element={<AdminProgramsPage />} />
                <Route path="/admin/lectures" element={<AdminLecturesPage />} />
              </>
            )}
          </Routes>
        </Layout>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  )
}

export default App