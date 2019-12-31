import Axios from "axios";

const baseUrl = 'http://localhost:5000';

export const addNote = (data) => {
  return Axios.post(`${baseUrl}/api/add-note`, data);
}

export const getNotes = () => {
  return Axios.get(`${baseUrl}/api/notes`);
}