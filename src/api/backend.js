import domain from '../api/domain.json';
const axios = require('axios').default;

export const instance = (year, make, model, town, start, end) => {
  const token = localStorage.getItem("token") ?? "";

  return axios.create({
    Authorization: `Bearer ${token}`,
    baseURL: domain.REACT_DOMAIN,
    headers: {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "*"
  },
    params: {
      year: year,
      make: make,
      model: model,
      town: town,
      start: start,
      end: end,
    },
  });
}

export const authInstance = axios.create({
  baseURL: domain.REACT_DOMAIN,
  headers: {
    "Content-Type": "multipart/form-data",
    // 'Access-Control-Allow-Origin' : '*',
  },
});
