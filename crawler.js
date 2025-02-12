const puppeteer = require('puppeteer-core')
const { executablePath } = require('puppeteer')

const URL = 'https://vk.com/im/convo/248812621?cmid=510&entrypoint=list_all'

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

    await page.waitForSelector('.ConvoMessageWithoutBubble', { visible: true });
    await page.$$eval('.ConvoMessageWithoutBubble', messages => 
      messages
        .map(message => {
            const link = message.querySelector('a.ConvoMessageWithoutBubble__avatar')
            if (link?.href === 'https://vk.com/id339740727') {
              message.click()
              return message.textContent
            }
        })
    )

    await page.waitForSelector('.ComposerSelecting__action', { visible: true })
    const dropdownButtons = await page.$$('.ComposerSelecting__action')
    console.log("Number of .ComposerSelecting__action elements:", dropdownButtons.length)

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
  //} finally {
  //  browser?.close()
  //}
}

crawl()
