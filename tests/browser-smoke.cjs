// Run with Playwright installed (or NODE_PATH pointing to its installation).
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const path = require('node:path');
const {pathToFileURL} = require('node:url');

(async () => {
  const browser = await chromium.launch({channel: 'msedge', headless: true});
  try {
    const page = await browser.newPage();
    const errors = [];
    async function backToMap(){
      if(await page.locator('#world').evaluate(e=>e.classList.contains('diving'))){
        await page.locator('.scene-guide').evaluate(e=>e.getAnimations().forEach(a=>a.finish()));
        await page.locator('#destinationRoom').waitFor({state:'visible'});
      }
      if(await page.locator('#destinationRoom').isVisible()) await page.locator('#returnToVortex').click();
    }
    page.on('pageerror', e => errors.push(e.message));
    await page.route('https://cdn.jsdelivr.net/**', route => route.fulfill({path: path.join(path.dirname(require.resolve('astronomy-engine')), 'astronomy.browser.min.js'), contentType: 'application/javascript'}));
    let mode = 'ok';
    await page.route('https://geocoding-api.open-meteo.com/**', async route => {
      if (mode === 'error') return route.fulfill({status:503, body:'Unavailable'});
      return route.fulfill({json:{results:[{name:'New York <b>city</b>', admin1:'New York', country:'United States', latitude:40.7128, longitude:-74.006, timezone:"America/New_York"}]}});
    });
    await page.goto(pathToFileURL(path.resolve(__dirname,'../frontend/rabbit-hole-v1.html')).href);
    await page.getByRole('link',{name:'Use my actual chart →'}).click();
    await page.locator('#followOpening').waitFor({state:'visible'});
    assert.equal(await page.locator('.birth-panel').isVisible(),false);
    await page.locator('#followOpening').click();
    await page.getByRole('button',{name:'What I need',exact:true}).click();
    assert.match(await page.locator('.hero h1').innerText(),/feel at home/);
    await page.locator('#followOpening').click();
    await page.locator('#date').fill('2000-01-01');
    await page.locator('#time').fill('07:00');
    assert.equal(await page.locator('#tz').count(),0);
    await page.locator('#place').fill('New York');
    await page.locator('button.submit').click();
    await page.locator('#deeper').waitFor({state:'visible'});
    await page.locator('#chartLedger summary').click();
    await page.locator('#result').waitFor({state:'visible'});
    assert.match(await page.locator('#cards').innerText(), /Sun in Capricorn/);
    assert.match(await page.locator('#resolvedPlace').innerText(), /<b>city<\/b>/);
    assert.equal(await page.locator('#resolvedPlace b').count(), 0);
    await page.locator('#destinationRoom').waitFor({state:'visible'});
    assert.match(await page.locator('#roomTitle').innerText(),/Moon in Scorpio/);
    await backToMap();
    await page.locator('.planet-stop[data-destination=Venus]').click();
    assert.equal(await page.locator('.scene-guide').evaluate(e=>e.getAnimations()[0].effect.getKeyframes().at(-1).opacity),'0');
    await page.locator('#motionToggle').click();
    await page.locator('#destinationRoom').waitFor({state:'visible'});
    assert.match(await page.locator('#roomTitle').innerText(),/Venus/);
    await page.locator('#motionToggle').click();
    await backToMap();
    await page.evaluate(()=>{document.querySelector('.planet-stop[data-destination=Sun]').click();document.querySelector('.planet-stop[data-destination=Pluto]').click()});
    await page.locator('#destinationRoom').waitFor({state:'visible'});
    assert.match(await page.locator('#roomTitle').innerText(),/Pluto/);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#destinationRoom').isVisible(),false);
    for (const thread of ['Sun','Moon','North Node','Pluto']) {
      await page.locator(`[data-thread="${thread}"]`).click();
      for (const label of ['WHAT','HOW','WHERE','WAIT… WHAT DOES THAT MEAN?','DEEPER']) {
        assert.equal(await page.locator('#rabbitLabel').innerText(),label);
        assert.equal(await page.locator('#world').getAttribute('data-stage'),String(['WHAT','HOW','WHERE','WAIT… WHAT DOES THAT MEAN?','DEEPER'].indexOf(label)));
        if(label==='WHERE'){await backToMap();await page.getByRole('button',{name:'Explore House 4: Home',exact:true}).click();assert.match(await page.locator('#guideSpeech').innerText(),/House 4/);}
        await page.locator('#rabbitNext').click();
      }
    }
    for(const name of ['Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','South Node']){
      await backToMap();
      await page.locator('.planet-stop[data-destination="'+name+'"]').click();
      assert.equal(await page.locator('#rabbitTitle').innerText(),name);
      assert.equal(await page.locator('.scene-guide').getAttribute('data-destination'),name);
    }
    await backToMap();
    await page.getByRole('button',{name:'Explore House 8: Shared resources',exact:true}).click();
    assert.equal(await page.locator('.scene-guide').getAttribute('data-destination'),'House 8');
    await page.locator('#time').fill('08:00');
    assert.equal(await page.locator('#result').isVisible(),false);
    mode='error';
    await page.locator('button.submit').click();
    await page.getByRole('alert').filter({hasText:"couldn't look up"}).waitFor();
    assert.equal(await page.locator('#deeper').isVisible(),false);
    assert.equal(await page.locator('button.submit').isEnabled(),true);
    mode='ok';
    await page.locator('button.submit').click();
    await page.locator('#deeper').waitFor({state:'visible'});
    await page.locator('#chartLedger summary').click();
    await page.locator('#result').waitFor({state:'visible'});
    assert.equal(await page.locator('#rabbitLabel').innerText(),'WHAT');
    assert.notEqual(await page.locator('#sceneEmblem').evaluate(e=>getComputedStyle(e).animationName),'none');
    await page.locator('#motionToggle').click();
    assert.equal(await page.locator('#motionToggle').getAttribute('aria-pressed'),'true');
    await page.getByRole('button',{name:'Go to How',exact:true}).click();
    assert.equal(await page.locator('#rabbitLabel').innerText(),'HOW');
    await page.locator('#chartLedger summary').click();
    await page.locator('#deeper').scrollIntoViewIfNeeded();
    await page.screenshot({path:'tests/experience-desktop.png',fullPage:true});
    await page.setViewportSize({width:390,height:844});
    await page.locator('#world').scrollIntoViewIfNeeded();
    for(const button of await page.locator('.planet-stop').all()){await backToMap();await button.click();assert.equal(await page.locator('.scene-guide').getAttribute('data-destination'),await button.getAttribute('data-destination'));}
    await backToMap();
    await page.locator('.planet-stop[data-destination=Moon]').click();
    assert.equal(await page.locator('.scene-guide').getAttribute('data-destination'),'Moon');
    await page.locator('#destinationRoom').waitFor({state:'visible'});
    assert.match(await page.locator('#roomTitle').innerText(),/Moon in Scorpio/);
    await page.locator('#world').screenshot({path:'tests/experience-room.png'});
    await backToMap();
    await page.locator('#world').screenshot({path:'tests/experience-mobile.png'});
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('#sceneEmblem').evaluate(e=>getComputedStyle(e).animationName),'none');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.goto(pathToFileURL(path.resolve(__dirname,'../frontend/chart-rabbit.html')).href);
    await page.locator('#skipOpening').click();
    assert.equal(await page.locator('.birth-panel').isVisible(),true);
    assert.deepEqual(errors,[]);
    console.log('Browser smoke passed: entry link, real chart, all threads/layers, safe place text, invalidation, failure/retry, mobile width.');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1});
