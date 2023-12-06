export enum LdThemeType {
  SYSTEM = 0,
  LIGHT = 1,
  DARK = 2,
}

export const ldThemeOptions = [
  {
    label: 'Follow System',
    value: LdThemeType.SYSTEM,
  },
  {
    label: 'Light Theme',
    value: LdThemeType.LIGHT,
  },
  {
    label: 'Dark Theme',
    value: LdThemeType.DARK,
  },
]

export enum CustomThemeType {
  DEFAULT = 'theme-default',
  WIN8 = 'theme-win8',
  CLASSIC = 'theme-classic',
  MINIMALISM = 'theme-minimalism',
}

export const customThemeOptions = [
  {
    label: 'Default',
    value: CustomThemeType.DEFAULT,
  },
  {
    label: 'Minimalism',
    value: CustomThemeType.MINIMALISM,
  },
  {
    label: 'Win8',
    value: CustomThemeType.WIN8,
  },
  {
    label: 'Classic',
    value: CustomThemeType.CLASSIC,
  },
]

export enum FilterType {
  ALL = 'all',
  STARED = 'stared',
  NOT_STARED = 'not_starred',
}
