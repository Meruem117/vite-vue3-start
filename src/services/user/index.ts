import axios from 'axios'
import { userItem, userCheckItem } from '@/models/user'
import { USER_LIST_SIZE } from '@/constant'

export async function getUsers(start: number, size: number = USER_LIST_SIZE): Promise<userItem[]> {
  const response = await axios.get('/api/user/get', { params: { start, size } })
  return response.data
}

export async function getAllUsers(): Promise<userItem[]> {
  const response = await axios.get('/api/user/all')
  return response.data
}

export async function getUserById(id: number): Promise<userItem> {
  const response = await axios.get('/api/user/getById', { params: { id } })
  return response.data
}

export async function getUserByName(name: string): Promise<userItem> {
  const response = await axios.get('/api/user/getByName', { params: { name } })
  return response.data
}

export async function checkUser(user: userCheckItem): Promise<userItem> {
  const response = await axios.post('/api/user/check', user)
  return response.data
}
