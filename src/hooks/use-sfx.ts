import {useSound} from '@vueuse/sound'
import sfxOpen from '@/assets/sound/open.ogg'
import sfxClose from '@/assets/sound/close1.ogg'
import sfxSelect from '@/assets/sound/select_pattern_mix.ogg'
import sfxWood from '@/assets/sound/wood_mix.ogg'
import sfxGrass from '@/assets/sound/grass_mix.ogg'
import sfxLoading from '@/assets/sound/loading_middle2.ogg'
import sfxShoot from '@/assets/sound/shoot2.ogg'
import sfxBrush from '@/assets/sound/brushing_generic2.ogg'
import sfxBell from '@/assets/sound/bell.ogg'
import sfxFill from '@/assets/sound/fill1.ogg'
import sfxGuitar from '@/assets/sound/guitar.ogg'
import sfxBass from '@/assets/sound/bass.ogg'
import sfxPop from '@/assets/sound/pop-down.mp3'
import {useSettingsStore} from '@/store/settings'

export const SFX_VOLUME = 1

export const useOpenCloseSound = (watchFn) => {
  const settingsStore = useSettingsStore()

  const {play: playSfxOpen} = useSound(sfxOpen, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
  const {play: playSfxClose} = useSound(sfxClose, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
  watch(watchFn, (val) => {
    if (val) {
      playSfxOpen()
    } else {
      playSfxClose()
    }
  })
}
export const useSfxOpenCloseSelect = (watchFn) => {
  const settingsStore = useSettingsStore()

  const {play: playSfxOpen} = useSound(sfxLoading, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
  const {play: playSfxClose} = useSound(sfxShoot, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
  watch(watchFn, (val) => {
    if (val) {
      playSfxOpen()
    } else {
      playSfxClose()
    }
  })
}

export const useSfxSelect = () => {
  const settingsStore = useSettingsStore()
  const {play: playSfx, stop} = useSound(sfxSelect, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
    sprite: {
      id_0: [0, 500],
      id_1: [600, 539],
      id_2: [1196, 539],
      id_3: [1878, 576],
      id_4: [2472, 696],
    },
  })

  const play = () => {
    // @ts-ignore
    playSfx({id: `id_${Math.floor(Math.random() * 5)}`})
  }
  return {play, stop}
}

export const useSfxPlace = () => {
  const settingsStore = useSettingsStore()
  const {play: playSfx} = useSound(sfxWood, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
    sprite: {
      id_0: [0, 300],
      id_1: [420, 300],
      id_2: [900, 300],
      id_3: [1420, 300],
    },
  })

  // @ts-ignore
  const play = () => playSfx({id: `id_${Math.floor(Math.random() * 4)}`})
  return {play}
}

export const useSfxDestroy = () => {
  const settingsStore = useSettingsStore()
  const {play: playSfx} = useSound(sfxGrass, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
    sprite: {
      id_0: [0, 400],
      id_1: [400, 500],
      id_2: [900, 400],
      id_3: [1400, 600],
    },
  })

  // @ts-ignore
  const play = () => playSfx({id: `id_${Math.floor(Math.random() * 4)}`})
  return {play}
}

export const useSfxBrush = () => {
  const settingsStore = useSettingsStore()
  return useSound(sfxBrush, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
}
export const useSfxBell = () => {
  const settingsStore = useSettingsStore()
  return useSound(sfxBell, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
}

export const useSfxFill = () => {
  const settingsStore = useSettingsStore()
  return useSound(sfxFill, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
}
export const useSfxGuitar = () => {
  const settingsStore = useSettingsStore()
  return useSound(sfxGuitar, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
}
export const useSfxBass = () => {
  const settingsStore = useSettingsStore()
  return useSound(sfxBass, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
}

export const useSfxPop = () => {
  const settingsStore = useSettingsStore()
  return useSound(sfxPop, {
    volume: SFX_VOLUME,
    soundEnabled: settingsStore.enableSoundFx,
  })
}
