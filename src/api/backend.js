const axios = require('axios').default;

export const instance = (pathTime, pathDirection) => {
  return axios.create({
    baseURL: 'https://mate.academy/students-api',
    headers: {'X-Custom-Header': 'foobar'},
    params: {
      time: pathTime,
      direction: pathDirection,
    }
  });
}

