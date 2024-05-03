import dotenv from "dotenv";
dotenv.config();
import axios from "axios";

async function createUser(email, password) {
  const response = await axios.post(
    "https://dev-xq8ab6qdlhcv0xbh.us.auth0.com/dbconnections/signup",
    {
      client_id: process.env.CLIENT_ID,
      email: email,
      password: password,
      connection: "Username-Password-Authentication",
    },
  );

  return response;
}

async function loginUser(email, password) {
  const response = await axios.post(
    "https://dev-xq8ab6qdlhcv0xbh.us.auth0.com/oauth/token",
    {
      audience: "https://dev-xq8ab6qdlhcv0xbh.us.auth0.com/api/v2/",
      grant_type: "password",
      username: email,
      password: password,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      connection: "Username-Password-Authentication",
    },
  );
  return response;
}

export { createUser, loginUser };
