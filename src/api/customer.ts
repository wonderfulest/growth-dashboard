import instance from '@/config/axios'
import type { ApiResponse, PageResponse } from '@/types/api'
import type {
  CustomerVO,
  CustomerCreateDTO,
  CustomerUpdateDTO,
  CustomerQueryDTO,
  CustomerContactVO,
  CustomerContactCreateDTO,
  CustomerContactUpdateDTO,
} from '@/types/customer'

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

// 联系人管理

export const createCustomerContact = (
  data: CustomerContactCreateDTO
): Promise<ApiResponse<CustomerContactVO>> => {
  return instance.post('/admin/customer/contact/create', data)
}

export const updateCustomerContact = (
  id: number,
  data: CustomerContactUpdateDTO
): Promise<ApiResponse<CustomerContactVO>> => {
  return instance.post(`/admin/customer/contact/update/${id}`, data)
}

export const getCustomerContactDetail = (id: number): Promise<ApiResponse<CustomerContactVO>> => {
  return instance.get('/admin/customer/contact/detail', { params: { id } })
}

export const listContactsByCustomer = (customerId: number): Promise<ApiResponse<CustomerContactVO[]>> => {
  return instance.get('/admin/customer/contact/list-by-customer', { params: { customerId } })
}

export const deleteCustomerContact = (id: number): Promise<ApiResponse<boolean>> => {
  return instance.post('/admin/customer/contact/delete', null, { params: { id } })
}
