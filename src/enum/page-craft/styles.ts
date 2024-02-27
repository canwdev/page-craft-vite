export const cssSnippetList = [
  {
    name: 'Flex View',
    code: ['display: flex;', 'align-items: center;', 'justify-content: space-between;'].join('\n'),
  },
  {
    name: 'Grid View',
    code: [
      'display: grid;',
      'grid-template-columns: repeat(5, 1fr);',
      'grid-template-rows: auto;',
      'gap: 30px;',
    ].join('\n'),
  },
  {
    name: 'Text Overflow',
    code: ['white-space: nowrap;', 'overflow: hidden;', 'text-overflow: ellipsis;'].join('\n'),
  },
  {
    name: 'Text Overflow Limit 3',
    code: [
      'display: -webkit-box;',
      '-webkit-line-clamp: 3;',
      '-webkit-box-orient: vertical;',
      'overflow: hidden;',
      'text-overflow: ellipsis;',
    ].join('\n'),
  },
  {
    name: 'Background Cover',
    code: [
      'background-image: url("");',
      'background-repeat: no-repeat;',
      'background-position: center;',
      'background-size: cover;',
    ].join('\n'),
  },
  {
    name: 'Absolute Center',
    code: [
      'position: absolute;',
      'top: 50%;',
      'left: 50%;',
      'transform: translate(-50%, -50%);',
    ].join('\n'),
  },
  {
    name: 'Absolute Full',
    code: ['position: absolute;', 'top: 0;', 'left: 0;', 'right: 0;', 'bottom: 0;'].join('\n'),
  },
  {
    name: 'Margin Center',
    code: ['max-width: 1200px', 'margin-left: auto;', 'margin-right: auto;'].join('\n'),
  },
  {
    name: 'Blur Card',
    code: [
      'background-color: rgba(255, 255, 255, 0.6);',
      'box-shadow: 0 1px 10px rgba(0, 0, 0, 0.27), inset 0 0 0.5px #fff;',
      'border: 1px solid rgba(0, 0, 0, .4);',
      'border-radius: 4px;',
      'backdrop-filter: blur(4px);',
    ].join('\n'),
  },
]

export const cssHelperClassList = [
  {
    name: '.btn-no-style',
    code: `.btn-no-style {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: inherit;
  padding: 0;
  text-decoration: none;

  &:active {
    opacity: 0.8;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}`,
  },
  {
    name: '.background-cover',
    code: `.background-cover {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}`,
  },
  {
    name: '.text-overflow',
    code: `.text-overflow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`,
  },
  {
    name: '.absolute-center',
    code: `.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
  },
  {
    name: '.absolute-full',
    code: `.absolute-full {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}`,
  },
  {
    name: '.flex',
    code: `.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-1 {
  flex: 1;
}

.flex-row {
  flex-direction: row;
}

.flex-column {
  flex-direction: column;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}`,
  },
  {
    name: '.scrollbar-mini',
    code: `.scrollbar-mini {
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    overflow: overlay;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid transparent;
    background-clip: content-box;
    background-color: #d8d8d8;

    &:hover {
      background-color: #bebebe;
    }
  }

  &::-webkit-scrollbar-track {
    border-radius: 4px;
    background: #f9f9f9;
  }
}`,
  },
  {
    name: '.font-code',
    code: `.font-code {
  font-family: 'Operator Mono', 'Source Code Pro', Menlo, Monaco, Consolas, 'Courier New', monospace;
}`,
  },
  {
    name: '.font-emoji',
    code: `.font-emoji {
  font-family: "Segoe UI Emoji", "SF Pro SC", "SF Pro Text", "SF Pro Icons", "PingFang SC", "Helvetica Neue", "Helvetica", "Arial", sans-serif;
}`,
  },
  {
    name: 'win2k',
    code: `.win2k-frame {
  background-color: silver;
  box-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px grey, inset 2px 2px #dfdfdf;

  @mixin active() {
    box-shadow: inset -1px -1px #fff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px grey;
    //text-shadow: 1px 1px #222;
    //color: transparent;
  }

  @mixin disabled() {
    text-shadow: 1px 1px 0 #fff;
  }

  @mixin focused() {
    outline: 1px dotted #000000;
    outline-offset: -4px;
  }

  &.active {
    @include active();
  }

  &.disabled {
    @include disabled();
  }

  &.focused {
    @include focused();
  }

  &.btn-no-style {
    &:active {
      @include active();
    }

    &:disabled {
      @include disabled();
    }

    &:focus {
      @include focused();
    }
  }
}

.win2k-field {
  box-shadow: inset -1px -1px #dfdfdf, inset 1px 1px grey;
}`,
  },
]

export const cssKeyFramesList = [
  {
    name: 'rotating180',
    code: `@keyframes rotating180 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(180deg);
  }
}`,
  },
  {
    name: 'rotating360',
    code: `@keyframes rotating360 {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}`,
  },
  {
    name: 'zoomIn',
    code: `@keyframes zoomIn {
  0% {
    transform: scale(1);
  }

  90% {
    transform: scale(5);
    opacity: 1;
  }

  95% {
    opacity: 0;
    transform: scale(5);
  }

  96% {
    transform: scale(1);
  }

  97% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}`,
  },
  {
    name: 'textFadeInUp',
    code: `@keyframes textFadeInUp {
  0% {
    opacity: 0;
    transform: translate3d(0, 25px, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}`,
  },
  {
    name: 'airShrinkIn',
    code: `@keyframes airShrinkIn {
  0% {
    opacity: 0;
    transform: scaleX(0.96);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}`,
  },
  {
    name: 'airShrinkInReverse',
    code: `@keyframes airShrinkInReverse {
  0% {
    opacity: 0;
    transform: scale(1.12);
  }

  100% {
    opacity: 1;
    transform: scaleX(1);
  }
}`,
  },
]

export const vue2TransitionsList = [
  {
    name: 'fade',
    code: `// <transition name="fade">
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}`,
  },
  {
    name: 'fade-up',
    code: `.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.23s;
}

.fade-up-enter, .fade-up-leave-to {
  opacity: 0;
  transform: translate3d(0, 5%, 0);
}`,
  },
  {
    name: 'slide-left',
    code: `.slide-left-enter-active, .slide-left-leave-active {
  transition: all .3s;
}

.slide-left-enter, .slide-left-leave-to {
  transform: translateX(15%);
  opacity: 0;
}
`,
  },
]

export const vue3TransitionsList = [
  {
    name: 'fade',
    code: `.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}`,
  },
  {
    name: 'scale',
    code: `.fade-scale-enter-active,
.fade-scale-leave-active {
  transform: scale(1);
  transition: opacity 0.3s, transform 0.3s;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.92);
  transition: opacity 0.3s, transform 0.3s;
}`,
  },
]

export const sassVariablesList = [
  {
    name: 'Theme Color',
    code: `$light: #fafafa;
$dark-alt: #1b1b1b;
$dark: #212121;

:root {
  --primary-rgb: 25, 107, 105;
  --primary: rgb(var(--primary-rgb));
  --aero-backdrop-filter: none;
  --aero-light-bg: #{$light};
  --aero-dark-bg: #{$dark};
  &.tk-aero, .tk-aero {
    --aero-backdrop-filter: saturate(180%) blur(20px);
    --aero-light-bg: rgba(255, 255, 255, 0.77);
    --aero-dark-bg: rgba(28, 28, 28, 0.77);
  }
}

$primary: var(--primary); // #8dbb72;
$primary-opacity: rgba(var(--primary-rgb), .25); //opacify($primary, 0.3);
$secondary: #ffc107; // #66CCFF;
$accent: #ec407a; // rgba(255, 128, 192);
$border-color: rgba(204, 204, 204, .5);
$separator-color: rgba(148, 148, 148, .3);
$common-padding: 8px 12px;
$common-transition: all .2s;
$border-radius: 2px;
$container-width: 1400px;
$container-padding: 10px;
$common-shadow: 0 0 6px -3px rgba(0, 0, 0, .5);

$layout-border: 1px solid $border-color;

@mixin lightBgMixin() {
  background: var(--aero-light-bg);
  backdrop-filter: var(--aero-backdrop-filter);
  color: $color-black;
}

@mixin darkBgMixin() {
  background: var(--aero-dark-bg);
  backdrop-filter: var(--aero-backdrop-filter);
  color: $color-white;
}`,
  },
  {
    name: 'Colors',
    code: `$success: #4caf50;
$error: #e91e63;
$info: #009688;
$warning: #ffc107;

$color-white: #ffffff;
$color-black: #000000;
$color-text: #333;

$color-blue: #007aff;
$color-brown: #a2845e;
$color-gray: #8e8e93;
$color-green: #28cd41;
$color-indigo: #5856d6;
$color-orange: #ff9500;
$color-pink: #ff2d55;
$color-purple: #af52de;
$color-red: #ff3b30;
$color-teal: #5ac8fa;
$color-yellow: #ffcc00;

$color-dark-blue: #0a84ff;
$color-dark-brown: #ac8e68;
$color-dark-gray: #98989d;
$color-dark-green: #32d74b;
$color-dark-indigo: #5e5ce6;
$color-dark-orange: #ff9f0a;
$color-dark-pink: #ff375f;
$color-dark-purple: #bf5af2;
$color-dark-red: #ff453a;
$color-dark-teal: #64d2ff;
$color-dark-yellow: #ffd60a;`,
  },
]

export const mediaQueryList = [
  {
    name: 'Media Query Variables',
    code: `$mq_mobile_min_width: 330px; // 618px // 426px
$mq_mobile_width: 567px; // 618px // 426px
$mq_mobile_height_land: 485px; // Landscape
$mq_tablet_width: 1024px; // 768px
$mq_pc_min_width: 1450px; // 1440px
$mq_pc_min_height: 768px; // 768px
$mq_pc_2k_width: 2300px; // 2560px
$mq_pc_2k_height: 1250px; // 1328px`,
  },
  {
    name: 'max-width',
    code: `@media screen and (max-width: $mq_mobile_width) {}`,
  },
  {
    name: 'min-width',
    code: `@media screen and (min-width: $mq_mobile_width) {}`,
  },
  {
    name: 'min-width and max-width and max-height',
    code: `@media screen and (min-width: $mq_mobile_width) and (max-width: $mq_tablet_width) and (max-height: $mq_mobile_height_land) {}`,
  },
]

export enum StyleTabType {
  GLOBAL = 'global',
  VARIABLES = 'variables',
  CURRENT = 'current',
}
