import axios from "axios";

const API = axios.create({
  baseURL: "https://local-sago-backend.onrender.com/api/",
});

export default API;