export enum LdThemeType {
  SYSTEM = 0,
  LIGHT = 1,
  DARK = 2,
}

export const ldThemeOptions = [
  {
    label: 'Auto',
    value: LdThemeType.SYSTEM,
  },
  {
    label: 'Light',
    value: LdThemeType.LIGHT,
  },
  {
    label: 'Dark',
    value: LdThemeType.DARK,
  },
]

export enum SettingsTabType {
  COMMON,
  AI,
  I18N,
}

export const StyleEditorKeys = {
  GLOBAL_STYLE: 'page_craft_global_style',
  VARIABLES_STYLE: 'page_craft_variables_style',
  CURRENT_STYLE: 'page_craft_current_style',
  CURRENT_TAB: 'page_craft_style_editor_tab',
  CUSTOM_SNIPPETS: 'page_craft_style_custom_snippets',
}

export const PageCraftKeys = {
  LANGUAGE: 'page_craft_language',
  CURRENT_BLOCK: 'page_craft_current_block',
  /*组件专用 start*/
  COMP_HTML: 'page_craft_main_html',
  COMP_STYLE: 'page_craft_main_style',
  COMP_META: 'page_craft_comp_meta',
  // 组件名目录
  COMP_INDEX_LIST: 'page_craft_component_index',
  // 默认画布
  DEFAULT_CANVAS: 'page_craft_default_canvas',
  /*组件专用 end*/
  INDICATOR_OPTIONS: 'page_craft_indicator_options',
  TOOL_BAR_LIST: 'page_craft_tool_bar_list',
}

export const LS_SettingsKey = {
  RICH_TEXT_TOOL_VALUE: 'rich_text_tool_value',

  MC_EXPLORER_BASE_PATH: 'mc_explorer_base_path',
  MC_EXPLORER_COMPONENT_SORT_TYPE: 'mc_explorer_component_sort_type',
  MC_EXPLORER_COMPONENT_DIR_STAR_LIST: 'mc_explorer_component_dir_star_list',
  PAGECRAFT_IFRAME_BROWSER_URL: 'pagecraft_iframe_browser_url',

  QUICK_LAUNCH_CUSTOM_PLUGINS: 'quick_launch_custom_plugins',

  // i18n tools
  TEXT_CONVERTER_COPY_MODE: 'text_converter_copy_mode',
  EXCEL_COPY_TOOL_COPY_MODE: 'excel_copy_tool_copy_mode',
  VUE_I18N_DIR_TOOL_EDIT_MODE: 'vue_i18n_dir_tool_edit_mode',
  VUE_I18N_DIR_TOOL_EXPANDED_KEYS: 'vue_i18n_dir_tool_expanded_keys',

  // pinia store
  LS_KEY_I18N_TOOL_SETTINGS: 'ls_key_i18n_tool_settings',
  LS_KEY_PAGECRAFT_AI_SETTINGS: 'ls_key_pagecraft_ai_settings',
  LS_KEY_PAGECRAFT_SETTINGS: 'ls_key_pagecraft_settings',

  // others
  MC_INPUT_HISTORY_CLASS: 'mc_input_history_class',

  ...StyleEditorKeys,
  ...PageCraftKeys,
}

// useIDBKeyval 保存所需的 key
export const IDBSettingsKey = {
  I18N_FILE_HANDLE_HISTORY: 'page_craft_i18n_file_handle_history',
  I18N_FOLDER_HANDLE_HISTORY: 'page_craft_i18n_folder_handle_history',
  PAGE_CRAFT_AI_CHARACTERS: 'page_craft_ai_characters',
  PAGE_CRAFT_AI_HISTORY_GROUP: 'page_craft_ai_history_group',
}
