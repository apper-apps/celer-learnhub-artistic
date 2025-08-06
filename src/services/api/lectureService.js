const API_BASE = '/api';

export const lectureService = {
  // Get all lectures
  async getLectures() {
    try {
      const response = await fetch(`${API_BASE}/lectures`, {
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
      console.error('Error fetching lectures:', error);
      throw error;
    }
  },

  // Get lecture by ID
  async getLectureById(id) {
    try {
      const response = await fetch(`${API_BASE}/lectures/${id}`, {
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
      console.error('Error fetching lecture:', error);
      throw error;
    }
  },

  // Get lectures by program ID
  async getLecturesByProgram(programId) {
    try {
      const response = await fetch(`${API_BASE}/programs/${programId}/lectures`, {
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
      console.error('Error fetching lectures by program:', error);
      throw error;
    }
  },

  // Get lectures by program slug
  async getLecturesByProgramSlug(slug) {
    try {
      const response = await fetch(`${API_BASE}/programs/slug/${slug}/lectures`, {
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
      console.error('Error fetching lectures by program slug:', error);
      throw error;
    }
  },

  // Create new lecture
  async createLecture(lectureData) {
    try {
      const response = await fetch(`${API_BASE}/lectures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(lectureData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating lecture:', error);
      throw error;
    }
  },

  // Update lecture
  async updateLecture(id, lectureData) {
    try {
      const response = await fetch(`${API_BASE}/lectures/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(lectureData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating lecture:', error);
      throw error;
    }
  },

  // Delete lecture
  async deleteLecture(id) {
    try {
      const response = await fetch(`${API_BASE}/lectures/${id}`, {
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
      console.error('Error deleting lecture:', error);
      throw error;
    }
  },

  // Get lecture statistics
  async getLectureStats() {
    try {
      const response = await fetch(`${API_BASE}/lectures/stats`, {
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
      console.error('Error fetching lecture stats:', error);
      throw error;
    }
  },

  // Mark lecture as completed for user
  async markLectureCompleted(lectureId) {
    try {
      const response = await fetch(`${API_BASE}/lectures/${lectureId}/complete`, {
        method: 'POST',
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
      console.error('Error marking lecture as completed:', error);
      throw error;
    }
  },

  // Get user's lecture progress
  async getLectureProgress(lectureId) {
    try {
      const response = await fetch(`${API_BASE}/lectures/${lectureId}/progress`, {
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
      console.error('Error fetching lecture progress:', error);
      throw error;
    }
  },
};