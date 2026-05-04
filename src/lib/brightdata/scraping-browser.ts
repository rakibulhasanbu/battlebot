import { chromium } from 'playwright-core';

const SBR_WS_ENDPOINT = `wss://${process.env.BRIGHTDATA_AUTH}@brd.superproxy.io:9222`;

export async function withScrapingBrowser<T>(
  url: string,
  extractor: (page: import('playwright-core').Page) => Promise<T>
): Promise<T> {
  const browser = await chromium.connectOverCDP(SBR_WS_ENDPOINT);
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    return await extractor(page);
  } finally {
    await browser.close();
  }
}
