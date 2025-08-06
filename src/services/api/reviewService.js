// Mock delay function for API simulation
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    author_id: 1,
    program_id: 1,
    lecture_id: 1,
    rating: 5,
    title: "Excellent Program!",
    content: "This program has been incredibly helpful. The lectures are well-structured and easy to follow.",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    author_name: "John Doe",
    author_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    author_id: 2,
    program_id: 2,
    lecture_id: 3,
    rating: 4,
    title: "Great Content",
    content: "Really enjoyed the practical examples and hands-on approach. Would recommend to others.",
    created_at: "2024-01-18T14:22:00Z",
    updated_at: "2024-01-18T14:22:00Z",
    author_name: "Sarah Wilson",
    author_avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    author_id: 3,
    program_id: 1,
    lecture_id: 2,
    rating: 5,
    title: "Outstanding Quality",
    content: "The depth of knowledge shared is remarkable. This has significantly improved my skills.",
    created_at: "2024-01-20T09:15:00Z",
    updated_at: "2024-01-20T09:15:00Z",
    author_name: "Michael Chen",
    author_avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 4,
    author_id: 1,
    program_id: 3,
    lecture_id: 5,
    rating: 4,
    title: "Very Helpful",
    content: "Clear explanations and good pacing. The instructor knows how to engage the audience.",
    created_at: "2024-01-22T16:45:00Z",
    updated_at: "2024-01-22T16:45:00Z",
    author_name: "John Doe",
    author_avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 5,
    author_id: 4,
    program_id: 2,
    lecture_id: 4,
    rating: 3,
    title: "Good but Could Be Better",
    content: "The content is solid but some sections feel rushed. Overall still valuable.",
    created_at: "2024-01-25T11:30:00Z",
    updated_at: "2024-01-25T11:30:00Z",
    author_name: "Emma Davis",
    author_avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
  }
]

export const reviewService = {
  // Get all reviews
  async getAll() {
    await delay(800) // Simulate API delay
    return [...mockReviews]
  },

  // Get review by ID
  async getById(id) {
    await delay(600)
    const review = mockReviews.find(r => r.id === parseInt(id))
    if (!review) {
      throw new Error('Review not found')
    }
    return review
  },

  // Get reviews by program ID
  async getByProgramId(programId) {
    await delay(700)
    return mockReviews.filter(r => r.program_id === parseInt(programId))
  },

  // Get reviews by user ID
  async getByUserId(userId) {
    await delay(600)
    return mockReviews.filter(r => r.author_id === parseInt(userId))
  },

  // Create new review
  async create(reviewData) {
    await delay(1000)
    const newReview = {
      id: Math.max(...mockReviews.map(r => r.id)) + 1,
      ...reviewData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    mockReviews.push(newReview)
    return newReview
  },

  // Update review
  async update(id, updateData) {
    await delay(900)
    const index = mockReviews.findIndex(r => r.id === parseInt(id))
    if (index === -1) {
      throw new Error('Review not found')
    }
    
    mockReviews[index] = {
      ...mockReviews[index],
      ...updateData,
      updated_at: new Date().toISOString()
    }
    return mockReviews[index]
  },

  // Delete review
  async delete(id) {
    await delay(700)
    const index = mockReviews.findIndex(r => r.id === parseInt(id))
    if (index === -1) {
      throw new Error('Review not found')
    }
    
    const deleted = mockReviews.splice(index, 1)[0]
    return deleted
  },

  // Get review statistics
  async getStats() {
    await delay(500)
    const totalReviews = mockReviews.length
    const averageRating = mockReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    const ratingDistribution = mockReviews.reduce((acc, r) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1
      return acc
    }, {})

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      ratingDistribution
    }
  }
}