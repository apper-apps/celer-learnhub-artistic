// Mock data for blog posts/insights
const mockPosts = [
  {
    id: 1,
    title: "Getting Started with React Hooks",
    slug: "getting-started-react-hooks",
    content: "React Hooks revolutionize how we write React components by allowing us to use state and other React features in functional components...",
    excerpt: "Learn the fundamentals of React Hooks and how they can improve your development workflow.",
    author_id: 1,
    published_at: "2024-01-15T10:00:00Z",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    featured_image: "/images/react-hooks.jpg",
    tags: ["React", "JavaScript", "Frontend"],
    status: "published",
    views: 1250
  },
  {
    id: 2,
    title: "Advanced State Management Patterns",
    slug: "advanced-state-management-patterns",
    content: "Explore advanced patterns for managing complex application state using Redux, Context API, and custom hooks...",
    excerpt: "Deep dive into sophisticated state management techniques for scalable React applications.",
    author_id: 2,
    published_at: "2024-01-12T14:30:00Z",
    created_at: "2024-01-12T14:30:00Z",
    updated_at: "2024-01-12T14:30:00Z",
    featured_image: "/images/state-management.jpg",
    tags: ["React", "Redux", "State Management"],
    status: "published",
    views: 890
  },
  {
    id: 3,
    title: "Building Responsive Web Applications",
    slug: "building-responsive-web-applications",
    content: "Learn how to create responsive web applications that work seamlessly across all devices using modern CSS techniques...",
    excerpt: "Master responsive design principles and create applications that adapt to any screen size.",
    author_id: 1,
    published_at: "2024-01-08T09:15:00Z",
    created_at: "2024-01-08T09:15:00Z",
    updated_at: "2024-01-08T09:15:00Z",
    featured_image: "/images/responsive-design.jpg",
    tags: ["CSS", "Responsive Design", "Web Development"],
    status: "published",
    views: 2100
  },
  {
    id: 4,
    title: "Performance Optimization in React",
    slug: "performance-optimization-react",
    content: "Discover techniques to optimize your React applications for better performance, including memoization, lazy loading, and bundle splitting...",
    excerpt: "Essential performance optimization techniques every React developer should know.",
    author_id: 3,
    published_at: "2024-01-05T16:45:00Z",
    created_at: "2024-01-05T16:45:00Z",
    updated_at: "2024-01-05T16:45:00Z",
    featured_image: "/images/react-performance.jpg",
    tags: ["React", "Performance", "Optimization"],
    status: "published",
    views: 1560
  }
]

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'

class PostService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/posts`
  }

  async getAll() {
    try {
      // In a real application, this would make an HTTP request
      // const response = await fetch(this.baseURL)
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // return await response.json()
      
      // For now, return mock data with a simulated delay
      await new Promise(resolve => setTimeout(resolve, 500))
      return mockPosts.filter(post => post.status === 'published')
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw new Error('Failed to fetch posts')
    }
  }

  async getById(id) {
    try {
      // const response = await fetch(`${this.baseURL}/${id}`)
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // return await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 300))
      const post = mockPosts.find(p => p.id === parseInt(id))
      if (!post) {
        throw new Error('Post not found')
      }
      return post
    } catch (error) {
      console.error('Error fetching post:', error)
      throw new Error('Failed to fetch post')
    }
  }

  async getBySlug(slug) {
    try {
      // const response = await fetch(`${this.baseURL}/slug/${slug}`)
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // return await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 300))
      const post = mockPosts.find(p => p.slug === slug)
      if (!post) {
        throw new Error('Post not found')
      }
      return post
    } catch (error) {
      console.error('Error fetching post by slug:', error)
      throw new Error('Failed to fetch post')
    }
  }

  async create(postData) {
    try {
      // const response = await fetch(this.baseURL, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(postData)
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // return await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 400))
      const newPost = {
        id: mockPosts.length + 1,
        ...postData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        views: 0
      }
      mockPosts.push(newPost)
      return newPost
    } catch (error) {
      console.error('Error creating post:', error)
      throw new Error('Failed to create post')
    }
  }

  async update(id, postData) {
    try {
      // const response = await fetch(`${this.baseURL}/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify(postData)
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // return await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 400))
      const index = mockPosts.findIndex(p => p.id === parseInt(id))
      if (index === -1) {
        throw new Error('Post not found')
      }
      mockPosts[index] = {
        ...mockPosts[index],
        ...postData,
        updated_at: new Date().toISOString()
      }
      return mockPosts[index]
    } catch (error) {
      console.error('Error updating post:', error)
      throw new Error('Failed to update post')
    }
  }

  async delete(id) {
    try {
      // const response = await fetch(`${this.baseURL}/${id}`, {
      //   method: 'DELETE'
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // return { success: true }
      
      await new Promise(resolve => setTimeout(resolve, 300))
      const index = mockPosts.findIndex(p => p.id === parseInt(id))
      if (index === -1) {
        throw new Error('Post not found')
      }
      mockPosts.splice(index, 1)
      return { success: true }
    } catch (error) {
      console.error('Error deleting post:', error)
      throw new Error('Failed to delete post')
    }
  }

  async search(query) {
    try {
      // const response = await fetch(`${this.baseURL}/search?q=${encodeURIComponent(query)}`)
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // return await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 400))
      const searchTerm = query.toLowerCase()
      return mockPosts.filter(post => 
        post.status === 'published' && (
          post.title.toLowerCase().includes(searchTerm) ||
          post.content.toLowerCase().includes(searchTerm) ||
          post.excerpt.toLowerCase().includes(searchTerm) ||
          post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        )
      )
    } catch (error) {
      console.error('Error searching posts:', error)
      throw new Error('Failed to search posts')
    }
  }
}

export const postService = new PostService()
export default postService