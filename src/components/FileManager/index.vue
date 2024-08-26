<script setup lang="ts">
import FileList from './ExplorerUI/FileList.vue'
import {getLastDirName} from './utils'
import {useNavigation} from './ExplorerUI/hooks/use-navigation'
import {fsWebApi} from './utils/api'

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
    const res = await fsWebApi.getList({
      path: basePath.value,
      isStat: true,
    })
    // console.log(res)

    return res
  },
  openEntryFn: async ({item, path}) => {
    console.log({item, path})

    if (Number(item.size) > 1 * 1024 * 1024) {
      console.error('文件大于1MB，不支持预览')
      return
    }
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
  <div class="explorer-wrap">
    <div class="explorer-header vp-panel">
      <div class="nav-address">
        <div class="nav-wrap">
          <button
            :disabled="backHistory.length <= 1"
            class="btn-action vp-button"
            @click="goBack"
            title="Back"
          >
            <i class="fa fa-chevron-left" aria-hidden="true"></i>
          </button>
          <button
            :disabled="forwardHistory.length <= 0"
            class="btn-action vp-button"
            @click="goForward"
            title="Forward"
          >
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
          </button>
          <button class="btn-action vp-button" :disabled="!allowUp" @click="goUp" title="Up">
            <i class="fa fa-level-up" aria-hidden="true"></i>
          </button>
        </div>
        <div class="input-wrap">
          <input
            placeholder="Path"
            v-model="basePath"
            class="input-addr vp-input"
            @change="handleRefresh"
          />

          <button class="vp-button btn-action" @click="handleRefresh">
            <i class="fa fa-refresh" aria-hidden="true"></i>
          </button>
          <button class="vp-button btn-action" @click="toggleStar">
            <template v-if="isStared">
              <i class="fa fa-star" aria-hidden="true"></i>
            </template>
            <template v-else>
              <i class="fa fa-star-o" aria-hidden="true"></i>
            </template>
          </button>

          <input placeholder="Filter name" v-model="filterText" class="input-filter vp-input" />
        </div>
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
    <div class="explorer-content-wrap scrollbar-mini">
      <FileList
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
.explorer-wrap {
  min-width: 300px;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;

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

        .input-addr {
          flex: 1;
          line-height: 1;
          padding: 4px 6px;
        }
        .input-filter {
          width: 100px;
          line-height: 1;
          padding: 4px 6px;
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
    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>
