<template>
  <el-dialog v-model="visible" title="客户详情" width="1200">
    <div v-if="loading" style="text-align:center; padding:24px;">
      加载中...
    </div>
    <div v-else-if="detail">
      <CustomerBaseInfo
        :detail="detail"
        :customer-type-text="customerTypeText"
        :status-text="statusText"
      />

      <div style="margin-top: 24px;">
        <CustomerContacts
          :contacts="detail.contacts || []"
          :messenger-type-text="messengerTypeText"
          @create="openCreateContact(detail)"
          @edit="openEditContact"
          @delete="doDeleteContact"
          @view="openContactDetail"
        />
      </div>
    </div>

    <el-dialog
      v-model="contactDialog.visible"
      :title="contactDialog.isEdit ? '编辑联系人' : '新增联系人'"
      width="640"
      append-to-body
    >
      <el-form v-if="contactForm" :model="contactForm" label-width="100px">
        <el-form-item label="姓名" required>
          <el-input v-model="contactForm.fullName" />
        </el-form-item>
        <el-form-item label="职位">
          <el-input v-model="contactForm.jobTitle" />
        </el-form-item>
        <el-form-item label="是否决策人">
          <el-switch v-model="contactForm.isDecisionMaker" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="contactForm.email" />
        </el-form-item>
        <el-form-item label="沟通渠道">
          <el-select v-model="contactForm.messengerType" placeholder="选择渠道" clearable>
            <el-option
              v-for="opt in messengerTypeOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="渠道账号">
          <el-input v-model="contactForm.messengerId" />
        </el-form-item>
        <el-form-item label="偏好语言">
          <el-input v-model="contactForm.preferredLanguage" />
        </el-form-item>
        <el-form-item label="LinkedIn">
          <el-input v-model="contactForm.linkedin" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="contactForm.notes" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="contactDialog.visible = false">取消</el-button>
        <el-button type="primary" :loading="contactSaving" @click="doSaveContact">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog
      v-model="contactDetailDialog.visible"
      title="联系人详情"
      width="800"
      append-to-body
    >
      <div v-if="contactDetailDialog.loading" style="text-align:center; padding:16px;">加载中...</div>
      <div v-else-if="contactDetail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ contactDetail.id }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ contactDetail.fullName }}</el-descriptions-item>
          <el-descriptions-item label="职位">{{ contactDetail.jobTitle || '-' }}</el-descriptions-item>
          <el-descriptions-item label="是否决策人">{{ contactDetail.isDecisionMaker ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ contactDetail.email || '-' }}</el-descriptions-item>
          <el-descriptions-item label="渠道">{{ messengerTypeText(contactDetail.messengerType) }}</el-descriptions-item>
          <el-descriptions-item label="渠道账号">{{ contactDetail.messengerId || '-' }}</el-descriptions-item>
          <el-descriptions-item label="偏好语言">{{ contactDetail.preferredLanguage || '-' }}</el-descriptions-item>
          <el-descriptions-item label="LinkedIn">{{ contactDetail.linkedin || '-' }}</el-descriptions-item>
          <el-descriptions-item label="备注" :span="2">{{ contactDetail.notes || '-' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ contactDetail.createdAt || '-' }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ contactDetail.updatedAt || '-' }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button @click="contactDetailDialog.visible = false">关闭</el-button>
        <el-button type="primary" :disabled="!contactDetail" @click="editContactFromDetail">编辑</el-button>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import CustomerBaseInfo from './CustomerBaseInfo.vue'
import CustomerContacts from './CustomerContacts.vue'
import {
  getCustomerDetail,
  getCustomerContactDetail,
  createCustomerContact,
  updateCustomerContact,
  deleteCustomerContact,
} from '@/api/customer'
import type {
  CustomerVO,
  CustomerTypeEnum,
  CustomerStatusEnum,
  CustomerContactVO,
  CustomerContactCreateDTO,
  CustomerContactUpdateDTO,
  MessengerTypeEnum,
} from '@/types/customer'

const props = defineProps<{
  modelValue: boolean
  customerId: number | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
})

const loading = ref(false)
const detail = ref<CustomerVO | null>(null)

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

const messengerTypeOptions: Array<{ label: string; value: MessengerTypeEnum }> = [
  { label: 'WhatsApp', value: 'WHATSAPP' },
  { label: '微信', value: 'WECHAT' },
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

const messengerTypeText = (v?: MessengerTypeEnum) => {
  if (!v) return '-'
  const found = messengerTypeOptions.find((it) => it.value === v)
  return found?.label || v
}

const fetchDetail = async () => {
  if (!props.customerId) return
  loading.value = true
  try {
    const res = await getCustomerDetail(props.customerId, 'contacts')
    if (res.code === 0 && res.data) {
      detail.value = res.data
    } else {
      ElMessage.error(res.msg || '获取详情失败')
    }
  } catch {
    ElMessage.error('获取详情失败')
  } finally {
    loading.value = false
  }
}

watch(
  () => ({ visible: props.modelValue, id: props.customerId }),
  (val) => {
    if (val.visible && val.id) {
      fetchDetail()
    }
  },
  { immediate: false }
)

// 联系人管理
const contactDialog = reactive<{ visible: boolean; isEdit: boolean; customerId?: number | null; id?: number | null }>
({
  visible: false,
  isEdit: false,
  customerId: null,
  id: null,
})

const emptyContactForm = (customerId: number): CustomerContactCreateDTO => ({
  customerId,
  fullName: '',
  jobTitle: '',
  isDecisionMaker: false,
  email: '',
  messengerType: undefined,
  messengerId: '',
  preferredLanguage: '',
  linkedin: '',
  notes: '',
})

const contactForm = ref<CustomerContactCreateDTO | CustomerContactUpdateDTO | null>(null)
const contactSaving = ref(false)

const contactDetailDialog = reactive<{ visible: boolean; loading: boolean; id?: number | null }>({
  visible: false,
  loading: false,
  id: null,
})

const contactDetail = ref<CustomerContactVO | null>(null)

const reloadContacts = async (customerId: number) => {
  try {
    const res = await getCustomerDetail(customerId, 'contacts')
    if (res.code === 0 && res.data) {
      detail.value = res.data
    }
  } catch {
    // ignore
  }
}

const openCreateContact = (customer: CustomerVO) => {
  const cid = customer.id
  contactDialog.isEdit = false
  contactDialog.customerId = cid
  contactDialog.id = null
  contactForm.value = emptyContactForm(cid)
  contactDialog.visible = true
}

const openEditContact = (row: CustomerContactVO) => {
  const cid = row.customerId
  contactDialog.isEdit = true
  contactDialog.customerId = cid
  contactDialog.id = row.id
  contactForm.value = {
    id: row.id,
    customerId: cid,
    fullName: row.fullName,
    jobTitle: row.jobTitle,
    isDecisionMaker: row.isDecisionMaker,
    email: row.email,
    messengerType: row.messengerType,
    messengerId: row.messengerId,
    preferredLanguage: row.preferredLanguage,
    linkedin: row.linkedin,
    notes: row.notes,
  }
  contactDialog.visible = true
}

const doSaveContact = async () => {
  if (!contactForm.value || !contactForm.value.fullName || !contactForm.value.fullName.trim()) {
    ElMessage.error('请填写联系人姓名')
    return
  }
  const cid = contactDialog.customerId
  if (!cid) {
    ElMessage.error('缺少客户ID')
    return
  }

  contactSaving.value = true
  try {
    if (contactDialog.isEdit && contactDialog.id) {
      const dto = contactForm.value as CustomerContactUpdateDTO
      const res = await updateCustomerContact(contactDialog.id, dto)
      if (res.code === 0) {
        ElMessage.success('联系人更新成功')
        contactDialog.visible = false
        await reloadContacts(cid)
      } else {
        ElMessage.error(res.msg || '更新失败')
      }
    } else {
      const dto = contactForm.value as CustomerContactCreateDTO
      const res = await createCustomerContact(dto)
      if (res.code === 0) {
        ElMessage.success('联系人创建成功')
        contactDialog.visible = false
        await reloadContacts(cid)
      } else {
        ElMessage.error(res.msg || '创建失败')
      }
    }
  } finally {
    contactSaving.value = false
  }
}

const doDeleteContact = async (row: CustomerContactVO) => {
  try {
    await ElMessageBox.confirm(`确认删除联系人【${row.fullName}】吗？`, '删除确认', { type: 'warning' })
  } catch {
    return
  }
  try {
    const res = await deleteCustomerContact(row.id)
    if (res.code === 0) {
      ElMessage.success('删除成功')
      if (row.customerId) {
        await reloadContacts(row.customerId)
      }
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch {
    ElMessage.error('删除失败')
  }
}

const openContactDetail = async (row: CustomerContactVO) => {
  contactDetailDialog.visible = true
  contactDetailDialog.loading = true
  contactDetailDialog.id = row.id
  try {
    const res = await getCustomerContactDetail(row.id)
    if (res.code === 0 && res.data) {
      contactDetail.value = res.data
    } else {
      ElMessage.error(res.msg || '获取联系人详情失败')
    }
  } catch {
    ElMessage.error('获取联系人详情失败')
  } finally {
    contactDetailDialog.loading = false
  }
}

const editContactFromDetail = () => {
  if (!contactDetail.value) return
  openEditContact(contactDetail.value)
  contactDetailDialog.visible = false
}
</script>
