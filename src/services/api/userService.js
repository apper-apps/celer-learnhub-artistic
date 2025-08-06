// Mock user data for development
const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin',
    isAdmin: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2023-01-15T08:30:00Z',
    lastActive: '2024-01-20T14:22:00Z',
    status: 'active'
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    role: 'user',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b167?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2023-02-22T10:15:00Z',
    lastActive: '2024-01-19T16:45:00Z',
    status: 'active'
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'user',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2023-03-10T14:20:00Z',
    lastActive: '2024-01-18T09:30:00Z',
    status: 'active'
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    role: 'moderator',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2023-04-05T11:45:00Z',
    lastActive: '2024-01-20T13:15:00Z',
    status: 'active'
  },
  {
    id: 5,
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'user',
    isAdmin: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    joinedAt: '2023-05-18T16:30:00Z',
    lastActive: '2024-01-17T11:20:00Z',
    status: 'inactive'
  }
];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  // Get all users
  async getUsers() {
    try {
      await delay(500); // Simulate network delay
      return {
        success: true,
        data: [...mockUsers],
        total: mockUsers.length
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error('Failed to fetch users');
    }
  },

  // Get user by ID
  async getUserById(id) {
    try {
      await delay(300);
      const user = mockUsers.find(u => u.id === parseInt(id));
      if (!user) {
        throw new Error('User not found');
      }
      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Update user (for admin toggle and other updates)
  async updateUser(id, updates) {
    try {
      await delay(400);
      const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update the user
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates,
        // Ensure role consistency with admin status
        role: updates.isAdmin ? 'admin' : (mockUsers[userIndex].role === 'admin' ? 'user' : mockUsers[userIndex].role)
      };

      return {
        success: true,
        data: mockUsers[userIndex],
        message: 'User updated successfully'
      };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      await delay(400);
      const userIndex = mockUsers.findIndex(u => u.id === parseInt(id));
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Don't allow deleting the last admin
      const remainingAdmins = mockUsers.filter(u => u.id !== parseInt(id) && u.isAdmin);
      if (mockUsers[userIndex].isAdmin && remainingAdmins.length === 0) {
        throw new Error('Cannot delete the last admin user');
      }

      const deletedUser = mockUsers[userIndex];
      mockUsers.splice(userIndex, 1);

      return {
        success: true,
        data: deletedUser,
        message: 'User deleted successfully'
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Toggle admin status
  async toggleAdmin(id) {
    try {
      const user = mockUsers.find(u => u.id === parseInt(id));
      if (!user) {
        throw new Error('User not found');
      }

      // Don't allow removing admin from the last admin
      if (user.isAdmin) {
        const otherAdmins = mockUsers.filter(u => u.id !== parseInt(id) && u.isAdmin);
        if (otherAdmins.length === 0) {
          throw new Error('Cannot remove admin privileges from the last admin');
        }
      }

      return await this.updateUser(id, { 
        isAdmin: !user.isAdmin 
      });
    } catch (error) {
      console.error('Error toggling admin status:', error);
      throw error;
    }
  },

  // Search users
  async searchUsers(query) {
    try {
      await delay(300);
      const filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.role.toLowerCase().includes(query.toLowerCase())
      );

      return {
        success: true,
        data: filteredUsers,
        total: filteredUsers.length
      };
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Failed to search users');
    }
  }
};