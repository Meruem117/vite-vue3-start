import axios from 'axios'
import type { mResultItem, hResultItem1, hResultItem2, hResultItem3, hResultItem4 } from '@/models/chart'

export async function getHResult1(): Promise<hResultItem1[]> {
  const response = await axios.get('/api/chart/getHResult1')
  return response.data
}

export async function getHResult2(): Promise<hResultItem2[]> {
  const response = await axios.get('/api/chart/getHResult2')
  return response.data
}

export async function getHResult3(): Promise<hResultItem3[]> {
  const response = await axios.get('/api/chart/getHResult3')
  return response.data
}

export async function getHResult4(): Promise<hResultItem4[]> {
  const response = await axios.get('/api/chart/getHResult4')
  return response.data
}

export async function getMResult(): Promise<mResultItem[]> {
  const response = await axios.get('/api/chart/getMResult')
  return response.data
}

export async function getDistinctTm(): Promise<string[]> {
  const response = await axios.get('/api/chart/getDistinctTm')
  return response.data
}

export async function getMResultByType(type: number): Promise<mResultItem[]> {
  const response = await axios.get(`/api/chart/getMResultByType?type=${type}`)
  return response.data
}

export async function getMResultByTypeAndTm(type: number, tm: string): Promise<mResultItem[]> {
  const response = await axios.get('/api/chart/getMResultByTypeAndTm', { params: { type, tm } })
  return response.data
}

export async function getMResultByNameAndTm(name: string, tm: string): Promise<mResultItem> {
  const response = await axios.get('/api/chart/getMResultByNameAndTm', { params: { name, tm } })
  return response.data
}