const API_BASE = '/api';

export const programService = {
  // Get all programs
  async getPrograms() {
    try {
      const response = await fetch(`${API_BASE}/programs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  // Get program by ID
  async getProgramById(id) {
    try {
      const response = await fetch(`${API_BASE}/programs/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching program:', error);
      throw error;
    }
  },

  // Get program by slug
  async getProgramBySlug(slug) {
    try {
      const response = await fetch(`${API_BASE}/programs/slug/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching program by slug:', error);
      throw error;
    }
  },

  // Create new program
  async createProgram(programData) {
    try {
      const response = await fetch(`${API_BASE}/programs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },

  // Update program
  async updateProgram(id, programData) {
    try {
      const response = await fetch(`${API_BASE}/programs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating program:', error);
      throw error;
    }
  },

  // Delete program
  async deleteProgram(id) {
    try {
      const response = await fetch(`${API_BASE}/programs/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting program:', error);
      throw error;
    }
  },

  // Get program statistics
  async getProgramStats() {
    try {
      const response = await fetch(`${API_BASE}/programs/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching program stats:', error);
      throw error;
    }
  },
};