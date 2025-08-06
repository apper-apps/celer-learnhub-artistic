const API_BASE = '/api'

const waitlistService = {
async getAll() {
    // Mock data for now - replace with actual API call when backend is ready
    return [
      {
        id: 1,
        email: 'user1@example.com',
        name: 'John Doe',
        program: 'Advanced React',
        createdAt: '2024-01-15T10:00:00Z',
        status: 'pending'
      },
      {
        id: 2,
        email: 'user2@example.com', 
        name: 'Jane Smith',
        program: 'Node.js Mastery',
        createdAt: '2024-01-16T14:30:00Z',
        status: 'pending'
      },
      {
        id: 3,
        email: 'user3@example.com',
        name: 'Bob Johnson',
        program: 'Full Stack Development',
        createdAt: '2024-01-17T09:15:00Z',
        status: 'contacted'
      }
    ]
    
    // TODO: Implement actual API call when backend is ready
    // try {
    //   const response = await fetch(`${API_BASE}/waitlist`)
    //   if (!response.ok) {
    //     throw new Error(`HTTP error! status: ${response.status}`)
    //   }
    //   return await response.json()
    // } catch (error) {
    //   console.error('Error fetching waitlist:', error)
    //   return []
    // }
  },

  async getById(id) {
    try {
      const response = await fetch(`${API_BASE}/waitlist/${id}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching waitlist entry:', error)
      throw error
    }
  },

  async create(data) {
    try {
      const response = await fetch(`${API_BASE}/waitlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error creating waitlist entry:', error)
      throw error
    }
  },

  async update(id, data) {
    try {
      const response = await fetch(`${API_BASE}/waitlist/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error updating waitlist entry:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const response = await fetch(`${API_BASE}/waitlist/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Error deleting waitlist entry:', error)
      throw error
    }
  }
}

export { waitlistService }