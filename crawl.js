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

async function fetchHTML(url) {
  let res
  try {
    res = await fetch(url)
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

  return res.text()
}

// use default args to prime the first call
async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  // if this is an offiste URL, bail immediately
  const currentURLObj = new URL(currentURL)
  const baseURLObj = new URL(baseURL)
  if (currentURLObj.hostname !== baseURLObj.hostname) {
    return pages
  }

  // use a consistent URL format
  const normalizedURL = normalizeURL(currentURL)

  // if we've already visited this page
  // just increase the count and don't repeat
  // the http request
  if (pages[normalizedURL] > 0) {
    pages[normalizedURL]++
    return pages
  }

  // initialize this page in the map
  // since it doesn't exist yet
  pages[normalizedURL] = 1

  // fetch and parse the html of the currentURL
  console.log(`crawling ${currentURL}`)
  let html = ''
  try {
    html = await fetchHTML(currentURL)
  } catch (err) {
    console.log(`${err.message}`)
    return pages
  }

  // recur  through the page's links
  const nextURLs = getURLsFromHTML(html, baseURL)
  for (const nextURL of nextURLs) {
    pages = await crawlPage(baseURL, nextURL, pages)
  }

  return pages
}
  

export { normalizeURL, getURLsFromHTML, fetchHTML,crawlPage }