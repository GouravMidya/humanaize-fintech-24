import axios from 'axios';

const signUp = async (formData) => {
  try {
    const response = await axios.post(`http://localhost:8001/signup`, formData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

const login = async (formData) => {
  try {
    const response = await axios.post(`http://localhost:8001/login`, formData);
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await axios.post(`http://localhost:8001/check-email`, { email });
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const getUsername = async () => {
  try {
    const token = localStorage.getItem('jwt');

    if (!token) {
      throw new Error('No token available');
    }

    const response = await axios.get('http://localhost:8001/user-details', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export { signUp, login };
