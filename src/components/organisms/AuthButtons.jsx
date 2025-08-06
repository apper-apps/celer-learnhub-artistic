import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import Modal from "@/components/molecules/Modal"
import FormField from "@/components/molecules/FormField"
import { userService } from "@/services/api/userService"
import { toast } from "react-toastify"

const AuthButtons = ({ currentUser, onLogin, onLogout, mobile = false, onAction }) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signUpForm, setSignUpForm] = useState({ email: "", password: "", confirmPassword: "" })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const users = await userService.getAll()
      const user = users.find(u => u.email === loginForm.email)
      
      if (!user) {
        toast.error("Invalid email or password")
        return
      }

      onLogin(user)
      setIsLoginModalOpen(false)
      setLoginForm({ email: "", password: "" })
      toast.success("Successfully logged in!")
      
      if (onAction) onAction()
    } catch (error) {
      toast.error("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (signUpForm.password !== signUpForm.confirmPassword) {
      toast.error("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const newUser = {
        email: signUpForm.email,
        role: "student",
        master_cohort: "",
        is_admin: false,
        created_at: new Date().toISOString()
      }

      const createdUser = await userService.create(newUser)
      onLogin(createdUser)
      setIsSignUpModalOpen(false)
      setSignUpForm({ email: "", password: "", confirmPassword: "" })
      toast.success("Account created successfully!")
      
      if (onAction) onAction()
    } catch (error) {
      toast.error("Sign up failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    onLogout()
    setIsAvatarDropdownOpen(false)
    toast.success("Successfully logged out!")
    if (onAction) onAction()
  }

  if (currentUser) {
    const avatarLetter = currentUser.email?.charAt(0).toUpperCase() || "U"
    
    if (mobile) {
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-3 py-2">
            <div className="w-8 h-8 bg-gradient-electric rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">{avatarLetter}</span>
            </div>
            <span className="text-gray-300 text-sm">{currentUser.email}</span>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
            <ApperIcon name="LogOut" className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      )
    }

    return (
      <div className="relative">
        <button
          onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
          className="flex items-center space-x-2 p-1 rounded-full hover:bg-secondary/50 transition-colors duration-200"
        >
          <div className="w-8 h-8 bg-gradient-electric rounded-full flex items-center justify-center ring-2 ring-transparent hover:ring-primary transition-all duration-200">
            <span className="text-white text-sm font-medium">{avatarLetter}</span>
          </div>
        </button>

        <AnimatePresence>
          {isAvatarDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsAvatarDropdownOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-48 bg-surface/95 backdrop-blur-lg rounded-xl border border-secondary/50 shadow-lg py-2 z-20"
              >
                <div className="px-4 py-2 border-b border-secondary/50">
                  <p className="text-sm text-gray-300 truncate">{currentUser.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{currentUser.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-secondary/50 transition-colors duration-200 flex items-center space-x-2"
                >
                  <ApperIcon name="LogOut" className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (mobile) {
    return (
      <div className="space-y-3">
        <Button 
          onClick={() => { setIsLoginModalOpen(true); if (onAction) onAction() }} 
          variant="outline" 
          size="sm" 
          className="w-full"
        >
          Log In
        </Button>
        <Button 
          onClick={() => { setIsSignUpModalOpen(true); if (onAction) onAction() }} 
          size="sm" 
          className="w-full"
        >
          Sign Up
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center space-x-3">
        <Button onClick={() => setIsLoginModalOpen(true)} variant="ghost" size="sm">
          Log In
        </Button>
        <Button onClick={() => setIsSignUpModalOpen(true)} size="sm">
          Sign Up
        </Button>
      </div>

      {/* Login Modal */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        title="Welcome Back"
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <FormField
            label="Email Address"
            type="email"
            id="login-email"
            value={loginForm.email}
            onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            required
          />
          <FormField
            label="Password"
            type="password"
            id="login-password"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ApperIcon name="LogIn" className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </Modal>

      {/* Sign Up Modal */}
      <Modal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
        title="Create Account"
      >
        <form onSubmit={handleSignUp} className="space-y-4">
          <FormField
            label="Email Address"
            type="email"
            id="signup-email"
            value={signUpForm.email}
            onChange={(e) => setSignUpForm({ ...signUpForm, email: e.target.value })}
            required
          />
          <FormField
            label="Password"
            type="password"
            id="signup-password"
            value={signUpForm.password}
            onChange={(e) => setSignUpForm({ ...signUpForm, password: e.target.value })}
            required
          />
          <FormField
            label="Confirm Password"
            type="password"
            id="signup-confirm-password"
            value={signUpForm.confirmPassword}
            onChange={(e) => setSignUpForm({ ...signUpForm, confirmPassword: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </Modal>
    </>
  )
}

export default AuthButtons