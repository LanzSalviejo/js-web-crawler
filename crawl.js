function normalizeURL(urlString) {
    try {
        const url = new URL(urlString)
        let fullPath = `${url.host}${url.pathname}`
        if (fullPath.slice(-1) === '/') {
            fullPath = fullPath.slice(0, -1)
        }
        return fullPath
    } catch(e) {
        console.error('Invalid URL provided', e)
    }
}

export { normalizeURL }