<template>
  <div class="customer-contacts">
    <div class="header">
      <h4 class="title">联系人</h4>
      <el-button type="primary" size="small" @click="$emit('create')">新增联系人</el-button>
    </div>
    <el-table :data="contacts" style="width: 100%; margin-top: 4px;">
      <el-table-column prop="fullName" label="姓名" min-width="140" />
      <el-table-column prop="jobTitle" label="职位" min-width="160" />
      <el-table-column prop="isDecisionMaker" label="决策人" width="100">
        <template #default="{ row }">
          <el-tag v-if="row.isDecisionMaker" type="success">是</el-tag>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" min-width="200" />
      <el-table-column prop="messengerType" label="渠道" width="120">
        <template #default="{ row }">
          {{ messengerTypeText(row.messengerType) }}
        </template>
      </el-table-column>
      <el-table-column prop="messengerId" label="账号" min-width="180" />
      <el-table-column prop="preferredLanguage" label="语言" width="100" />
      <el-table-column prop="linkedin" label="LinkedIn" min-width="180" />
      <el-table-column fixed="right" label="操作" width="220">
        <template #default="{ row }">
          <el-button size="small" link @click="$emit('view', row)">详情</el-button>
          <el-button size="small" type="primary" link @click="$emit('edit', row)">编辑</el-button>
          <el-popconfirm title="确认删除该联系人吗？" @confirm="$emit('delete', row)">
            <template #reference>
              <el-button size="small" type="danger" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import type { CustomerContactVO, MessengerTypeEnum } from '@/types/customer'

const props = defineProps<{
  contacts: CustomerContactVO[]
  messengerTypeText: (v?: MessengerTypeEnum) => string
}>()

const contacts = props.contacts
const messengerTypeText = props.messengerTypeText
</script>

<style scoped>
.customer-contacts .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.customer-contacts .title {
  margin: 0;
}
</style>
