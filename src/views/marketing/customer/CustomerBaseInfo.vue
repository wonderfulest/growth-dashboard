<template>
  <el-descriptions title="基本信息" :column="2" border>
    <el-descriptions-item label="ID">{{ detail.id }}</el-descriptions-item>
    <el-descriptions-item label="客户类型">{{ customerTypeText(detail.customerType) }}</el-descriptions-item>
    <el-descriptions-item label="公司名称">{{ detail.companyName }}</el-descriptions-item>
    <el-descriptions-item label="公司类型">{{ detail.companyType || '-' }}</el-descriptions-item>
    <el-descriptions-item label="国家">{{ detail.country || '-' }}</el-descriptions-item>
    <el-descriptions-item label="城市">{{ detail.city || '-' }}</el-descriptions-item>
    <el-descriptions-item label="来源渠道">{{ detail.sourceChannel || '-' }}</el-descriptions-item>
    <el-descriptions-item label="官网">{{ detail.website || '-' }}</el-descriptions-item>
    <el-descriptions-item label="主营产品">{{ detail.mainProducts || '-' }}</el-descriptions-item>
    <el-descriptions-item label="细分领域">{{ detail.specialization || '-' }}</el-descriptions-item>
    <el-descriptions-item label="员工规模">{{ detail.employeeSize || '-' }}</el-descriptions-item>
    <el-descriptions-item label="状态">{{ statusText(detail.status) }}</el-descriptions-item>
    <el-descriptions-item label="创建时间">{{ formatDateTime(detail.createdAt || '') }}</el-descriptions-item>
    <el-descriptions-item label="更新时间">{{ formatDateTime(detail.updatedAt || '') }}</el-descriptions-item>
  </el-descriptions>
</template>

<script setup lang="ts">
import { formatDateTime } from '@/utils/date'
import type { CustomerVO, CustomerTypeEnum, CustomerStatusEnum } from '@/types/customer'

const props = defineProps<{
  detail: CustomerVO
  customerTypeText: (v?: CustomerTypeEnum) => string
  statusText: (v?: CustomerStatusEnum) => string
}>()

const detail = props.detail
const customerTypeText = props.customerTypeText
const statusText = props.statusText
</script>
