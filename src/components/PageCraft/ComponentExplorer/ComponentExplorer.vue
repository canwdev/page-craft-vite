<script lang="ts" setup>
import type {
  IComponentItem,
  IComponentMeta,
} from '@/components/PageCraft/ComponentExplorer/enum'
import { useNavigation } from '@/components/FileManager/ExplorerUI/hooks/use-navigation'
import { getLastDirName, normalizePath } from '@/components/FileManager/utils'
import { fsWebApi } from '@/components/FileManager/utils/providers/humanfs-api'
import ComponentList from '@/components/PageCraft/ComponentExplorer/ComponentList.vue'
import {
  regComponentV2,
} from '@/components/PageCraft/ComponentExplorer/enum'

const {
  isLoading,
  filteredFiles,
  handleOpen,
  handleRefresh,
  basePathNormalized,
  starList,
  handleOpenPath,
  backHistory,
  goBack,
  forwardHistory,
  goForward,
  allowUp,
  goUp,
  basePath,
  toggleStar,
  isStared,
  filterText,
} = useNavigation({
  getListFn: async () => {
    const entries = await fsWebApi.getList({
      path: basePath.value,
    })

    const cEntries: IComponentItem[] = []
    for (const key in entries) {
      const entry = entries[key]
      let meta: IComponentMeta | undefined
      if (regComponentV2.test(entry.name)) {
        meta
          = (await fsWebApi.getFile({
            path: normalizePath(`${basePath.value}/${entry.name}/index.json`),
            mode: 'json',
          })) || {}
        meta!.cover = await fsWebApi.getFile({
          path: normalizePath(`${basePath.value}/${entry.name}/cover.base64`),
        })
      }
      cEntries.push({
        ...entry,
        meta,
        basePath: basePath.value,
      })
    }

    // console.log(cEntries)
    return cEntries
  },
  openEntryFn: async ({ path }) => {
    const res = await fsWebApi.getFile({
      path,
    })
    console.log(res)
  },
})

onMounted(() => {
  handleRefresh()
})
</script>

<template>
  <div class="mc-component-explorer">
    <div class="explorer-header vgo-panel">
      <div class="nav-address">
        <div class="nav-wrap">
          <button
            :disabled="backHistory.length <= 1"
            class="btn-action vgo-button"
            title="Back"
            @click="goBack"
          >
            <span class="mdi mdi-arrow-left" />
          </button>
          <button
            :disabled="forwardHistory.length <= 0"
            class="btn-action vgo-button"
            title="Forward"
            @click="goForward"
          >
            <span class="mdi mdi-arrow-right" />
          </button>
          <button class="btn-action vgo-button" :disabled="!allowUp" title="Up" @click="goUp">
            <span class="mdi mdi-arrow-up" />
          </button>
        </div>
        <div class="input-wrap">
          <input
            v-model="filterText"
            :placeholder="`Filter name in ${basePath}`"
            class="input-addr vgo-input"
          >

          <button class="vgo-button btn-action" @click="handleRefresh">
            <span class="mdi mdi-refresh" />
          </button>
          <button class="vgo-button btn-action" @click="toggleStar">
            <template v-if="isStared">
              <span class="mdi mdi-star" />
            </template>
            <template v-else>
              <span class="mdi mdi-star-outline" />
            </template>
          </button>
        </div>

        <div v-if="starList.length" class="star-list">
          <div v-for="(path, index) in starList" :key="path">
            <button
              class="vgo-button"
              :title="path"
              @click="handleOpenPath(path)"
              @contextmenu.prevent="() => starList.splice(index, 1)"
            >
              {{ getLastDirName(path) }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="explorer-content-wrap scrollbar-mini">
      <ComponentList
        v-model:is-loading="isLoading"
        :files="filteredFiles"
        :base-path="basePathNormalized"
        @open="handleOpen"
        @refresh="handleRefresh"
      />
    </div>
  </div>
</template>

<style lang="scss">
.mc-component-explorer {
  min-width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  outline: none;

  .vgo-button {
    line-height: 1;
    min-width: 25px;
    min-height: 25px;
    align-items: center;
    justify-content: center;
  }

  .explorer-header {
    padding: 4px;
    border: none;
    border-bottom: 1px solid var(--vgo-color-border);
    box-shadow: none;
    border-radius: 0;

    .nav-address {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 4px;
      .btn-action {
        padding: 4px;
        display: flex;
      }

      .nav-wrap {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .input-wrap {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        flex: 1;
        gap: 4px;
        font-size: 14px;

        .input-addr {
          flex: 1;
          line-height: 1;
          padding: 6px 8px;
        }
        .input-filter {
          width: 100px;
          line-height: 1;
          padding: 6px 8px;
        }
      }
    }

    .star-list {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
  }
  .explorer-content-wrap {
    flex: 1;
    overflow: auto;
    display: flex;
  }

  .btn-action {
    display: inline-flex;
    cursor: pointer;
    font-size: 18px;
    &:disabled {
      cursor: not-allowed;
    }
    &:hover,
    &:focus {
      background-color: var(--vgo-primary-opacity);
    }
  }
}
</style>
