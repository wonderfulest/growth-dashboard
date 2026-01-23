<template>
  <div class="customers-page">
    <div class="page-header">
      <h2>客户管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="openCreate">新建客户</el-button>
      </div>
    </div>

    <div class="filters">
      <el-input
        v-model="query.companyNameLike"
        placeholder="按公司名称搜索"
        clearable
        style="width: 220px; margin-right: 12px;"
      />
      <el-input
        v-model="query.country"
        placeholder="按国家搜索"
        clearable
        style="width: 180px; margin-right: 12px;"
      />
      <el-select
        v-model="query.customerType"
        placeholder="客户类型"
        clearable
        style="width: 160px; margin-right: 12px;"
      >
        <el-option
          v-for="opt in customerTypeOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <el-select
        v-model="query.status"
        placeholder="客户状态"
        clearable
        style="width: 160px; margin-right: 12px;"
      >
        <el-option
          v-for="opt in statusOptions"
          :key="opt.value"
          :label="opt.label"
          :value="opt.value"
        />
      </el-select>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button @click="handleReset">重置</el-button>
    </div>

    <el-table :data="list" style="width: 100%" :loading="loading">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="companyName" label="公司名称" min-width="200" />
      <el-table-column prop="country" label="国家" width="120" />
      <el-table-column prop="city" label="城市" width="120" />
      <el-table-column prop="customerType" label="类型" width="120">
        <template #default="{ row }">
          {{ customerTypeText(row.customerType) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template #default="{ row }">
          <el-tag :type="statusTagType(row.status)">
            {{ statusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="220">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="openDetail(row)">详情</el-button>
          <el-button size="small" type="primary" link @click="openEdit(row)">编辑</el-button>
          <el-popconfirm title="确认删除该客户吗？" @confirm="doDelete(row)">
            <template #reference>
              <el-button size="small" type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-bar">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="query.pageNum"
        :page-size="query.pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <el-dialog v-model="formDialog.visible" :title="formDialog.isEdit ? '编辑客户' : '新建客户'" width="720">
      <el-form :model="form" label-width="100px">
        <el-form-item label="客户类型">
          <el-select v-model="form.customerType" placeholder="选择类型" clearable>
            <el-option
              v-for="opt in customerTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称" required>
          <el-input v-model="form.companyName" />
        </el-form-item>
        <el-form-item label="公司类型">
          <el-input v-model="form.companyType" />
        </el-form-item>
        <el-form-item label="国家 / 城市">
          <div style="display:flex; gap:8px; width:100%;">
            <el-input v-model="form.country" placeholder="国家" />
            <el-input v-model="form.city" placeholder="城市" />
          </div>
        </el-form-item>
        <el-form-item label="来源渠道">
          <el-input v-model="form.sourceChannel" />
        </el-form-item>
        <el-form-item label="官网">
          <el-input v-model="form.website" />
        </el-form-item>
        <el-form-item label="主营产品">
          <el-input v-model="form.mainProducts" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="细分领域">
          <el-input v-model="form.specialization" />
        </el-form-item>
        <el-form-item label="员工规模">
          <el-input v-model="form.employeeSize" />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="选择状态" clearable>
            <el-option
              v-for="opt in statusOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="formDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="doSave">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="detailDialog.visible" title="客户详情" width="820">
      <div v-if="detailDialog.loading" style="text-align:center; padding:24px;">
        <el-icon><i-ep-loading /></el-icon>
      </div>
      <div v-else-if="detail">
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

        <div style="margin-top: 24px;">
          <h4>联系人</h4>
          <el-table :data="detail.contacts || []" style="width: 100%; margin-top: 8px;">
            <el-table-column prop="fullName" label="姓名" min-width="140" />
            <el-table-column prop="jobTitle" label="职位" min-width="160" />
            <el-table-column prop="isDecisionMaker" label="决策人" width="100">
              <template #default="{ row }">
                <el-tag v-if="row.isDecisionMaker" type="success">是</el-tag>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" min-width="200" />
            <el-table-column prop="messengerType" label="渠道" width="120" />
            <el-table-column prop="messengerId" label="账号" min-width="180" />
            <el-table-column prop="preferredLanguage" label="语言" width="100" />
            <el-table-column prop="linkedin" label="LinkedIn" min-width="180" />
          </el-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDateTime } from '@/utils/date'
import { pageCustomers, createCustomer, updateCustomer, deleteCustomer, getCustomerDetail } from '@/api/customer'
import type { CustomerVO, CustomerCreateDTO, CustomerUpdateDTO, CustomerQueryDTO, CustomerTypeEnum, CustomerStatusEnum } from '@/types/customer'

const loading = ref(false)
const list = ref<CustomerVO[]>([])
const total = ref(0)

const query = reactive<CustomerQueryDTO>({
  pageNum: 1,
  pageSize: 10,
  orderBy: 'id desc',
  companyNameLike: undefined,
  country: undefined,
  customerType: undefined,
  status: undefined,
})

const customerTypeOptions: Array<{ label: string; value: CustomerTypeEnum }> = [
  { label: '个人', value: 'INDIVIDUAL' },
  { label: '代理/机构', value: 'AGENCY' },
]

const statusOptions: Array<{ label: string; value: CustomerStatusEnum }> = [
  { label: '线索', value: 'LEAD' },
  { label: '已联系', value: 'CONTACTED' },
  { label: '有效', value: 'ACTIVE' },
  { label: '无效', value: 'INACTIVE' },
]

const customerTypeText = (v?: CustomerTypeEnum) => {
  if (!v) return '-'
  const found = customerTypeOptions.find((it) => it.value === v)
  return found?.label || v
}

const statusText = (v?: CustomerStatusEnum) => {
  if (!v) return '-'
  const found = statusOptions.find((it) => it.value === v)
  return found?.label || v
}

const statusTagType = (v?: CustomerStatusEnum) => {
  switch (v) {
    case 'ACTIVE':
      return 'success'
    case 'CONTACTED':
      return 'primary'
    case 'LEAD':
      return 'warning'
    case 'INACTIVE':
      return 'info'
    default:
      return 'info'
  }
}

const fetchPage = async () => {
  loading.value = true
  try {
    const res = await pageCustomers(query)
    if (res.code === 0 && res.data) {
      list.value = res.data.list
      total.value = res.data.total
    } else {
      ElMessage.error(res.msg || '获取客户列表失败')
    }
  } catch (e) {
    ElMessage.error('获取客户列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  query.pageNum = 1
  fetchPage()
}

const handleReset = () => {
  const size = query.pageSize
  query.pageNum = 1
  query.pageSize = size
  query.companyNameLike = undefined
  query.country = undefined
  query.customerType = undefined
  query.status = undefined
  query.orderBy = 'id desc'
  fetchPage()
}

const handlePageChange = (page: number) => {
  query.pageNum = page
  fetchPage()
}

const handleSizeChange = (size: number) => {
  query.pageSize = size
  query.pageNum = 1
  fetchPage()
}

// 新增/编辑
const formDialog = reactive<{ visible: boolean; isEdit: boolean; currentId?: number | null }>({
  visible: false,
  isEdit: false,
  currentId: null,
})

const emptyForm = (): CustomerCreateDTO => ({
  customerType: undefined,
  companyName: '',
  companyType: '',
  country: '',
  city: '',
  sourceChannel: '',
  website: '',
  mainProducts: '',
  specialization: '',
  employeeSize: '',
  status: 'LEAD',
})

const form = ref<CustomerCreateDTO | CustomerUpdateDTO>(emptyForm())
const saving = ref(false)

const openCreate = () => {
  formDialog.isEdit = false
  formDialog.currentId = null
  form.value = emptyForm()
  formDialog.visible = true
}

const openEdit = (row: CustomerVO) => {
  formDialog.isEdit = true
  formDialog.currentId = row.id
  form.value = {
    id: row.id,
    customerType: row.customerType,
    companyName: row.companyName,
    companyType: row.companyType,
    country: row.country,
    city: row.city,
    sourceChannel: row.sourceChannel,
    website: row.website,
    mainProducts: row.mainProducts,
    specialization: row.specialization,
    employeeSize: row.employeeSize,
    status: row.status,
  }
  formDialog.visible = true
}

const doSave = async () => {
  if (!form.value.companyName || !form.value.companyName.trim()) {
    ElMessage.error('请填写公司名称')
    return
  }

  saving.value = true
  try {
    if (formDialog.isEdit && formDialog.currentId) {
      const dto = form.value as CustomerUpdateDTO
      const res = await updateCustomer(formDialog.currentId, dto)
      if (res.code === 0) {
        ElMessage.success('更新成功')
        formDialog.visible = false
        fetchPage()
      } else {
        ElMessage.error(res.msg || '更新失败')
      }
    } else {
      const dto = form.value as CustomerCreateDTO
      const res = await createCustomer(dto)
      if (res.code === 0) {
        ElMessage.success('创建成功')
        formDialog.visible = false
        fetchPage()
      } else {
        ElMessage.error(res.msg || '创建失败')
      }
    }
  } finally {
    saving.value = false
  }
}

// 删除
const doDelete = async (row: CustomerVO) => {
  try {
    await ElMessageBox.confirm(`确认删除客户【${row.companyName}】吗？`, '删除确认', { type: 'warning' })
  } catch {
    return
  }
  try {
    const res = await deleteCustomer(row.id)
    if (res.code === 0) {
      ElMessage.success('删除成功')
      fetchPage()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch {
    ElMessage.error('删除失败')
  }
}

// 详情
const detailDialog = reactive<{ visible: boolean; loading: boolean; currentId?: number | null }>({
  visible: false,
  loading: false,
  currentId: null,
})

const detail = ref<CustomerVO | null>(null)

const openDetail = async (row: CustomerVO) => {
  detailDialog.visible = true
  detailDialog.loading = true
  detailDialog.currentId = row.id
  try {
    const res = await getCustomerDetail(row.id, 'contacts')
    if (res.code === 0 && res.data) {
      detail.value = res.data
    } else {
      ElMessage.error(res.msg || '获取详情失败')
    }
  } catch {
    ElMessage.error('获取详情失败')
  } finally {
    detailDialog.loading = false
  }
}

onMounted(fetchPage)
</script>

<style scoped>
.customers-page {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.page-header h2 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.filters {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.pagination-bar {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
