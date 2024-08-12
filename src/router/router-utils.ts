import pkg from '../../package.json'

export const formatSiteTitle = (t?: string) => {
  const title = `v${pkg.version} PageCraft Toolbox`
  if (!t) {
    return title
  }
  return `${t} - ${title}`
}

export const getPkg = () => pkg
