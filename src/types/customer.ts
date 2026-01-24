export type CustomerTypeEnum = 'INDIVIDUAL' | 'AGENCY'

export type CustomerStatusEnum = 'LEAD' | 'CONTACTED' | 'ACTIVE' | 'INACTIVE'

export type MessengerTypeEnum = 'WHATSAPP' | 'WECHAT'

export interface CustomerContactVO {
  id: number
  customerId: number
  fullName: string
  jobTitle?: string
  isDecisionMaker?: boolean
  email?: string
  messengerType?: MessengerTypeEnum
  messengerId?: string
  preferredLanguage?: string
  linkedin?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface CustomerContactCreateDTO {
  customerId: number
  fullName: string
  jobTitle?: string
  isDecisionMaker?: boolean
  email?: string
  messengerType?: MessengerTypeEnum
  messengerId?: string
  preferredLanguage?: string
  linkedin?: string
  notes?: string
}

export interface CustomerContactUpdateDTO extends CustomerContactCreateDTO {
  id: number
}

export interface CustomerVO {
  id: number
  customerType?: CustomerTypeEnum
  companyName: string
  companyType?: string
  country?: string
  city?: string
  sourceChannel?: string
  website?: string
  mainProducts?: string
  specialization?: string
  employeeSize?: string
  status?: CustomerStatusEnum
  createdAt?: string
  updatedAt?: string
  contacts?: CustomerContactVO[]
}

export interface CustomerCreateDTO {
  customerType?: CustomerTypeEnum
  companyName: string
  companyType?: string
  country?: string
  city?: string
  sourceChannel?: string
  website?: string
  mainProducts?: string
  specialization?: string
  employeeSize?: string
  status?: CustomerStatusEnum
}

export interface CustomerUpdateDTO extends CustomerCreateDTO {
  id: number
}

export interface CustomerQueryDTO {
  pageNum?: number
  pageSize?: number
  orderBy?: string
  customerType?: CustomerTypeEnum
  status?: CustomerStatusEnum
  country?: string
  companyNameLike?: string
}
