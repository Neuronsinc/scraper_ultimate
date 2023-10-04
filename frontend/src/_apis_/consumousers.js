import axios from 'axios';

const apiUrl = `${process.env.REACT_APP_APIBACKEND}/usarios`;

export async function fetchData() {
  const response = await axios.get(apiUrl);
  return response.data;
}
