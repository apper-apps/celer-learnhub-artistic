import React from "react"
import TopNavigation from "@/components/organisms/TopNavigation"

const Layout = ({ children, currentUser, onLogin, onLogout }) => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation 
        currentUser={currentUser} 
        onLogin={onLogin} 
        onLogout={onLogout}
      />
      
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

export default Layout