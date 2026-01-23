import instance from '@/config/axios'
import type { ApiResponse, PageResponse } from '@/types/api'
import type { CustomerVO, CustomerCreateDTO, CustomerUpdateDTO, CustomerQueryDTO } from '@/types/customer'

export const createCustomer = (data: CustomerCreateDTO): Promise<ApiResponse<CustomerVO>> => {
  return instance.post('/admin/customer/create', data)
}

export const updateCustomer = (id: number, data: CustomerUpdateDTO): Promise<ApiResponse<CustomerVO>> => {
  return instance.post(`/admin/customer/update/${id}`, data)
}

export const getCustomerDetail = (id: number, populate?: string): Promise<ApiResponse<CustomerVO>> => {
  return instance.get('/admin/customer/detail', { params: { id, populate } })
}

export const listCustomers = (): Promise<ApiResponse<CustomerVO[]>> => {
  return instance.get('/admin/customer/list')
}

export const deleteCustomer = (id: number): Promise<ApiResponse<boolean>> => {
  return instance.post('/admin/customer/delete', null, { params: { id } })
}

export const pageCustomers = (query: CustomerQueryDTO): Promise<ApiResponse<PageResponse<CustomerVO>>> => {
  return instance.post('/admin/customer/page', query)
}
