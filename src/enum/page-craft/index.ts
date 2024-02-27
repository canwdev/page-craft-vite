export enum LsKeys {
  GLOBAL_STYLE = 'page_craft_global_style',
  CURRENT_BLOCK = 'page_craft_current_block',
  /*组件专用 start*/
  COMP_HTML = 'page_craft_main_html',
  COMP_STYLE = 'page_craft_main_style',
  COMP_META = 'page_craft_comp_meta',
  COMPONENT_LIST = 'page_craft_component_list', // 已废弃，将自动升级到 COMP_INDEX_LIST
  COMP_INDEX_LIST = 'page_craft_component_index', // 新版本
  /*组件专用 end*/
  INDICATOR_OPTIONS = 'page_craft_indicator_options',
  TOOL_BAR_LIST = 'page_craft_tool_bar_list',
  VARIABLES_STYLE = 'page_craft_variables_style',
}

const CLASS_MOUSE_OVER = 'cls_mouse_over'
const DOT_CLASS_MOUSE_OVER = '.' + CLASS_MOUSE_OVER
const CLASS_MOUSE_OVER_PARENT = 'cls_mouse_over_parent'
const DOT_CLASS_MOUSE_OVER_PARENT = '.' + CLASS_MOUSE_OVER_PARENT
const CLASS_MAIN_CANVAS_ROOT = 'page-craft-mc'

export const TOOL_CLASSES = {
  CLASS_MOUSE_OVER,
  DOT_CLASS_MOUSE_OVER,
  CLASS_MOUSE_OVER_PARENT,
  DOT_CLASS_MOUSE_OVER_PARENT,
  CLASS_MAIN_CANVAS_ROOT,
}
