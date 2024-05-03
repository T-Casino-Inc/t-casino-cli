import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

async function signUp(id) {
  try {
    const response = await axios.post(` ${process.env.EXPRESS_URL}/signup`, {
      id
    });
    console.log(response.data);
  } catch (error) {
    console.error("Error on Login", error);
  }
}

async function getBalance(token) {
  try {
    const response = await axios.get(`${process.env.EXPRESS_URL}/getBalance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error on getBalance", error);
  }
}

async function mathPatchBalance(token, bitGain, bitLoss) {
  try {
    const response = await axios.patch(
      `${process.env.EXPRESS_URL}/patchM`,
      {
        bitBalance: bitGain,
        bitLoss: bitLoss,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error on patchBalance", error);
  }
}
async function gamePatchBalance(token, bitGain, bitLoss) {
  try {
    const response = await axios.patch(
      `${process.env.EXPRESS_URL}/patchG`,
      {
        bitBalance: bitGain,
        bitLoss: bitLoss,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error on patchBalance", error);
  }
}

export default { signUp, getBalance, gamePatchBalance, mathPatchBalance };
