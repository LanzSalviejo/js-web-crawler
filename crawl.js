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

async function crawlPage(baseURL, currentURL, pages) {
    // fetch and parse the html of the currentURL
    console.log(`crawling ${currentURL}`)
  
    let res
    try {
      res = await fetch(currentURL)
    } catch (err) {
      throw new Error(`Got Network error: ${err.message}`)
    }
  
    if (res.status > 399) {
      console.log(`Got HTTP error: ${res.status} ${res.statusText}`)
      return
    }
  
    const contentType = res.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
      console.log(`Got non-HTML response: ${contentType}`)
      return
    }
  
    console.log(await res.text())
  }
  

export { normalizeURL, getURLsFromHTML, crawlPage }