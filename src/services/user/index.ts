import axios from 'axios'
import { userItem } from '@/models/user'
import { USER_LIST_SIZE } from '@/constant'

export async function getUsers(start: number, size: number = USER_LIST_SIZE): Promise<userItem[]> {
  const response = await axios.get('/api/user/get', { params: { start, size } })
  return response.data
}

export async function getAllUsers(): Promise<userItem[]> {
  const response = await axios.get('/api/user/all')
  return response.data
}
