const { chromium } = require('playwright');

const TARGET_URL = 'http://localhost:5173';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  // Light mode
  await page.goto(TARGET_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/tmp/geeky-teal-light.png', fullPage: true });
  console.log('Screenshot: /tmp/geeky-teal-light.png');

  // Dark mode
  const themeBtn = page.locator('.hidden.md\\:flex button').first();
  await themeBtn.click();
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/tmp/geeky-teal-dark.png', fullPage: true });
  console.log('Screenshot: /tmp/geeky-teal-dark.png');

  console.log('\n=== Browser open for preview. Close window when done. ===');
  await page.waitForEvent('close', { timeout: 300000 }).catch(() => {});
  await browser.close();
})();
