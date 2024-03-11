export enum LsKeys {
  GLOBAL_STYLE = 'page_craft_global_style',
  CURRENT_BLOCK = 'page_craft_current_block',
  /*组件专用 start*/
  COMP_HTML = 'page_craft_main_html',
  COMP_STYLE = 'page_craft_main_style',
  COMP_META = 'page_craft_comp_meta',
  // 组件名目录
  COMP_INDEX_LIST = 'page_craft_component_index',
  /*组件专用 end*/
  INDICATOR_OPTIONS = 'page_craft_indicator_options',
  TOOL_BAR_LIST = 'page_craft_tool_bar_list',
  VARIABLES_STYLE = 'page_craft_variables_style',
  /* i18n */
  I18N_FILE_HANDLE_HISTORY = 'page_craft_i18n_file_handle_history',
  I18N_FOLDER_HANDLE_HISTORY = 'page_craft_i18n_folder_handle_history',
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
