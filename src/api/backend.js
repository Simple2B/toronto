import domain from '../api/domain.json';
const axios = require('axios').default;

export const instance = (make, model, year, gasType, distance, town) => {
  console.log('make', make);
  console.log('model', model);
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
      make,
      model,
      year,
      gasType,
      distance,
      town
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
