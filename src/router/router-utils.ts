import pkg from '../../package.json'

export const formatSiteTitle = (t?: string) => {
  const title = `Page Craft v${pkg.version}`
  if (!t) {
    return title
  }
  return `${t} - ${title}`
}

export const getPkg = () => pkg
