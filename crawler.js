const puppeteer = require('puppeteer-core')
const { executablePath } = require('puppeteer')

const URL = 'https://vk.com/im/convo/248812621?entrypoint=list_all'

async function crawl() {
  try {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: executablePath(),
      userDataDir: '/home/manya/.config/chromium',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--profile-directory=Profile 1',
      ],
    })
    const page = await browser.newPage()
    await page.goto(URL, { waitUntil: 'load' })

    await new Promise(resolve => setTimeout(resolve, 5000))
    await page.waitForSelector('.ConvoHistory__messageBlock', { visible: true })
    const allMessages = await page.$$('.ConvoHistory__messageBlock')
    const messages = allMessages.slice(Math.max(allMessages.length - 20, 0))

    for (let index = 0; index < messages.length; index++) {
      const message = messages[index]

      const link = await message.$('a')
      if (link) {
        const href = await link.evaluate(element => element.href)
        if (href === 'https://vk.com/id339740727') {
          await message.click()
        }
      }

      if (index > 0) {
        const previousMessage = messages[index - 1]
        const isPreviousMessageSelected = await previousMessage.evaluate(element =>
          element.classList.contains('ConvoHistory__messageBlockSelected--withoutBubbles')
        )


        if (isPreviousMessageSelected) {
          await message.click()
        }
      }
    }

    await page.waitForSelector('.ComposerSelecting__action', { visible: true })
    const dropdownButtons = await page.$$('.ComposerSelecting__action')

    if (dropdownButtons.length > 1) {
      await dropdownButtons[1].hover()
      await new Promise(resolve => setTimeout(resolve, 5000))

      await page.waitForSelector('.ActionsMenuAction__title', { visible: true })
      const deleteButtons = await page.$$('.ActionsMenuAction__title')
      if (deleteButtons.length > 1) {
        await deleteButtons[1].click()
      }

      await page.waitForSelector('.vkuiAlert__button.vkuiButton.vkuiButton--size-m.vkuiButton--mode-tertiary', { visible: true })
      const modalButtons = await page.$$('.vkuiAlert__button.vkuiButton.vkuiButton--size-m.vkuiButton--mode-tertiary')
      if (modalButtons.length > 1) {
        await modalButtons[1].click()
      }
    }
  } catch (error) {
    console.error(error)
  }
}

crawl()
