import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function signUp(token) {
  try {
    const response = await axios.get(` ${process.env.EXPRESS_URL}/signup`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error on Login", error);
  }
}

async function login(token) {
  try {
    const response = await axios.get(`${process.env.EXPRESS_URL}/login`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error on login", error);
  }
}

export { signUp, login };
