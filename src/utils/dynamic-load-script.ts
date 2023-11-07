const dynamicLoadScript = (src: string) => {
  return new Promise((resolve: any, reject: any) => {
    const existingScript = document.getElementById(src)
    if (!existingScript) {
      const script = document.createElement('script')
      script.src = src // src url for the third-party library being loaded.
      script.id = src

      script.onload = function () {
        // this.onload = null here is necessary
        // because even IE9 works not like others
        this.onerror = this.onload = null
        resolve()
      }
      script.onerror = function (e) {
        this.onerror = this.onload = null
        reject(e)
      }

      document.body.appendChild(script)
    } else {
      // script already loaded
      resolve()
    }
  })
}

export default dynamicLoadScript
