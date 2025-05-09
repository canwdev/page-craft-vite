<script lang="ts" setup>
import VueRender from './Tools/VueRender.vue'
import {defineComponent, PropType, toRefs} from 'vue'
import ItemAction from './ItemAction.vue'
import {StOptionItem, StOptionType} from './enum'
import TransitionBodyCollapse from '@/components/CanUI/packages/Transitions/TransitionBodyCollapse.vue'

const props = withDefaults(
  defineProps<{
    item: StOptionItem
    foldedKeyMap?: any
  }>(),
  {
    foldedKeyMap: {},
  },
)
const {item, foldedKeyMap} = toRefs(props)
const emit = defineEmits(['onToggleExpand', 'updateValue'])

const isExpanded = computed(() => {
  return !foldedKeyMap.value[item.value.key]
})

const handleItemClick = (e: Event, fn: any) => {
  if (typeof fn === 'function') {
    fn(e, item.value)
  }
}
</script>

<template>
  <div class="c-panel-item" :data-key="item.key" :key="item.key" :class="[item.cls]">
    <div class="panel-header vp-bg">
      <div class="p-left" :title="item.label">
        <div class="item-label">{{ item.label }}</div>
      </div>
      <div class="p-right">
        <div
          class="btn-no-style btn-toggle-expand"
          :class="{expanded: isExpanded}"
          v-if="!item.hideExpandIcon && item.children && item.children.length"
          @click="$emit('onToggleExpand', item)"
        >
          <svg
            style="width: 20px; height: 20px"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 20 20"
          >
            <g fill="none">
              <path
                d="M15.794 7.733a.75.75 0 0 1-.026 1.06l-5.25 5.001a.75.75 0 0 1-1.035 0l-5.25-5a.75.75 0 0 1 1.034-1.087l4.734 4.509l4.733-4.51a.75.75 0 0 1 1.06.027z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </div>
        <ItemAction :item="item" @updateValue="(v) => emit('updateValue', v)" />
      </div>
    </div>

    <TransitionBodyCollapse>
      <transition-group
        tag="div"
        name="fade-scale"
        v-if="item.children && item.children.length"
        v-show="isExpanded"
        class="panel-body"
      >
        <div
          v-for="(sItem, index) in item.children"
          :key="sItem.key || index"
          class="sub-item"
          :class="[{clickable: sItem.clickFn}, sItem.cls]"
          :data-key="sItem.key"
          @click="handleItemClick($event, sItem.clickFn)"
          v-bind="sItem.itemProps"
        >
          <VueRender v-if="sItem.render" :render-fn="sItem.render" />

          <template v-else>
            <div class="o-left">
              <div v-if="sItem.iconRender" class="item-icon" :title="sItem.label">
                <VueRender :render-fn="sItem.iconRender" />
              </div>
              <div v-else-if="sItem.icon" class="item-icon" :title="sItem.label">
                <img :src="sItem.icon" alt="icon" />
              </div>
              <div v-else-if="sItem.iconClass" class="item-icon" :title="sItem.label">
                <i :class="sItem.iconClass"></i>
              </div>
              <div class="item-title-wrap">
                <div class="item-label-wrap">
                  <span class="item-label">{{ sItem.label }}</span>
                  <el-tooltip v-if="sItem.tips" effect="light">
                    <svg
                      style="width: 16px; height: 16px"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlns:xlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 20 20"
                    >
                      <g fill="none">
                        <path
                          d="M10 2a8 8 0 1 1 0 16a8 8 0 0 1 0-16zm0 1a7 7 0 1 0 0 14a7 7 0 0 0 0-14zm0 10.5a.75.75 0 1 1 0 1.5a.75.75 0 0 1 0-1.5zm0-8a2.5 2.5 0 0 1 1.651 4.377l-.154.125l-.219.163l-.087.072a1.968 1.968 0 0 0-.156.149c-.339.36-.535.856-.535 1.614a.5.5 0 0 1-1 0c0-1.012.293-1.752.805-2.298a3.11 3.11 0 0 1 .356-.323l.247-.185l.118-.1A1.5 1.5 0 1 0 8.5 8a.5.5 0 0 1-1 .001A2.5 2.5 0 0 1 10 5.5z"
                          fill="currentColor"
                        ></path>
                      </g>
                    </svg>
                    <template #content>
                      <span v-html="sItem.tips"></span>
                    </template>
                  </el-tooltip>
                </div>
                <div class="item-subtitle" v-if="sItem.subtitle" v-html="sItem.subtitle"></div>
              </div>
            </div>
            <div class="o-right">
              <ItemAction :item="sItem" @updateValue="(v) => emit('updateValue', v)" />
            </div>
          </template>
        </div>
      </transition-group>
    </TransitionBodyCollapse>
  </div>
</template>

<style lang="scss">
.c-panel-item {
  .panel-header {
    min-height: 40px;
    padding: 4px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: bold;
    border-bottom: 1px solid $color_border;
    position: sticky;
    top: 0;
    z-index: 2;
    border-radius: 4px 4px 0 0;

    @media screen and (max-width: $mq_mobile_width) {
      min-height: 36px;
      padding: 4px 12px;
    }

    .p-left,
    .p-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-reset,
    .btn-toggle-expand {
      display: inline-flex;
      transition: all 0.3s;
      padding: 8px;
    }

    .btn-toggle-expand {
      &.expanded {
        transform: rotateX(180deg);
      }
    }
  }

  .panel-body {
    padding-top: 8px;
    padding-bottom: 8px;

    .sub-item {
      min-height: 40px;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.3s;
      gap: 8px;

      @media screen and (max-width: $mq_mobile_width) {
        padding: 4px 12px;
        gap: 4px;
      }

      &._drag-over {
        background-color: $primary_opacity;
      }

      &.clickable {
        cursor: pointer;
        &:hover {
          background-color: $color_border;
        }
      }

      .o-left {
        display: flex;
        align-items: center;
        gap: 8px;

        @media screen and (max-width: $mq_mobile_width) {
          gap: 4px;
          font-size: 14px;
        }

        .item-icon {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
          border-radius: 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          color: $primary;
          @media screen and (max-width: $mq_mobile_width) {
            width: 26px;
            height: 26px;
            font-size: 20px;
          }
          i,
          span {
            font-size: inherit;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }

        .item-title-wrap {
          line-height: 1.3;
        }

        .item-label-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .item-subtitle {
          font-size: 12px;
          font-weight: 400;
          opacity: 0.6;
          margin-top: 2px;
        }
      }
    }
  }
}
</style>
