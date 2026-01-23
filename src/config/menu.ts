export interface SubMenuItem {
  key: string
  title: string
  path?: string
  children?: SubMenuItem[]
}

export interface TopMenuGroup {
  key: string
  title: string
  basePaths: string[]
  children: SubMenuItem[]
}

export const topMenus: TopMenuGroup[] = [
  {
    key: 'official',
    title: '官网运营',
    basePaths: ['/dashboard', '/email-records'],
    children: [
      { key: 'dashboard', title: '仪表盘', path: '/dashboard' },
      { key: 'email-records', title: '邮件发送历史', path: '/email-records' },
    ],
  },
  {
    key: 'marketing',
    title: '营销工具',
    basePaths: ['/marketing'],
    children: [
      // { key: 'user-profiles', title: '用户画像', path: '/marketing/user-profiles' },
      { key: 'customers', title: '客户', path: '/marketing/customers' },
      { key: 'segments', title: '用户分群', path: '/marketing/segments' },
      { key: 'email-templates', title: '邮件模板', path: '/marketing/email-templates' },
      { key: 'promotion-campaigns', title: '营销活动', path: '/marketing/campaigns' },
      { key: 'push-records', title: '推送记录', path: '/marketing/push-records' },
    ],
  },
  {
    key: 'users',
    title: '用户管理',
    basePaths: ['/users'],
    children: [
      { key: 'user-management', title: '用户管理', path: '/users/user-management' },
      { key: 'change-user-email', title: '变更用户邮箱', path: '/users/user-management/change-email' },
      { key: 'email-preferences', title: '用户隐私', path: '/users/email-preferences' },
      { key: 'role-management', title: '角色管理', path: '/users/role-management' },
      { key: 'profile', title: '个人资料', path: '/profile' },
    ],
  },
]