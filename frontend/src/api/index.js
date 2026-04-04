// frontend/src/api/index.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
});

export const getZoneScore = (pincode) =>
  API.get(`/api/zones/score/${pincode}`).then((r) => r.data);

export const registerRider = (payload) =>
  API.post("/api/riders/register", payload).then((r) => r.data);

export const getRider = (id) =>
  API.get(`/api/riders/${id}`).then((r) => r.data);

export const getPayouts = (riderId) =>
  API.get(`/api/payouts/${riderId}`).then((r) => r.data);

export const runCompensationEngine = () =>
  API.post("/api/payouts/run-engine").then((r) => r.data);
