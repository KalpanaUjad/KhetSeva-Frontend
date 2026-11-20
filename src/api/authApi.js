import API from './axiosConfig'

export const registerFarmer = (data) =>
  API.post('/auth/register', data)

export const loginFarmer = (data) =>
  API.post('/auth/login', data)

export const loginOwner = (data) =>
  API.post('/auth/owner/login', data)

export const logoutUser = () =>
  API.post('/auth/logout')
