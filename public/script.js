(function(){
        const curtain = document.getElementById('curtain');
        const nav = document.getElementById('nav');
        const revealTarget = document.querySelector('.s2 .reveal');
        const s2El = document.querySelector('.s2');
        const s3El = document.querySelector('.s3');
        let s2Triggered = false;
        let s3Triggered = false;


        const burger = document.getElementById('navBurger');
        const drawer = document.getElementById('navDrawer');
        const drawerClose = document.getElementById('drawerClose');
        if (burger && drawer) {
          burger.addEventListener('click', () => drawer.classList.add('open'));
          if (drawerClose) drawerClose.addEventListener('click', () => drawer.classList.remove('open'));
          drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));
        }

        const legacyRoot = document.querySelector('[data-legacy-page]');
        const betaAccessGranted = legacyRoot?.dataset.betaAccess === 'true';
        const betaMount = document.getElementById('betaSignupMount');
        const betaTriggers = [...document.querySelectorAll('[data-beta-trigger]')];
        const betaParams = new URLSearchParams(window.location.search);
        let fallbackBetaSource = betaParams.get('source') || 'hero';

        function openFallbackBetaForm(source = 'hero') {
          fallbackBetaSource = source;
          const signup = betaMount?.querySelector('[data-beta-fallback]');
          if (!signup) return;

          const input = signup.querySelector('#betaEmailFallback');
          const status = signup.querySelector('#betaStatusFallback');
          const button = signup.querySelector('.beta-signup__button');

          signup.classList.add('is-expanded');
          button?.setAttribute('aria-expanded', 'true');
          input?.removeAttribute('disabled');
          input?.setAttribute('tabindex', '0');
          if (status) {
            status.textContent = '';
            status.className = 'beta-signup__status';
          }

          window.requestAnimationFrame(() => input?.focus());
        }

        function renderBetaFallback() {
          if (!betaMount) return;
          betaMount.classList.remove('beta-cta-slot--fallback');
          const existingFallback = betaMount.querySelector('[data-beta-fallback]');
          if (!existingFallback && betaMount.children.length) return;

          if (betaAccessGranted) {
            betaMount.innerHTML = `
              <div class="beta-signup beta-signup--unlocked" data-beta-fallback>
                <a class="btn primary beta-signup__open" href="/install">
                  <span>Open Downloads</span>
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"></path>
                  </svg>
                </a>
              </div>`;
            return;
          }

          betaMount.innerHTML = `
            <div class="beta-signup" id="join-beta" data-beta-fallback>
              <form novalidate>
                <div class="beta-signup__shell">
                  <label class="sr-only" for="betaEmailFallback">Email address</label>
                  <input id="betaEmailFallback" name="email" type="email" inputmode="email" autocomplete="email"
                    placeholder="Your email" disabled tabindex="-1" aria-describedby="betaDisclosureFallback betaStatusFallback" required>
                  <div class="beta-signup__honeypot" aria-hidden="true">
                    <label for="betaWebsiteFallback">Website</label>
                    <input id="betaWebsiteFallback" name="website" type="text" tabindex="-1" autocomplete="off">
                  </div>
                  <button class="btn primary beta-signup__button" type="submit" aria-expanded="false">
                    <span>Join Beta</span>
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                      <path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </button>
                </div>
                <p class="beta-signup__disclosure" id="betaDisclosureFallback">
                  Instant download access. You’ll also receive occasional Openbase product updates;
                  unsubscribe anytime. <a href="/privacy">Privacy</a>
                </p>
                <p class="beta-signup__status" id="betaStatusFallback" aria-live="polite"></p>
              </form>
            </div>`;

          const signup = betaMount.querySelector('[data-beta-fallback]');
          if (!signup || signup.dataset.betaFallbackReady === 'true') return;
          signup.dataset.betaFallbackReady = 'true';
          const form = signup.querySelector('form');
          const input = signup.querySelector('#betaEmailFallback');
          const honeypot = signup.querySelector('#betaWebsiteFallback');
          const button = signup.querySelector('.beta-signup__button');
          const buttonLabel = button.querySelector('span');
          const status = signup.querySelector('#betaStatusFallback');
          if (existingFallback && betaParams.get('join') !== 'beta') {
            signup.classList.remove('is-expanded');
            button.setAttribute('aria-expanded', 'false');
            input.setAttribute('disabled', '');
            input.setAttribute('tabindex', '-1');
          }

          input.addEventListener('input', () => {
            if (status.classList.contains('beta-signup__status--error')) {
              status.textContent = '';
              status.className = 'beta-signup__status';
              input.setAttribute('aria-invalid', 'false');
            }
          });

          form.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!signup.classList.contains('is-expanded')) {
              openFallbackBetaForm(fallbackBetaSource);
              return;
            }

            const email = input.value.trim();
            if (!input.validity.valid || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              status.textContent = 'Enter a valid email address.';
              status.className = 'beta-signup__status beta-signup__status--error';
              input.setAttribute('aria-invalid', 'true');
              input.focus();
              return;
            }

            button.disabled = true;
            input.disabled = true;
            buttonLabel.textContent = 'Joining…';
            button.querySelector('svg')?.remove();
            button.insertAdjacentHTML('beforeend', '<span class="beta-signup__spinner" aria-hidden="true"></span>');
            status.textContent = 'Unlocking access…';
            status.className = 'beta-signup__status';

            try {
              const response = await fetch('/api/beta', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  email,
                  source: fallbackBetaSource,
                  website: honeypot.value,
                }),
              });
              const result = await response.json().catch(() => ({}));
              if (!response.ok) {
                throw new Error(result.error || 'We couldn’t unlock access. Please try again.');
              }

              buttonLabel.textContent = 'Unlocked';
              button.querySelector('.beta-signup__spinner')?.remove();
              button.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M4 10l4 4 8-8" stroke-linecap="round" stroke-linejoin="round"></path></svg>');
              status.textContent = result.status === 'existing' ? 'Access already unlocked' : 'Access unlocked';
              status.className = 'beta-signup__status beta-signup__status--success';
              window.setTimeout(() => window.location.assign('/install'), result.status === 'existing' ? 250 : 650);
            } catch (error) {
              button.disabled = false;
              input.disabled = false;
              buttonLabel.textContent = 'Join Beta';
              button.querySelector('.beta-signup__spinner')?.remove();
              button.insertAdjacentHTML('beforeend', '<svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor"><path d="M4 10h12M11 5l5 5-5 5" stroke-linecap="round" stroke-linejoin="round"></path></svg>');
              status.textContent = error instanceof Error ? error.message : 'We couldn’t unlock access. Please try again.';
              status.className = 'beta-signup__status beta-signup__status--error';
              input.focus();
            }
          });

          if (betaParams.get('join') === 'beta') {
            openFallbackBetaForm(fallbackBetaSource);
          }
        }

        renderBetaFallback();

        betaTriggers.forEach((trigger) => {
          if (betaAccessGranted) {
            trigger.setAttribute('href', '/install');
            trigger.querySelectorAll('[data-beta-label]').forEach((label) => {
              label.textContent = 'Open Downloads';
            });
            return;
          }

          trigger.addEventListener('click', (event) => {
            event.preventDefault();
            drawer?.classList.remove('open');
            const source = trigger.dataset.betaSource || 'hero';
            const url = new URL(window.location.href);
            url.searchParams.set('join', 'beta');
            url.searchParams.set('next', '/install');
            url.searchParams.set('source', source);
            window.history.replaceState({}, '', url);
            const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
            document.querySelector('.hero__copy')?.scrollIntoView({ behavior, block: 'center' });
            openFallbackBetaForm(source);
            window.dispatchEvent(new CustomEvent('openbase:beta-open', {
              detail: { source },
            }));
          });
        });


        // In-page nav uses the browser's native document scroll. Scoped to the
        // nav and drawer so decorative links elsewhere are left alone.
        [nav, drawer].forEach((container) => {
          if (!container) return;
          container.addEventListener('click', (e) => {
            const a = e.target.closest('a[href^="#"]');
            if (!a || !container.contains(a)) return;
            const anchor = a.getAttribute('href').slice(1);
            const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
            if (!anchor) { // brand: href="#" -> back to hero
              e.preventDefault();
              window.scrollTo({ top: 0, behavior });
              return;
            }
            const target = document.querySelector('[data-anchor="' + anchor + '"]');
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior });
            }
          });
        });

        // Footer year (no build step, so stamp it at runtime).
        document.querySelectorAll('[data-year]').forEach((el) => {
          el.textContent = new Date().getFullYear();
        });

        function groupChWords(root){
          // wrap runs of letter spans in nowrap word containers so lines
          // never break mid-word on narrow viewports
          const parents = new Set();
          root.querySelectorAll('.ch').forEach(ch => parents.add(ch.parentNode));
          parents.forEach(p => {
            let word = null;
            [...p.childNodes].forEach(k => {
              const isLetter = k.nodeType === 1 && k.classList &&
                k.classList.contains('ch') && !k.classList.contains('sp');
              if (isLetter){
                if (!word){
                  word = document.createElement('span');
                  word.style.whiteSpace = 'nowrap';
                  word.style.display = 'inline-block';
                  p.insertBefore(word, k);
                }
                word.appendChild(k);
              } else {
                word = null;
              }
            });
          });
        }

        function animateCount(el){
          const target = parseFloat(el.dataset.count);
          const prefix = el.dataset.prefix || '';
          const suffix = el.dataset.suffix || '';
          const fmt = el.dataset.format;
          const dur = 1400;
          const start = performance.now();
          function step(now){
            const t = Math.min(1, (now - start) / dur);
            const eased = 1 - Math.pow(1 - t, 3);
            const val = target * eased;
            let out;
            if (fmt === 'int') out = Math.round(val).toLocaleString('en-US');
            else if (fmt === 'dec1') out = val.toFixed(1);
            else out = String(val);
            el.textContent = prefix + out + suffix;
            if (t < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
        function triggerS2(){
          if (s2Triggered || !s2El) return;
          s2Triggered = true;

          const s2h2 = s2El.querySelector('.grid h2');
          if (s2h2 && !s2h2.dataset.split){
            s2h2.dataset.split = '1';
            let i = 0;
            const walk = (node) => {
              const kids = [...node.childNodes];
              for (const n of kids){
                if (n.nodeType === 3){
                  const frag = document.createDocumentFragment();
                  for (const ch of n.nodeValue){
                    if (ch === '\n') continue;
                    const s = document.createElement('span');
                    s.className = 'ch' + (ch === ' ' || ch === ' ' ? ' sp' : '');
                    s.style.setProperty('--i', i++);
                    s.textContent = ch === ' ' ? ' ' : ch;
                    frag.appendChild(s);
                  }
                  node.replaceChild(frag, n);
                } else if (n.nodeType === 1 && n.tagName !== 'BR'){
                  walk(n);
                }
              }
            };
            walk(s2h2);
            groupChWords(s2h2);
          }
          s2El.classList.add('s2-in');

          const ledeLines = s2El.querySelectorAll('.lede .sub-line');
          ledeLines.forEach((line, i) => {
            setTimeout(() => line.classList.add('in'), 450 + i * 220);
          });

          setTimeout(() => animateCount(document.querySelector('.stat.violet .v')), 1350);
          setTimeout(() => animateCount(document.querySelector('.stat.blue .v')), 1650);
        }

        function triggerS3(){
          if (s3Triggered || !s3El) return;
          s3Triggered = true;
          const s3h2 = s3El.querySelector('.s3-head h2');
          if (s3h2 && !s3h2.dataset.split){
            s3h2.dataset.split = '1';
            let i = 0;
            const walk = (node) => {
              const kids = [...node.childNodes];
              for (const n of kids){
                if (n.nodeType === 3){
                  const frag = document.createDocumentFragment();
                  for (const ch of n.nodeValue){
                    if (ch === '\n') continue;
                    const s = document.createElement('span');
                    s.className = 'ch' + (ch === ' ' || ch === ' ' ? ' sp' : '');
                    s.style.setProperty('--i', i++);
                    s.textContent = ch === ' ' ? ' ' : ch;
                    frag.appendChild(s);
                  }
                  node.replaceChild(frag, n);
                } else if (n.nodeType === 1 && n.tagName !== 'BR'){
                  walk(n);
                }
              }
            };
            walk(s3h2);
            groupChWords(s3h2);
          }


          const allCh    = [...s3h2.querySelectorAll('.ch')];
          const line2Ch  = [...s3h2.querySelectorAll('.it .ch')];
          const line1Count = allCh.length - line2Ch.length;

          const line2StartMs = 50 + (line1Count - 1) * 19 + 110;

          line2Ch.forEach((ch, idx) => {
            ch.style.animationDelay = (line2StartMs + idx * 19) + 'ms';
          });


          const cornerEl = s3El.querySelector('.s3-head .corner.l');
          if (cornerEl && !cornerEl.dataset.split){
            cornerEl.dataset.split = '1';
            const text = cornerEl.textContent;
            cornerEl.innerHTML = '';
            let ci = 0;
            for (const ch of text){
              const s = document.createElement('span');
              s.className = 'ch' + (ch === ' ' ? ' sp' : '');
              s.style.setProperty('--i', ci++);
              s.textContent = ch === ' ' ? ' ' : ch;
              cornerEl.appendChild(s);
            }
          }


          const cornerR = s3El.querySelector('.s3-head .corner.r');
          if (cornerR && !cornerR.dataset.split){
            cornerR.dataset.split = '1';
            const text = cornerR.textContent;
            cornerR.innerHTML = '';
            const spans = [];
            for (const ch of text){
              const s = document.createElement('span');
              s.className = 'ch' + (ch === ' ' ? ' sp' : '');
              s.textContent = ch === ' ' ? ' ' : ch;
              spans.push(s);
              cornerR.appendChild(s);
            }

            const total = spans.length;
            spans.forEach((s, idx) => {
              s.style.setProperty('--i', total - 1 - idx);
            });
          }

          s3El.classList.add('s3-in');
          const h2Done = line2StartMs + (line2Ch.length > 0 ? (line2Ch.length - 1) * 19 + 450 : 0);
          const subLines = s3El.querySelectorAll('.s3-head .sub-line');
          subLines.forEach((line, i) => {
            setTimeout(() => line.classList.add('in'), h2Done + i * 110);
          });

          const lastSubLineEnd = h2Done + (subLines.length - 1) * 110 + 350;
          setTimeout(() => {
            s3El.classList.add('s3-cards-in');


            setTimeout(() => {
              const conns = s3El.querySelectorAll('.card3.a .conn');
              const stampA = s3El.querySelector('.card3.a .stamp');
              stampA.classList.add('s3-reveal');
              conns.forEach((conn, i) => {
                setTimeout(() => conn.classList.add('s3-reveal'), i * 350);
              });
            }, 800);


            setTimeout(() => {
              const insightCard = s3El.querySelector('#insightCard');
              insightCard.classList.add('s3-reveal');
              const stampB = s3El.querySelector('.card3.b .stamp');
              stampB.classList.add('s3-reveal');

              setTimeout(() => {
                const saving = insightCard.querySelector('.saving');
                saving.classList.add('s3-reveal');
              }, 700);
            }, 1050);


            setTimeout(() => {
              var runway = s3El.querySelector('.card3.c .runway');
              runway.classList.add('s3-reveal');
              var stampC = s3El.querySelector('.card3.c .stamp');
              stampC.classList.add('s3-reveal');
            }, 1300);
          }, lastSubLineEnd);
        }


        let s4Triggered = false;
        function triggerS4(){
          if (s4Triggered) return;
          s4Triggered = true;

          const openbaseTile  = document.querySelector('.tile.openbase');
          const openbaseLabel = document.querySelector('.openbase-label');
          if (!openbaseTile || !openbaseLabel) return;


          const orbitTiles = [...document.querySelectorAll('.orbit-ring .tile')]
            .filter(t => t.style.display !== 'none');

          orbitTiles.forEach(t => { t._sc = 0; t._rMul = 0; });


          function easeOutBack(x){
            const c1 = 1.70158, c3 = c1 + 1;
            return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
          }

          function animSc(tile, dur, delay){
            tile._rMul = 0;
            tile._spiralOffset = -280;
            setTimeout(function(){
              var start = performance.now();
              (function step(now){
                var t = Math.min(1, (now - start) / dur);

                var easeOut = 1 - Math.pow(1 - t, 4);
                tile._rMul = Math.pow(easeOut, 0.618);

                var scEase = t < 0.8 ? 1 - Math.pow(1 - (t / 0.8), 4) : 1 + 0.08 * Math.sin((t - 0.8) / 0.2 * Math.PI);
                tile._sc = Math.max(0, Math.min(1.08, scEase));

                tile._spiralOffset = -280 * Math.pow(1 - t, 2.5);
                if (t < 1) requestAnimationFrame(step);
                else { tile._sc = 1; tile._rMul = 1; tile._spiralOffset = 0; }
              })(performance.now());
            }, delay);
          }


          openbaseTile.style.transition = 'none';
          openbaseTile.style.transform  = 'scale(0.001) translateY(40px)';
          openbaseTile.style.opacity    = '0';
          var labelItems = [].slice.call(openbaseLabel.querySelectorAll('.n, .k'));
          labelItems.forEach(function(el){
            el.style.transition = 'none';
            el.style.opacity    = '0';
            el.style.transform  = 'translateY(22px)';
          });


          void openbaseTile.offsetHeight;
          void openbaseLabel.offsetHeight;


          openbaseTile.style.transition  = 'transform 1700ms cubic-bezier(0.34,1.45,0.64,1), opacity 1000ms ease';
          openbaseTile.style.transform   = 'scale(1) translateY(0px)';
          openbaseTile.style.opacity     = '1';


          labelItems.forEach(function(el, i){
            var delay = 1200 + i * 260;
            el.style.transition = 'opacity 1200ms ease ' + delay + 'ms, transform 1200ms cubic-bezier(0.34,1.35,0.64,1) ' + delay + 'ms';
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
          });


          const s4b = document.querySelector('.s4-bottom');
          const eyebrow4 = s4b && s4b.querySelector('.eyebrow');
          const syncStamp = document.querySelector('.sync-stamp');
          const s4h2 = s4b && s4b.querySelector('h2');
          const intPill = document.querySelector('.int-pill');


          if (s4h2 && !s4h2.dataset.split){
            s4h2.dataset.split = '1';
            const walk = (node) => {
              [...node.childNodes].forEach(c => {
                if (c.nodeType === 3){
                  const frag = document.createDocumentFragment();
                  for (const ch of c.textContent){
                    const s = document.createElement('span');
                    s.className = 'ch' + (ch === ' ' ? ' sp' : '');
                    s.textContent = ch === ' ' ? ' ' : ch;
                    frag.appendChild(s);
                  }
                  c.parentNode.replaceChild(frag, c);
                } else if (c.nodeType === 1 && c.tagName !== 'BR'){
                  walk(c);
                }
              });
            };
            walk(s4h2);
            groupChWords(s4h2);
          }


          setTimeout(() => {
            if (eyebrow4){
              eyebrow4.style.transition = 'opacity .8s ease, transform .8s cubic-bezier(.22,.61,.36,1)';
              eyebrow4.style.opacity = '1';
              eyebrow4.style.transform = 'translateY(0)';
            }
            if (syncStamp){
              syncStamp.style.transition = 'opacity .8s ease, transform .8s cubic-bezier(.22,.61,.36,1)';
              syncStamp.style.opacity = '1';
              syncStamp.style.transform = 'translateX(-50%) translateY(0)';
            }
          }, 1200);


          if (s4h2){
            const allCh4   = [...s4h2.querySelectorAll('.ch')];
            const line2Ch4 = [...s4h2.querySelectorAll('.it .ch')];
            const line2Set = new Set(line2Ch4);
            const line1Ch4 = allCh4.filter(c => !line2Set.has(c));
            const h2Start = 1700;
            line1Ch4.forEach((ch, idx) => {
              ch.style.animation = 'introLetterUp .45s cubic-bezier(.22,.61,.36,1) both';
              ch.style.animationDelay = (h2Start + idx * 19) + 'ms';
            });
            const line2Start4 = h2Start + (line1Ch4.length > 0 ? (line1Ch4.length - 1) * 19 + 110 : 0);
            line2Ch4.forEach((ch, idx) => {
              ch.style.animation = 'introLetterUp .45s cubic-bezier(.22,.61,.36,1) both';
              ch.style.animationDelay = (line2Start4 + idx * 19) + 'ms';
            });
          }


          if (intPill){
            intPill.style.animation = 's4PillPop 1.1s cubic-bezier(.22,.61,.36,1) 1500ms forwards';
          }


          const filterList = document.querySelector('.filter-list');
          if (filterList){
            setTimeout(() => {
              filterList.style.transition = 'transform 1100ms cubic-bezier(.22,.61,.36,1), opacity 800ms ease';
              filterList.style.transform = 'translateX(0)';
              filterList.style.opacity = '1';
            }, 2100);
          }


          const orbitEl = document.getElementById('orbit');
          const oRect = orbitEl.getBoundingClientRect();
          const cx = oRect.left + oRect.width / 2;
          const cy = oRect.top + oRect.height / 2;
          const ordered = orbitTiles.map(t => {
            const r = t.getBoundingClientRect();
            const tx = r.left + r.width / 2;
            const ty = r.top + r.height / 2;

            let ang = Math.atan2(tx - cx, cy - ty) * 180 / Math.PI;
            if (ang < 0) ang += 360;
            return { t, ang };
          }).sort((a, b) => a.ang - b.ang);
          ordered.forEach(function(o, i){
            animSc(o.t, 1800, 2100 + i * 160);
          });


          const lastOrbitDelay = 2100 + (ordered.length - 1) * 160 + 1800;
          setTimeout(function(){ window.__s4Done = true; }, lastOrbitDelay);
        }


        function initScrollExperience(){
          const wrap = document.getElementById('sections');
          if (!wrap) return;

          const watched = [
            { el: document.querySelector('.s2'), fn: triggerS2 },
            { el: document.querySelector('.s3'), fn: triggerS3 },
            { el: document.querySelector('.s4'), fn: triggerS4 }
          ].filter((item) => item.el);
          const footer = document.querySelector('.site-footer');
          function updateNavTheme(){
            const navBottom = nav ? nav.getBoundingClientRect().bottom : 96;
            const heroVisible = curtain && curtain.getBoundingClientRect().bottom > navBottom;
            const footerVisible = footer && footer.getBoundingClientRect().top < window.innerHeight * 0.55;
            const useGlass = heroVisible || footerVisible;
            nav.classList.toggle('glass', useGlass);
            nav.classList.toggle('dark', !useGlass);
          }

          function revealVisibleSections(){
            const vh = window.innerHeight;
            watched.forEach((item) => {
              if (item.done) return;
              const rect = item.el.getBoundingClientRect();
              if (rect.top < vh * 0.78 && rect.bottom > vh * 0.18){
                item.done = true;
                item.fn();
              }
            });
          }

          if ('IntersectionObserver' in window){
            const observer = new IntersectionObserver((entries) => {
              entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const item = watched.find((candidate) => candidate.el === entry.target);
                if (!item || item.done) return;
                item.done = true;
                item.fn();
                observer.unobserve(entry.target);
              });
            }, { rootMargin: '0px 0px -22% 0px', threshold: 0.12 });
            watched.forEach((item) => observer.observe(item.el));
          }

          let navFrame = 0;
          const requestNavUpdate = () => {
            if (navFrame) return;
            navFrame = requestAnimationFrame(() => {
              navFrame = 0;
              updateNavTheme();
              revealVisibleSections();
            });
          };
          window.addEventListener('scroll', requestNavUpdate, { passive: true });
          window.addEventListener('resize', requestNavUpdate, { passive: true });
          updateNavTheme();
          revealVisibleSections();

          const hash = location.hash.replace('#', '');
          if (hash){
            const target = document.querySelector('[data-anchor="' + hash + '"]');
            if (target) requestAnimationFrame(() => target.scrollIntoView());
          }
        }

        if (document.readyState === 'loading'){
          document.addEventListener('DOMContentLoaded', initScrollExperience);
        } else {
          initScrollExperience();
        }


        const empties = document.querySelectorAll('.tile.empty');
        const tilesA = document.querySelectorAll('.tile[data-group="a"]');
        const tilesB = document.querySelectorAll('.tile[data-group="b"]');


        function _easeOutBack(x){
          const c1 = 1.70158, c3 = c1 + 1;
          return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
        }
        function popInTile(tile, delay){
          tile._sc = 0;
          tile._rMul = 0;
          tile._spiralOffset = -300;
          setTimeout(function(){
            const dur = 900;
            const start = performance.now();
            (function step(now){
              const t = Math.min(1, (now - start) / dur);
              const easeOut = 1 - Math.pow(1 - t, 3);
              tile._sc = Math.max(0, Math.min(1.15, _easeOutBack(t)));
              tile._rMul = Math.pow(easeOut, 0.618);
              tile._spiralOffset = -300 * Math.pow(1 - t, 2);
              if (t < 1) requestAnimationFrame(step);
              else { tile._sc = 1; tile._rMul = 1; tile._spiralOffset = 0; }
            })(performance.now());
          }, delay);
        }

        function applyGroup(showB){
          tilesA.forEach(t => t.style.display = showB ? 'none' : 'grid');
          tilesB.forEach(t => t.style.display = showB ? 'grid' : 'none');
          empties.forEach(t => t.style.display = showB ? 'none' : 'grid');


          if (!window.__s4Done) return;
          const visible = [...document.querySelectorAll('.orbit-ring .tile')]
            .filter(t => t.style.display !== 'none');

          const orbitEl = document.getElementById('orbit');
          const oRect = orbitEl.getBoundingClientRect();
          const cx = oRect.left + oRect.width / 2;
          const cy = oRect.top + oRect.height / 2;
          const ordered = visible.map(t => {
            const r = t.getBoundingClientRect();
            const tx = r.left + r.width / 2;
            const ty = r.top + r.height / 2;
            let ang = Math.atan2(tx - cx, cy - ty) * 180 / Math.PI;
            if (ang < 0) ang += 360;
            return { t, ang };
          }).sort((a, b) => a.ang - b.ang);
          ordered.forEach((o, i) => popInTile(o.t, i * 90));
        }
        document.querySelectorAll('#filters button').forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('#filters button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          });
        });
        applyGroup(false);


        (function spinFilters(){
          const list = document.getElementById('filters');
          if (!list) return;
          const items = Array.from(list.querySelectorAll('button'));
          const N = items.length;
          const STEP = 50;
          const BASE_SPEED = 0.0007;
          let offset = 0;
          let lastTime = performance.now();
          let mouseOver = false;
          let speedMult = 1;

          list.addEventListener('mouseenter', () => { mouseOver = true; speedMult = 0; });
          list.addEventListener('mouseleave', () => { mouseOver = false; speedMult = 1; });
          list.addEventListener('mousemove', (e) => {
            if (!mouseOver) return;
            const rect = list.getBoundingClientRect();
            const relY = (e.clientY - rect.top) / rect.height;
            const dist = relY - 0.5;
            if (Math.abs(dist) < 0.12) {
              speedMult = 0;
            } else {

              speedMult = dist * 4;
            }
          });


          items.forEach((btn, idx) => {
            btn.addEventListener('click', () => {
              items.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');

              const target = idx;
              const cur = ((offset % N) + N) % N;

              let diff = target - cur;
              if (diff > N/2) diff -= N;
              if (diff < -N/2) diff += N;
              const goal = cur + diff;

              const start = performance.now();
              const dur = 500;
              const from = offset;
              const to = from + (goal - cur);
              function snap(now){
                const t = Math.min(1, (now - start) / dur);
                const eased = 1 - Math.pow(1 - t, 3);
                offset = from + (to - from) * eased;
                if (t < 1) requestAnimationFrame(snap);
                else offset = ((to % N) + N) % N;
              }
              requestAnimationFrame(snap);
            });
          });

          function tick(now) {
            const dt = now - lastTime;
            lastTime = now;
            offset = (offset + BASE_SPEED * dt * speedMult) % N;
            if (offset < 0) offset += N;

            const centerSlot = 2.5;
            items.forEach((el, i) => {
              let slot = ((i - offset) % N + N) % N;
              let pos = slot > N / 2 ? slot - N : slot;
              const y = (pos + centerSlot) * STEP;
              const d = Math.abs(pos);


              const opacity = d < 0.5  ? 1
                            : d < 1.5  ? 1   - (d-0.5)*0.2
                            : d < 2.5  ? 0.8 - (d-1.5)*0.35
                            : d < 3.5  ? 0.45- (d-2.5)*0.3
                            : 0;


              const scale = d < 0.5 ? 1 : Math.max(0.8, 1 - (d-0.5)*0.08);


              const blur = d < 1.0 ? 0 : Math.min(3, (d-1)*2);


              const lightness = Math.min(165, Math.round(14 + d * 70));
              const textAlpha  = d < 0.5 ? 1 : Math.max(0.35, 1 - d*0.28);

              el.style.transform   = `translate3d(0,${y}px,0) scale(${scale})`;
              el.style.opacity     = String(Math.max(0, opacity));
              el.style.filter      = blur > 0 ? `blur(${blur}px)` : '';
              el.style.color       = `rgba(${lightness},${lightness},${lightness},${textAlpha})`;
              el.style.background  = d < 0.5 ? '#fff' : 'rgba(14,10,7,.025)';
              el.style.boxShadow   = d < 0.5 ? '0 6px 18px rgba(14,10,7,.08)' : 'none';
              el.style.borderColor = 'rgba(14,10,7,.13)';
              el.style.zIndex      = String(100 - Math.round(d*10));
              el.style.display     = opacity > 0.01 ? '' : 'none';
            });
            requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        })();


        (function spinOrbit(){
          const tiles = document.querySelectorAll('.orbit-ring .tile');
          const baseMap = new Map();
          const baseAngles = {g2:0,g3:45,g6:90,g9:135,g8:180,g7:225,g4:270,g1:315};


          const posRot = [-0.991, 43.025, 90.926, 134.422, 179.009, 223.025, 270.926, 314.422];
          tiles.forEach(t => {
            const cls = [...t.classList].find(c => /^g[1-9]$/.test(c));
            baseMap.set(t, baseAngles[cls] ?? 0);
          });
          function rotAt(a){
            a = ((a % 360) + 360) % 360;
            const idx = a / 45;
            const i0 = Math.floor(idx) % 8;
            const i1 = (i0 + 1) % 8;
            const t = idx - Math.floor(idx);
            const r0 = posRot[i0], r1 = posRot[i1];
            const diff = ((r1 - r0 + 540) % 360) - 180;
            return r0 + diff * t;
          }
          const PERIOD = 32000;
          const orbit = document.getElementById('orbit');
          let R = 220;
          function measure(){
            if (!orbit) return;
            const w = orbit.getBoundingClientRect().width;
            const tileEl = orbit.querySelector('.orbit-ring .tile');
            const tw = tileEl ? tileEl.getBoundingClientRect().width : 136;
            R = Math.max(60, (w - tw) / 2);
          }
          measure();
          window.addEventListener('resize', measure);
          let last = performance.now(), offset = 0;
          function frame(now){
            const dt = now - last; last = now;
            offset = (offset + (dt / PERIOD) * 360) % 360;
            tiles.forEach(t => {
              const a = (baseMap.get(t) + offset + (t._spiralOffset ?? 0));
              const rot = rotAt(a);

          t.style.transform =
                `rotate(${a}deg) translateY(${-R * (t._rMul ?? 1)}px) rotate(${-a + rot}deg) scale(${t._sc ?? 0})`;

              t.style.setProperty('--rot', rot + 'deg');
            });
            requestAnimationFrame(frame);
          }
          requestAnimationFrame(frame);
        })();


        function countUp(el, duration) {
          const raw = el.textContent.trim();
          const prefix = raw.startsWith('$') ? '$' : '';
          const suffix = raw.endsWith('%') ? '%' : '';
          const target = parseInt(raw.replace(/[^0-9]/g, ''), 10);
          const start = performance.now();
          function fmt(n) {
            return prefix + Math.round(n).toLocaleString('en-US') + suffix;
          }
          el.textContent = fmt(0);
          function tick(now) {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(target * ease);
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = raw;
          }
          requestAnimationFrame(tick);
        }

        function startPhoneDemo(stage) {
          if (!stage || stage.dataset.demoStarted === 'true') return;

          const commandEl = stage.querySelector('[data-demo-command]');
          const voiceTitle = stage.querySelector('[data-demo-voice-title]');
          const voiceCopy = stage.querySelector('[data-demo-voice-copy]');
          if (!commandEl || !voiceTitle || !voiceCopy) return;

          const command = '“Fix the authentication bug and run the tests.”';
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          stage.dataset.demoStarted = 'true';

          const setVoice = (title, copy) => {
            voiceTitle.textContent = title;
            voiceCopy.textContent = copy;
          };

          if (reducedMotion) {
            commandEl.textContent = command;
            setVoice('Done', 'The fix is implemented and verified.');
            stage.classList.add('demo-reduced');
            return;
          }

          const stateClasses = [
            'demo-speaking',
            'demo-approval',
            'demo-approving',
            'demo-running',
            'demo-passed',
            'demo-complete',
            'demo-resetting'
          ];
          const wait = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));
          const setState = (state) => {
            stage.classList.remove(...stateClasses);
            if (state) stage.classList.add(state);
          };
          const typeCommand = async () => {
            commandEl.textContent = '';
            for (const character of command) {
              commandEl.textContent += character;
              await wait(character === ' ' ? 22 : 36);
            }
          };

          stage.classList.add('demo-active');

          const runDemo = async () => {
            while (document.body.contains(stage)) {
              commandEl.textContent = '';
              setVoice('Listening', 'Speak naturally. Openbase is listening.');
              setState('demo-speaking');
              await wait(900);
              await typeCommand();
              await wait(450);

              setVoice('Listening', 'Your request is ready to continue.');
              setState('demo-approval');
              await wait(1550);

              setState('demo-approving');
              await wait(680);

              setVoice('Working', 'Applying the fix on your connected Mac.');
              setState('demo-running');
              await wait(2150);

              setVoice('Passed', 'All 24 authentication tests finished with no failures.');
              setState('demo-passed');
              await wait(1250);

              setVoice('Done', 'The fix is implemented and verified.');
              setState('demo-complete');
              await wait(4400);

              setState('demo-resetting');
              await wait(620);
            }
          };

          runDemo();
        }

        function runIntro() {
          function splitLetters(root){
            let i = 0;
            const walk = (node) => {
              const kids = [...node.childNodes];
              for (const n of kids){
                if (n.nodeType === 3){
                  const frag = document.createDocumentFragment();
                  for (const ch of n.nodeValue){
                    if (ch === '\n') continue;
                    const s = document.createElement('span');
                    s.className = 'ch' + (ch === ' ' || ch === ' ' ? ' sp' : '');
                    s.style.setProperty('--i', i++);
                    s.textContent = ch === ' ' ? ' ' : ch;
                    frag.appendChild(s);
                  }
                  node.replaceChild(frag, n);
                } else if (n.nodeType === 1 && n.tagName !== 'BR'){
                  walk(n);
                }
              }
            };
            walk(root);
          }
          const centerLogo = document.getElementById('introCenterLogo');
          const navEl      = document.getElementById('nav');
          const pill       = document.querySelector('.hero .pill');
          const h1         = document.querySelector('.hero h1');
          const sub        = document.querySelector('.hero p.sub');
          const ctasBtns   = document.querySelector('.hero .ctas');
          const phoneStage = document.querySelector('.device-stage');
          const brand      = document.querySelector('.nav .brand');
          const links      = [...document.querySelectorAll('.nav .links a')];
          const signin     = document.querySelector('.nav .right .signin');
          const ctaBtn     = document.querySelector('.nav .right .cta');


          setTimeout(() => centerLogo.classList.add('intro-logo-in'), 80);


          setTimeout(() => {
            centerLogo.classList.add('intro-logo-out');
            navEl.style.opacity = '1';
            navEl.classList.add('intro-nav-in');

            setTimeout(() => navEl.classList.add('nav-lines-go'), 160);
          }, 200);


          setTimeout(() => brand.classList.add('intro-brand-in'), 280);


          links.forEach((a, i) => {
            setTimeout(() => a.classList.add('intro-link-in'), 330 + i * 55);
          });


          const linksEnd = 330 + links.length * 55;
          if (signin) setTimeout(() => signin.classList.add('intro-signin-in'), linksEnd + 60);


          setTimeout(() => {
            ctaBtn.classList.add('intro-cta-expand');
          }, linksEnd + 240);


          setTimeout(() => pill.classList.add('intro-pill-in'), linksEnd + 120);


          splitLetters(h1);
          groupChWords(h1);
          setTimeout(() => h1.classList.add('intro-h1-in'), linksEnd + 160);


          const h1Chars = h1.querySelectorAll('.ch').length;
          const h1Done = 160 + (h1Chars - 1) * 11 + 300;
          const subLines = sub.querySelectorAll('.sub-line');
          subLines.forEach((line, i) => {
            setTimeout(() => line.classList.add('in'), linksEnd + h1Done + i * 90);
          });
          const subEnd = h1Done + (subLines.length - 1) * 90 + 225;


          setTimeout(() => ctasBtns.classList.add('intro-btns-in'), linksEnd + subEnd + 120);


          setTimeout(() => {
            if (phoneStage) {
              phoneStage.classList.add('intro-phone-in');
              startPhoneDemo(phoneStage);
            }

          }, linksEnd + subEnd + 300);


          setTimeout(() => navEl.classList.add('intro-done'), linksEnd + 900);


        }

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', runIntro);
        } else {
          runIntro();
        }
      })();


      document.querySelectorAll('svg use').forEach(u => {
        u.setAttribute('href', '#openbase-mark');
      });


      document.querySelectorAll('svg use').forEach(u => {
        const h = u.getAttribute('href') || '';
        if (h.includes('openbase') && h.includes('#')) {
          u.setAttribute('href', '#openbase-mark');
        }
      });
