import { crawlPage } from "./crawl.js";

async function main() {
    if (process.argv.length < 3) {
        console.log('No website provided')
        return
    } 
    if (process.argv.length > 3) {
        console.log('Too many arguments provided')
        return
    }

    const baseURL = process.argv[2]

    console.log(`Starting crawl of: ${baseURL}...`)

    const pages = await crawlPage(baseURL)

    console.log(pages)
}

main()