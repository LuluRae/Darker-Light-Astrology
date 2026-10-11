<?php
/**
 * My Rabbit Hole member dashboard.
 *
 * WordPress automatically uses this template for a Page whose slug is
 * `my-rabbit-hole`.
 */

get_header();

$dashboard_url = get_permalink();
$login_url     = wp_login_url( $dashboard_url );
$register_url  = wp_registration_url();
?>

<main id="content" class="mrh-shell">
    <section class="mrh-hero" aria-labelledby="mrh-title">
        <p class="mrh-eyebrow">Darker Light Astrology</p>
        <h1 id="mrh-title">My Rabbit Hole</h1>
        <p class="mrh-intro">Your chart. Your guide. Your threads. Pick up exactly where you left off.</p>
    </section>

    <?php if ( ! is_user_logged_in() ) : ?>
        <section class="mrh-panel mrh-login-panel">
            <div class="mrh-orbit" aria-hidden="true">☾</div>
            <p class="mrh-kicker">The rabbit remembers — once you sign in.</p>
            <h2>Welcome back.</h2>
            <p>Sign in to load your saved guide, birth details, discoveries, and progress through the rabbit hole.</p>
            <div class="mrh-actions">
                <a class="mrh-button mrh-button-primary" href="<?php echo esc_url( $login_url ); ?>">Sign in</a>
                <?php if ( get_option( 'users_can_register' ) ) : ?>
                    <a class="mrh-button" href="<?php echo esc_url( $register_url ); ?>">Create an account</a>
                <?php endif; ?>
            </div>
        </section>
    <?php else :
        $user = wp_get_current_user();
        $api_url = rest_url( 'darker-light-astrology/v1/me' );
        $nonce   = wp_create_nonce( 'wp_rest' );
        ?>
        <section class="mrh-welcome mrh-panel">
            <div>
                <p class="mrh-kicker">Welcome back</p>
                <h2><?php echo esc_html( $user->display_name ); ?></h2>
                <p id="mrh-summary">Let’s see where the thread left you.</p>
            </div>
            <a class="mrh-button" href="<?php echo esc_url( home_url( '/' ) ); ?>">Return to the rabbit hole →</a>
        </section>

        <div id="mrh-status" class="mrh-status" role="status" aria-live="polite">Loading your saved path…</div>

        <section class="mrh-grid" aria-label="My Rabbit Hole dashboard">
            <article class="mrh-panel mrh-guide-panel">
                <p class="mrh-kicker">My Guide</p>
                <h2>Who are you following?</h2>
                <p class="mrh-muted">Your guide changes the voice of the journey — not the astrology underneath it.</p>
                <div class="mrh-guide-grid" id="mrh-guides">
                    <button type="button" class="mrh-guide" data-guide="rabbit"><span>🐇</span><strong>The Rabbit</strong><small>Follow the thread.</small></button>
                    <button type="button" class="mrh-guide" data-guide="hatter"><span>🎩</span><strong>The Hatter</strong><small>Question everything.</small></button>
                    <button type="button" class="mrh-guide" data-guide="cat"><span>◡</span><strong>The Cat</strong><small>Look underneath.</small></button>
                    <button type="button" class="mrh-guide" data-guide="caterpillar"><span>〰</span><strong>The Caterpillar</strong><small>Who are you becoming?</small></button>
                    <button type="button" class="mrh-guide" data-guide="queen"><span>♛</span><strong>The Queen</strong><small>What are you willing to face?</small></button>
                </div>
            </article>

            <article class="mrh-panel">
                <p class="mrh-kicker">My Chart</p>
                <h2>Birth details</h2>
                <p class="mrh-muted">Saved privately to your account so you do not have to enter them every visit.</p>
                <div class="mrh-form-grid">
                    <label>Birth date<input id="mrh-birth-date" type="date" autocomplete="bday"></label>
                    <label>Birth time<input id="mrh-birth-time" type="time"></label>
                    <label class="mrh-span-2">Birth place<input id="mrh-birth-place" type="text" maxlength="180" placeholder="City, State / Country" autocomplete="off"></label>
                    <label>UTC offset<input id="mrh-utc-offset" type="number" min="-14" max="14" step="0.25" placeholder="-5"></label>
                </div>
                <p class="mrh-privacy">Only save birth details you want associated with this account. You can erase them below at any time.</p>
            </article>

            <article class="mrh-panel">
                <p class="mrh-kicker">Continue Exploring</p>
                <h2>Where did you leave off?</h2>
                <label class="mrh-stage-label" for="mrh-current-stage">Current layer</label>
                <select id="mrh-current-stage">
                    <option value="">Choose a layer</option>
                    <option value="planets">Planets — the what</option>
                    <option value="signs">Signs — the how</option>
                    <option value="houses">Houses — the where</option>
                    <option value="aspects">Aspects — the conversation</option>
                    <option value="nodes">Nodes — the thread</option>
                    <option value="lilith">Lilith — what wants to be reclaimed</option>
                    <option value="pluto">Pluto — what is transforming</option>
                    <option value="transits">Transits — what is active now</option>
                    <option value="patterns">Patterns — what keeps showing up</option>
                </select>

                <div class="mrh-stage-list" id="mrh-stage-list">
                    <?php
                    $stages = array(
                        'planets'  => 'Planets',
                        'signs'    => 'Signs',
                        'houses'   => 'Houses',
                        'aspects'  => 'Aspects',
                        'nodes'    => 'Nodes',
                        'lilith'   => 'Lilith',
                        'pluto'    => 'Pluto',
                        'transits' => 'Transits',
                        'patterns' => 'Patterns',
                    );
                    foreach ( $stages as $key => $label ) :
                        ?>
                        <label class="mrh-stage"><input type="checkbox" value="<?php echo esc_attr( $key ); ?>"> <span><?php echo esc_html( $label ); ?></span></label>
                    <?php endforeach; ?>
                </div>
            </article>

            <article class="mrh-panel">
                <p class="mrh-kicker">My Threads</p>
                <h2>What keeps showing up?</h2>
                <p class="mrh-muted">One discovery per line. Keep the questions, patterns, and strange little connections you want to return to.</p>
                <textarea id="mrh-threads" rows="8" maxlength="4000" placeholder="I keep noticing…&#10;Why does this pattern repeat?&#10;Look at Pluto in…"></textarea>
                <p class="mrh-privacy">These notes are saved in your private member profile.</p>
            </article>

            <article class="mrh-panel mrh-coming-soon">
                <p class="mrh-kicker">My Readings</p>
                <h2>Your sessions, together.</h2>
                <p>Next layer: completed readings, follow-up notes, and future bookings in one place.</p>
                <span class="mrh-chip">Coming next</span>
            </article>

            <article class="mrh-panel mrh-coming-soon">
                <p class="mrh-kicker">My Library</p>
                <h2>Things you’ve collected.</h2>
                <p>Digital guides, reports, workshops, and other Darker Light resources will live here later.</p>
                <span class="mrh-chip">Coming next</span>
            </article>
        </section>

        <section class="mrh-savebar" aria-label="Save My Rabbit Hole">
            <div>
                <strong>Your path belongs to you.</strong>
                <span>Save changes, or erase the Darker Light profile data attached to your account.</span>
            </div>
            <div class="mrh-actions">
                <button id="mrh-delete" type="button" class="mrh-button mrh-button-danger">Delete my saved data</button>
                <button id="mrh-save" type="button" class="mrh-button mrh-button-primary">Save My Rabbit Hole</button>
            </div>
        </section>

        <script>
        window.DarkerLightMember = <?php echo wp_json_encode( array(
            'apiUrl' => $api_url,
            'nonce'  => $nonce,
        ) ); ?>;
        </script>
        <script>
        (() => {
            const config = window.DarkerLightMember;
            const status = document.getElementById('mrh-status');
            const saveButton = document.getElementById('mrh-save');
            const deleteButton = document.getElementById('mrh-delete');
            const guideButtons = [...document.querySelectorAll('.mrh-guide')];
            const stageBoxes = [...document.querySelectorAll('#mrh-stage-list input[type="checkbox"]')];
            let selectedGuide = '';

            const guideNames = {
                rabbit: 'The Rabbit',
                hatter: 'The Hatter',
                cat: 'The Cat',
                caterpillar: 'The Caterpillar',
                queen: 'The Queen'
            };

            function setStatus(message, type = '') {
                status.textContent = message;
                status.className = `mrh-status ${type ? `mrh-status-${type}` : ''}`;
            }

            function chooseGuide(guide) {
                selectedGuide = guide || '';
                guideButtons.forEach(button => {
                    const active = button.dataset.guide === selectedGuide;
                    button.classList.toggle('selected', active);
                    button.setAttribute('aria-pressed', active ? 'true' : 'false');
                });
            }

            guideButtons.forEach(button => {
                button.setAttribute('aria-pressed', 'false');
                button.addEventListener('click', () => chooseGuide(button.dataset.guide));
            });

            function populate(profile = {}) {
                chooseGuide(profile.guide || '');

                const birth = profile.birth || {};
                document.getElementById('mrh-birth-date').value = birth.date || '';
                document.getElementById('mrh-birth-time').value = birth.time || '';
                document.getElementById('mrh-birth-place').value = birth.place || '';
                document.getElementById('mrh-utc-offset').value = Number.isFinite(Number(birth.utc_offset)) && birth.utc_offset !== '' ? birth.utc_offset : '';

                const progress = profile.progress || {};
                document.getElementById('mrh-current-stage').value = progress.current_stage || '';
                const completed = new Set(Array.isArray(progress.completed_stages) ? progress.completed_stages : []);
                stageBoxes.forEach(box => { box.checked = completed.has(box.value); });

                const preferences = profile.preferences || {};
                const threads = Array.isArray(preferences.threads) ? preferences.threads : [];
                document.getElementById('mrh-threads').value = threads.join('\n');

                const summaryBits = [];
                if (selectedGuide && guideNames[selectedGuide]) summaryBits.push(`You’re following ${guideNames[selectedGuide]}.`);
                if (progress.current_stage) summaryBits.push(`Your current layer is ${progress.current_stage}.`);
                document.getElementById('mrh-summary').textContent = summaryBits.length ? summaryBits.join(' ') : 'Your path is ready when you are.';
            }

            async function apiRequest(method, body) {
                const options = {
                    method,
                    credentials: 'same-origin',
                    headers: {
                        'X-WP-Nonce': config.nonce
                    }
                };
                if (body !== undefined) {
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(body);
                }

                const response = await fetch(config.apiUrl, options);
                let data = {};
                try { data = await response.json(); } catch (e) {}
                if (!response.ok) {
                    throw new Error(data.message || 'Something interrupted the thread. Please try again.');
                }
                return data;
            }

            async function loadProfile() {
                try {
                    const data = await apiRequest('GET');
                    populate(data.profile || {});
                    setStatus('Your saved path is loaded.', 'success');
                } catch (error) {
                    setStatus(error.message, 'error');
                }
            }

            saveButton.addEventListener('click', async () => {
                const threads = document.getElementById('mrh-threads').value
                    .split('\n')
                    .map(line => line.trim())
                    .filter(Boolean)
                    .slice(0, 20);

                const payload = {
                    guide: selectedGuide,
                    birth: {
                        date: document.getElementById('mrh-birth-date').value,
                        time: document.getElementById('mrh-birth-time').value,
                        place: document.getElementById('mrh-birth-place').value.trim(),
                        utc_offset: document.getElementById('mrh-utc-offset').value === '' ? 0 : Number(document.getElementById('mrh-utc-offset').value)
                    },
                    progress: {
                        current_stage: document.getElementById('mrh-current-stage').value,
                        completed_stages: stageBoxes.filter(box => box.checked).map(box => box.value)
                    },
                    preferences: {
                        threads
                    }
                };

                saveButton.disabled = true;
                setStatus('Saving your path…');
                try {
                    const data = await apiRequest('POST', payload);
                    populate(data.profile || payload);
                    setStatus('Saved. The rabbit will remember where you left off.', 'success');
                } catch (error) {
                    setStatus(error.message, 'error');
                } finally {
                    saveButton.disabled = false;
                }
            });

            deleteButton.addEventListener('click', async () => {
                const confirmed = window.confirm('Erase your saved Darker Light profile data? This removes your guide, birth details, progress, and saved threads. Your WordPress account itself will remain.');
                if (!confirmed) return;

                deleteButton.disabled = true;
                setStatus('Erasing your saved Darker Light data…');
                try {
                    await apiRequest('DELETE');
                    populate({});
                    setStatus('Your saved Darker Light profile data has been erased.', 'success');
                } catch (error) {
                    setStatus(error.message, 'error');
                } finally {
                    deleteButton.disabled = false;
                }
            });

            loadProfile();
        })();
        </script>
    <?php endif; ?>
</main>

<style>
:root { --mrh-cream:#f7f0df; --mrh-gold:#e3bc68; --mrh-lav:#cfc2df; --mrh-ink:#090611; --mrh-panel:rgba(21,13,31,.88); --mrh-line:rgba(247,240,223,.14); }
body { background:radial-gradient(circle at 50% 0,#1b1029 0,#090611 38%,#050308 100%); color:var(--mrh-cream); }
.mrh-shell{max-width:1120px;margin:0 auto;padding:52px 20px 90px;min-height:100vh}.mrh-hero{text-align:center;padding:45px 0 36px}.mrh-eyebrow,.mrh-kicker{color:var(--mrh-gold);text-transform:uppercase;letter-spacing:.16em;font-size:.72rem;font-weight:800}.mrh-hero h1{font:500 clamp(3rem,8vw,6.6rem)/.95 Georgia,serif;margin:12px 0 18px}.mrh-intro{max-width:650px;margin:auto;color:var(--mrh-lav);font-size:1.08rem}.mrh-panel{border:1px solid var(--mrh-line);background:linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.015)),var(--mrh-panel);border-radius:26px;padding:26px;box-shadow:0 25px 70px rgba(0,0,0,.22)}.mrh-panel h2{font:500 2rem/1.05 Georgia,serif;margin:5px 0 10px}.mrh-panel p{margin-top:8px}.mrh-muted,.mrh-privacy{color:var(--mrh-lav)}.mrh-privacy{font-size:.82rem}.mrh-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}.mrh-guide-panel{grid-column:1/-1}.mrh-welcome{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:14px}.mrh-welcome h2{font-size:2.4rem}.mrh-status{padding:12px 16px;margin:0 0 18px;border-radius:14px;border:1px solid var(--mrh-line);color:var(--mrh-lav);background:rgba(255,255,255,.025)}.mrh-status-success{border-color:rgba(227,188,104,.45);color:var(--mrh-cream)}.mrh-status-error{border-color:rgba(224,105,105,.55);color:#ffd1d1}.mrh-guide-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:20px}.mrh-guide{min-height:165px;border:1px solid var(--mrh-line);border-radius:18px;background:rgba(255,255,255,.025);color:inherit;padding:18px 10px;cursor:pointer;transition:.25s ease}.mrh-guide:hover,.mrh-guide.selected{transform:translateY(-4px);border-color:var(--mrh-gold);box-shadow:0 0 30px rgba(227,188,104,.1)}.mrh-guide span,.mrh-guide strong,.mrh-guide small{display:block}.mrh-guide span{font-size:2rem;margin-bottom:8px}.mrh-guide strong{font-family:Georgia,serif;font-size:1.04rem}.mrh-guide small{color:var(--mrh-lav);margin-top:6px}.mrh-form-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.mrh-span-2{grid-column:1/-1}.mrh-form-grid label,.mrh-stage-label{display:grid;gap:6px;font-size:.84rem;color:var(--mrh-lav)}.mrh-shell input,.mrh-shell select,.mrh-shell textarea{width:100%;border:1px solid var(--mrh-line);background:#0c0812;color:var(--mrh-cream);border-radius:12px;padding:11px 12px;font:inherit;outline:none}.mrh-shell input:focus,.mrh-shell select:focus,.mrh-shell textarea:focus{border-color:var(--mrh-gold);box-shadow:0 0 0 3px rgba(227,188,104,.08)}.mrh-stage-list{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:16px}.mrh-stage{display:flex;align-items:center;gap:8px;border:1px solid var(--mrh-line);border-radius:12px;padding:10px;background:rgba(255,255,255,.02);font-size:.88rem}.mrh-stage input{width:auto}.mrh-chip{display:inline-block;border:1px solid rgba(227,188,104,.42);color:var(--mrh-gold);border-radius:999px;padding:5px 10px;font-size:.72rem;text-transform:uppercase;letter-spacing:.1em}.mrh-coming-soon{opacity:.8}.mrh-savebar{position:sticky;bottom:14px;z-index:20;display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:18px;padding:16px 18px;border:1px solid rgba(227,188,104,.36);border-radius:18px;background:rgba(9,6,17,.94);backdrop-filter:blur(12px);box-shadow:0 16px 50px rgba(0,0,0,.35)}.mrh-savebar span{display:block;color:var(--mrh-lav);font-size:.84rem}.mrh-actions{display:flex;gap:10px;flex-wrap:wrap}.mrh-button{display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--mrh-gold);border-radius:999px;padding:10px 15px;background:rgba(227,188,104,.06);color:var(--mrh-cream);text-decoration:none;font-weight:800;cursor:pointer}.mrh-button:hover{background:rgba(227,188,104,.14)}.mrh-button-primary{background:var(--mrh-gold);color:#17101f}.mrh-button-danger{border-color:rgba(224,105,105,.5);color:#ffd1d1}.mrh-button:disabled{opacity:.55;cursor:wait}.mrh-login-panel{max-width:680px;margin:30px auto;text-align:center;padding:44px}.mrh-orbit{font-size:3rem;color:var(--mrh-gold)}
@media(max-width:900px){.mrh-guide-grid{grid-template-columns:repeat(2,1fr)}.mrh-grid{grid-template-columns:1fr}.mrh-guide-panel{grid-column:auto}}@media(max-width:650px){.mrh-shell{padding-top:28px}.mrh-welcome,.mrh-savebar{align-items:stretch;flex-direction:column}.mrh-form-grid,.mrh-stage-list{grid-template-columns:1fr}.mrh-span-2{grid-column:auto}.mrh-guide-grid{grid-template-columns:1fr 1fr}.mrh-actions{width:100%}.mrh-actions .mrh-button{flex:1}.mrh-savebar{bottom:8px}}
</style>

<?php get_footer();
