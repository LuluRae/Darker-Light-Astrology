// Run with Playwright available through NODE_PATH and Edge installed.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const engine = require('../frontend/chart-engine.js')(require('astronomy-engine'));
const expected = engine.calculate(new Date('2000-01-01T12:00:00Z'),40.7128,-74.006).list.find(p=>p.name==='Moon');

(async () => {
  const browser = await chromium.launch({channel:'msedge', headless:true});
  try {
    const page = await browser.newPage({viewport:{width:1280,height:900},acceptDownloads:true});
    const errors = [], external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {if(request.url().startsWith('https:')) external.push(request.url());});
    await page.route('https://cdn.jsdelivr.net/**', route => route.fulfill({path:path.join(path.dirname(require.resolve('astronomy-engine')),'astronomy.browser.min.js'),contentType:'application/javascript'}));
    await page.route('https://geocoding-api.open-meteo.com/**', route => route.fulfill({json:{results:[{name:'New York',latitude:40.7128,longitude:-74.006,timezone:'America/New_York'}]}}));
    const url = pathToFileURL(path.resolve(__dirname,'../frontend/chart-rabbit.html')).href;
    async function enter() {
      await page.goto(url); await page.locator('#skipOpening').click();
      await page.locator('#date').fill('2000-01-01'); await page.locator('#time').fill('07:00'); await page.locator('#place').fill('New York');
      await page.locator('button.submit').click(); await page.locator('#deeper').waitFor({state:'visible'});
      await page.locator('[data-thread=Moon]').click(); await page.locator('.moon-chapter').waitFor({state:'visible'});
    }
    await enter();
    const requestsBefore = external.length;
    assert.match(await page.locator('#moonFact').innerText(),new RegExp(expected.sign));
    assert.equal(await page.locator('#moonDoorNumber').innerText(),String(expected.house).padStart(2,'0'));
    assert.equal(await page.locator('#chartMap').evaluate(el=>el.inert),true);
    await page.locator('#world').screenshot({path:'tests/experience-moon-desktop.png'});
    // Guided route; actual keyboard activation and focus delivery, then save a literal note.
    for (const key of ['mirror','door','cup']) {
      await page.locator('#moonContinue').focus(); await page.keyboard.press('Enter');
      assert.equal(await page.locator(`[data-moon-stop=${key}]`).getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('#moonDiscoveryTitle').evaluate(el=>el===document.activeElement),true);
      if(key==='mirror') {
        assert.ok(await page.locator('.moon-rabbit').evaluate(el=>el.getAnimations().length>0));
        await page.locator('#motionToggle').click();
        assert.equal(await page.locator('.moon-rabbit').evaluate(el=>el.getAnimations().length),0);
        assert.equal(await page.locator('.moon-water').evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
      }
    }
    const note = '<img src=x onerror=alert(1)> I can make time for a quiet walk.';
    await page.locator('#moonReflection').fill(note); await page.locator('#moonContinue').click();
    assert.match(await page.locator('#moonProgress').innerText(),/3 of 3/);
    assert.equal(await page.locator('#moonSavedNote').innerText(),note);
    assert.equal(await page.locator('#moonSavedNote img').count(),0);
    const [download] = await Promise.all([page.waitForEvent('download'),page.locator('#moonDownload').click()]);
    assert.equal(download.suggestedFilename(),'my-moon-note.txt');
    const chunks = []; for await (const chunk of await download.createReadStream()) chunks.push(chunk);
    const saved = Buffer.concat(chunks).toString('utf8');
    assert.ok(saved.includes(note)); assert.ok(saved.includes(`Moon in ${expected.sign}`)); assert.ok(saved.includes(`House ${expected.house}`));
    assert.equal(external.length,requestsBefore);
    await page.locator('#world').screenshot({path:'tests/experience-moon-keepsake.png'});
    await page.locator('#moonToVenus').click(); await page.locator('#destinationRoom').waitFor({state:'visible'});
    assert.match(await page.locator('#roomTitle').innerText(),/Venus/); assert.equal(await page.locator('.moon-chapter').isVisible(),false);
    await page.locator('[data-thread=Moon]').click();
    assert.equal(await page.locator('#moonSavedNote').innerText(),note);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#destinationRoom').isVisible(),false);
    assert.equal(await page.locator('.planet-stop[data-destination=Moon]').evaluate(el=>el===document.activeElement),true);
    await page.locator('#time').fill('08:00');
    assert.equal(await page.locator('#moonReflection').inputValue(),'');
    await page.locator('button.submit').click(); await page.locator('#deeper').waitFor({state:'visible'});
    await page.locator('[data-thread=Moon]').click();
    assert.match(await page.locator('#moonProgress').innerText(),/0 of 3/);
    assert.equal(await page.locator('#moonKeepsake').isVisible(),false);
    // New viewport, reduced motion, out-of-order exploration, no horizontal scrolling.
    await page.emulateMedia({reducedMotion:'reduce'}); await page.setViewportSize({width:390,height:844}); await enter();
    for (const key of ['cup','mirror','door']) {
      await page.locator(`[data-moon-stop=${key}]`).click();
      assert.equal(await page.locator(`[data-moon-stop=${key}]`).getAttribute('aria-pressed'),'true');
      assert.equal(await page.locator('.moon-rabbit').evaluate(el=>el.getAnimations().length),0);
    }
    assert.match(await page.locator('#moonProgress').innerText(),/3 of 3/);
    assert.equal(await page.locator('.moon-water').evaluate(el=>getComputedStyle(el).animationName),'none');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('#world').screenshot({path:'tests/experience-moon-mobile.png'});
    await page.locator('#returnToVortex').click();
    assert.equal(await page.locator('#chartMap').evaluate(el=>el.inert),false);
    assert.ok(await page.locator('.planet-stop[data-destination=Moon]').evaluate(el=>{const rect=el.getBoundingClientRect();return rect.top>=0 && rect.bottom<=innerHeight;}));
    assert.deepEqual(errors,[]);
    console.log('Moon browser passed: actual placement, guided/free exploration, keyboard focus, private text download, retention/reset, motion, mobile, and no new network requests.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
