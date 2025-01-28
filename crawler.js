const puppeteer = require('puppeteer-core')
const { executablePath } = require('puppeteer')

const URL = ''

async function crawl() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: executablePath(),
    })
    const page = await browser.newPage()
    await page.goto(URL, { waitUntil: 'load', timeout: 0 })

    const flatsLinksForOnePage = await page.$$eval('a[data-marker="item-title"]', items => { 
      return items.map(link => link.href)
    })
    console.log(flatsLinksForOnePage)

  } catch (error) {
    console.error(error)
  }
  //} finally {
  //  browser?.close()
  //}
}

crawl()
