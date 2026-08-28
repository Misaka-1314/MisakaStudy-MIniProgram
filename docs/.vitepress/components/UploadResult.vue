<script lang="js" setup>
import { ref, onMounted, h, reactive, computed, watch } from 'vue';
import {
  NButton, NDataTable, useModal, NCode, NText, NInput, NTag,
  NSpace, NSpin, useMessage, NCollapse, NCollapseItem, NSelect, useThemeVars
} from 'naive-ui';

const host = "https://task.micono.eu.org";
const message = useMessage();
const modal = useModal();
const themeVars = useThemeVars();

const list = ref([]);
const loading = ref(false);
const details = reactive({});
const keyword = ref('');
const secretFilter = ref('');
const versionFilter = ref('');

const secretOptions = [
  { label: '已填写', value: 'filled' },
  { label: '未填写', value: 'unfilled' },
];

const versionOptions = computed(() => {
  const versions = [...new Set(list.value.map(item => item.version || '上传失败'))];
  return versions.map(v => ({ label: v, value: v }));
});

const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100, 99999],
  itemCount: computed(() => list.value.length),
  onChange: page => {
    pagination.page = page;
  },
  onUpdatePageSize: pageSize => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  }
})

watch(keyword, newVal => {
  if (newVal)
    pagination.pageSize = 99999;
});

watch(() => pagination.pageSize, newVal => {
  if (newVal != pagination.pageSizes.at(-1))
    keyword.value = "";
})

watch([secretFilter, versionFilter], () => {
  pagination.page = 1;
})

const filteredList = computed(() => {
  let filtered = list.value.filter(item => item.appid.includes(keyword.value));

  if (secretFilter.value) {
    filtered = filtered.filter(item =>
      secretFilter.value === 'filled' ? item.secret_status : !item.secret_status
    );
  }

  if (versionFilter.value) {
    filtered = filtered.filter(item => (item.version || '上传失败') === versionFilter.value);
  }

  const start = (pagination.page - 1) * pagination.pageSize;
  const end = start + pagination.pageSize;
  return filtered.slice(start, end).map((item, index) => ({
    ...item,
    index: start + index + 1,
  }));
})

const getFailReason = (data) => {
  const logs = (data.upload_logs || '').toLowerCase();
  if (logs.includes('invalid ip')) {
    return '未关闭IP白名单';
  }
  return null;
};

const columns = [
  {
    title: '序号',
    key: 'index',
    align: 'center',
    width: 100,
  }
  ,
  {
    title: 'AppID',
    key: 'appid',
    align: 'center',
    width: 200,
    render: row => h(NText, { code: true }, { default: () => row.appid })
  },
  {
    title: '版本号',
    key: 'version',
    align: 'center',
    width: 150,
    render: row => {
      if (row.version) return row.version;
      const reason = getFailReason(row);
      return h(NSpace, { size: 'small', align: 'center', justify: 'center' }, {
        default: () => [
          h(NTag, { type: 'error', size: 'small' }, { default: () => '上传失败' }),
          reason ? h(NText, { type: 'error', depth: 3, style: { fontSize: '12px' } }, { default: () => reason }) : null,
        ]
      });
    }
  },
  {
    title: 'Secret',
    key: 'secret_status',
    align: 'center',
    width: 120,
    render: row => row.secret_status
      ? h(NTag, { type: 'success', size: 'small' }, { default: () => '已填写' })
      : h(NTag, { type: 'warning', size: 'small' }, { default: () => '未填写' })
  },
  {
    title: '详情',
    key: 'actions',
    align: 'center',
    width: 120,
    render: (row) => {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          type: 'primary',
          quaternary: true,
          onClick: () => {
            if (!details[row.id]) {
              fetchDetail(row.id);
            }

            modal.create({
              title: () => h(NText, { strong: true }, { default: () => `任务 - ${row.id}` }),
              preset: 'card',
              style: { width: '600px' },
              content: () => {
                const data = details[row.id];

                if (!data) {
                  return h(
                    NSpace,
                    { justify: 'center', style: { padding: '20px 0' } },
                    { default: () => h(NSpin, { size: 'medium' }) }
                  );
                }

                return h(NSpace, { vertical: true, size: 'small' }, {
                  default: () =>
                    [
                      { label: '小程序 AppID', value: data.appid },
                      {
                        label: '版本号',
                        value: data.version
                          ? h(NSpace, { size: 'small', align: 'center' }, {
                            default: () => [
                              h(NTag, { type: 'success', size: 'small' }, {
                                default: () => data.version
                              }),

                              data.version_time
                                ? h(NText, {
                                  type: 'info',
                                  style: { fontSize: '12px' }
                                }, {
                                  default: () => `构建于 ${data.version_time}`
                                })
                                : null,
                            ]
                          })
                          : h(NSpace, { size: 'small', align: 'center' }, {
                            default: () => [
                              h(NTag, { type: 'error', size: 'small' }, {
                                default: () => '上传失败'
                              }),
                              getFailReason(data)
                                ? h(NText, { type: 'error', style: { fontSize: '12px' } }, {
                                  default: () => getFailReason(data)
                                })
                                : null,
                            ]
                          })
                      },
                      { label: '手机号', value: data.mobile || '隐藏' },
                      { label: '问卷填写时间', value: data.create_time || null },
                      { label: '上传开始时间', value: data.upload_duration ? null : data.upload_begin_time },
                      { label: '上传成功时间', value: data.upload_success_time || null },
                      { label: '上传耗时', value: data.upload_duration ? `${data.upload_duration} 秒` : null },
                      { label: '下次重试时间', value: data.upload_locker_expire || null },
                      {
                        label: '上传节点',
                        value: h(NText, { type: 'default' }, { default: () => data.upload_node?.slice(0, 15) || '默认节点' }),
                      },
                      {
                        label: 'Secret',
                        value: data.secret_status
                          ? h(NTag, { type: 'success', size: 'small' }, { default: () => '已填写' })
                          : h(NSpace, { size: 'small', align: 'center' }, {
                            default: () => [
                              h(NTag, { type: 'warning', size: 'small' }, { default: () => '未填写' }),
                              h(NText, { type: 'warning', style: { fontSize: '12px' } }, { default: () => "签到码、手势签到功能已禁用" }),
                              h(NText, { type: 'error' }, { default: () => data.secret_reason }),
                            ]
                          })
                      },
                    ]
                      .filter(item => item.value)
                      .map(item =>
                        h('div', { style: { display: 'flex', alignItems: 'flex-start', lineHeight: '2' } }, [
                          h(NText, {
                            depth: 3,
                            style: { width: '120px', flexShrink: 0 }
                          }, { default: () => item.label }),
                          h('div', { style: { flex: 1, wordBreak: 'break-all' } }, [
                            typeof item.value === 'string' ? item.value : item.value
                          ])
                        ])
                      )
                      .concat([
                        h(NCollapse, { style: 'margin-top: 12px;' }, {
                          default: () => h(NCollapseItem, { title: '查看代码上传日志', name: 'logs' }, {
                            default: () => h(NCode, {
                              code: data.upload_logs || '暂无日志信息哦...',
                              language: 'log',
                              showLineNumbers: true,
                              style: {
                                fontSize: '11px',
                                backgroundColor: themeVars.value.codeColor,
                                padding: '12px',
                                borderRadius: '4px',
                                maxHeight: '150px',
                                overflow: 'auto',
                              }
                            })
                          })
                        })
                      ])
                });
              }
            });
          }
        },
        { default: () => '更多信息' }
      );
    }
  }
];

const fetchListData = () => {
  loading.value = true;
  fetch(
    `${host}/api/public/tasks`, {
    credentials: 'omit',
    mode: 'cors'
  })
    .then(resp => resp.json())
    .then(res => {
      if (res.status === 0) {
        list.value = res.data.tasks;
        message.success('数据加载成功啦~♡');
      }
    })
    .catch(err => {
      message.error('欸？？获取数据失败了...');
      console.error(err);
    })
    .finally(() => {
      loading.value = false;
    });
};

const fetchDetail = id => {
  fetch(
    `${host}/api/public/tasks/${id}`, {
    credentials: 'omit',
    mode: 'cors'
  })
    .then(resp => resp.json())
    .then(res => {
      if (res.status === 0) {
        details[id] = res.data;
      }
    })
    .catch(err => {
      message.error('呜呜，详情加载失败了...');
      console.error(err);
    });
};

onMounted(() => {
  fetchListData();
});
</script>

<template>
  <NSpace vertical size="large">
    <NInput v-model:value="keyword" round placeholder="输入完整 AppID，进行搜索" />
    <NSpace size="small">
      <NSelect
        v-model:value="secretFilter"
        :options="secretOptions"
        placeholder="按 Secret 筛选"
        clearable
        style="width: 160px"
      />
      <NSelect
        v-model:value="versionFilter"
        :options="versionOptions"
        placeholder="按版本号筛选"
        clearable
        filterable
        style="width: 200px"
      />
    </NSpace>
    <NDataTable :loading="loading" :columns="columns" :data="filteredList" :pagination="pagination" remote />
  </NSpace>
</template>

<style scoped>
:deep(.n-pagination) {
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  row-gap: 12px;
}
</style>