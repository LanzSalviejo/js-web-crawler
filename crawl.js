import { JSDOM } from 'jsdom'

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

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const anchors = dom.window.document.querySelectorAll('a')

    for (const anchor of anchors) {
        if (anchor.hasAttribute('href')) {
            let href = anchor.getAttribute('href')

            try {
                // convert any relative URL into absolute URLs
                href = new URL(href, baseURL).href
                urls.push(href)
            } catch(e) {
                console.log(`${e.message}: ${href}`)
            }
        }
    }

    return urls
}

export { normalizeURL, getURLsFromHTML }