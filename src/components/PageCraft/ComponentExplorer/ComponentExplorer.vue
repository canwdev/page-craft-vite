<script lang="ts" setup>
import {useNavigation} from '@/components/FileManager/ExplorerUI/hooks/use-navigation'
import {fsWebApi} from '@/components/FileManager/utils/providers/humanfs-api'
import {getLastDirName, normalizePath} from '@/components/FileManager/utils'
import ComponentList from '@/components/PageCraft/ComponentExplorer/ComponentList.vue'
import {
  IComponentItem,
  IComponentMeta,
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
        meta =
          (await fsWebApi.getFile({
            path: normalizePath(basePath.value + '/' + entry.name + '/index.json'),
            mode: 'json',
          })) || {}
        meta!.cover = await fsWebApi.getFile({
          path: normalizePath(basePath.value + '/' + entry.name + '/cover.base64'),
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
  openEntryFn: async ({path}) => {
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
    <div class="explorer-header vp-panel">
      <div class="nav-address">
        <div class="nav-wrap">
          <button
            :disabled="backHistory.length <= 1"
            class="btn-action vp-button"
            @click="goBack"
            title="Back"
          >
            <span class="mdi mdi-arrow-left"></span>
          </button>
          <button
            :disabled="forwardHistory.length <= 0"
            class="btn-action vp-button"
            @click="goForward"
            title="Forward"
          >
            <span class="mdi mdi-arrow-right"></span>
          </button>
          <button class="btn-action vp-button" :disabled="!allowUp" @click="goUp" title="Up">
            <span class="mdi mdi-arrow-up"></span>
          </button>
        </div>
        <div class="input-wrap">
          <input
            :placeholder="`Filter name in ${basePath}`"
            v-model="filterText"
            class="input-addr vp-input"
          />

          <button class="vp-button btn-action" @click="handleRefresh">
            <span class="mdi mdi-refresh"></span>
          </button>
          <button class="vp-button btn-action" @click="toggleStar">
            <template v-if="isStared">
              <span class="mdi mdi-star"></span>
            </template>
            <template v-else>
              <span class="mdi mdi-star-outline"></span>
            </template>
          </button>
        </div>

        <div v-if="starList.length" class="star-list">
          <div v-for="(path, index) in starList" :key="path">
            <button
              @click="handleOpenPath(path)"
              class="vp-button"
              :title="path"
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
        @open="handleOpen"
        @refresh="handleRefresh"
        :base-path="basePathNormalized"
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

  .vp-button {
    line-height: 1;
    min-width: 25px;
    min-height: 25px;
    align-items: center;
    justify-content: center;
  }

  .explorer-header {
    padding: 4px;
    border: none;
    border-bottom: 1px solid $color_border;
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
      background-color: $primary_opacity;
    }
  }
}
</style>
