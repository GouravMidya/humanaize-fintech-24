import axios from "axios";

const signUp = async (formData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_NODEURL}/api/auth/signup`,
      formData
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

const login = async (formData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_NODEURL}/api/auth/login`,
      formData
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_NODEURL}/api/auth/check-email`,
      { email }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
export const getUsername = async () => {
  try {
    const token = localStorage.getItem("jwt");

    if (!token) {
      throw new Error("No token available");
    }

    const response = await axios.get(
      `${process.env.REACT_APP_NODEURL}/api/auth/user-details`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export { signUp, login };
