import axios from 'axios'
import type { userDetailItem, userCheckItem } from '@/models/user'
import { USER_LIST_SIZE } from '@/constant'

export async function getUsers(start: number, size: number = USER_LIST_SIZE): Promise<userDetailItem[]> {
  const response = await axios.get('/api/user/get', { params: { start, size } })
  return response.data
}

export async function getAllUsers(): Promise<userDetailItem[]> {
  const response = await axios.get('/api/user/all')
  return response.data
}

export async function getUserById(id: number): Promise<userDetailItem> {
  const response = await axios.get('/api/user/getById', { params: { id } })
  return response.data
}

export async function getUserByName(name: string): Promise<userDetailItem> {
  const response = await axios.get('/api/user/getByName', { params: { name } })
  return response.data
}

export async function userExistByName(name: string): Promise<boolean> {
  const response = await axios.get('/api/user/exist', { params: { name } })
  return response.data
}

export async function checkUser(user: userCheckItem): Promise<boolean> {
  const response = await axios.post('/api/user/check', user)
  return response.data
}

export async function addUser(user: userDetailItem): Promise<number> {
  const response = await axios.post('/api/user/add', user)
  return response.data
}

export async function updateUser(user: userDetailItem): Promise<number> {
  const response = await axios.post('/api/user/update', user)
  return response.data
}

export async function deleteUser(id: number): Promise<number> {
  const response = await axios.post('/api/user/delete', id)
  return response.data
}
