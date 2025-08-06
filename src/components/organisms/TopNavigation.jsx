import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import AuthButtons from "@/components/organisms/AuthButtons"

const TopNavigation = ({ currentUser, onLogin, onLogout }) => {
  const [isProgramDropdownOpen, setIsProgramDropdownOpen] = useState(false)
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const programItems = [
    { title: "All Programs", path: "/program" },
    { title: "Membership", path: "/program/membership" },
    { title: "Master Course", path: "/program/text-influencer" }
  ]

  const profileItems = [
    { title: "Profile", path: "/profile", icon: "User" },
    { title: "Sign Out", action: onLogout, icon: "LogOut" }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-effect border-b border-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-electric rounded-lg flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">LearnHub Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                isActive("/") ? "text-primary" : "text-gray-300"
              }`}
            >
              Home
            </Link>

            {/* Program Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsProgramDropdownOpen(true)}
              onMouseLeave={() => setIsProgramDropdownOpen(false)}
            >
              <button
                className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname.startsWith("/program") ? "text-primary" : "text-gray-300"
                }`}
              >
                <span>Program</span>
                <ApperIcon name="ChevronDown" className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {isProgramDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-48 bg-surface/95 backdrop-blur-lg rounded-xl border border-secondary/50 shadow-lg py-2"
                  >
                    {programItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-secondary/50 transition-colors duration-200"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/insight"
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                isActive("/insight") ? "text-primary" : "text-gray-300"
              }`}
            >
              Insight
            </Link>

            <Link
              to="/reviews"
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                isActive("/reviews") ? "text-primary" : "text-gray-300"
              }`}
            >
              Reviews
            </Link>

            {currentUser && (
              <Link
                to="/profile"
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  isActive("/profile") ? "text-primary" : "text-gray-300"
                }`}
              >
                Profile
              </Link>
            )}

            {currentUser?.is_admin && (
              <Link
                to="/admin"
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  location.pathname.startsWith("/admin") ? "text-primary" : "text-gray-300"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center">
            <AuthButtons 
              currentUser={currentUser} 
              onLogin={onLogin} 
              onLogout={onLogout}
            />
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden overflow-hidden bg-surface/95 backdrop-blur-lg rounded-lg mt-2 mb-4 border border-secondary/50"
            >
              <div className="px-4 py-4 space-y-4">
                <Link
                  to="/"
                  className={`block py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                    isActive("/") ? "text-primary" : "text-gray-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>

                <div className="space-y-2">
                  <span className="block py-2 text-sm font-medium text-gray-300">Programs</span>
                  {programItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.path}
                      className="block py-2 pl-4 text-sm text-gray-300 hover:text-primary transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>

                <Link
                  to="/insight"
                  className={`block py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                    isActive("/insight") ? "text-primary" : "text-gray-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Insight
                </Link>

                <Link
                  to="/reviews"
                  className={`block py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                    isActive("/reviews") ? "text-primary" : "text-gray-300"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Reviews
                </Link>

                {currentUser && (
                  <Link
                    to="/profile"
                    className={`block py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                      isActive("/profile") ? "text-primary" : "text-gray-300"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )}

                {currentUser?.is_admin && (
                  <Link
                    to="/admin"
                    className={`block py-2 text-sm font-medium transition-colors duration-200 hover:text-primary ${
                      location.pathname.startsWith("/admin") ? "text-primary" : "text-gray-300"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                <div className="border-t border-secondary pt-4 mt-4">
                  <AuthButtons 
                    currentUser={currentUser} 
                    onLogin={onLogin} 
                    onLogout={onLogout}
                    mobile
                    onAction={() => setIsMobileMenuOpen(false)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default TopNavigation