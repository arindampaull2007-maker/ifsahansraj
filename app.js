// ========== CINEMATIC FINANCE TERMINAL BACKGROUND ==========
(function() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, time = 0;
  let mouse = { x: -1000, y: -1000 };
  let particles = [], candlesticks = [], dataBlocks = [], gridNodes = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    initCandlesticks();
    initDataBlocks();
    initGridNodes();
  }

  // ========== CANDLESTICKS ==========
  function initCandlesticks() {
    candlesticks = [];
    const count = 55;
    const barW = W / count;
    for (let i = 0; i < count; i++) {
      const x = i * barW;
      const bodyH = 25 + Math.random() * 90;
      const isUp = Math.random() > 0.42;
      candlesticks.push({
        x, w: barW * 0.45,
        bodyH,
        wickTop: 10 + Math.random() * 50,
        wickBot: 10 + Math.random() * 50,
        isUp,
        baseY: H * 0.5 + (Math.random() - 0.5) * 140,
        curY: H * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.002 + Math.random() * 0.003,
        amp: 15 + Math.random() * 30,
        alpha: 0.5 + Math.random() * 0.5,
      });
    }
  }

  function drawCandlesticks() {
    candlesticks.forEach(c => {
      c.curY += ((c.baseY + Math.sin(time * c.speed + c.phase) * c.amp) - c.curY) * 0.02;
      if (Math.sin(time * c.speed * 0.3 + c.phase) > 0.97) c.isUp = !c.isUp;
      const y = c.curY, hb = c.bodyH / 2, a = c.alpha;

      // Wick
      ctx.beginPath();
      ctx.moveTo(c.x + c.w / 2, y - hb - c.wickTop);
      ctx.lineTo(c.x + c.w / 2, y + hb + c.wickBot);
      ctx.strokeStyle = `rgba(196,30,58,${a * 0.6})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Body
      if (c.isUp) {
        ctx.fillStyle = `rgba(209,0,63,${a})`;
        ctx.fillRect(c.x, y - hb, c.w, c.bodyH);
      } else {
        ctx.fillStyle = `rgba(120,0,20,${a * 0.7})`;
        ctx.fillRect(c.x, y - hb, c.w, c.bodyH);
        ctx.strokeStyle = `rgba(196,30,58,${a * 0.8})`;
        ctx.lineWidth = 1;
        ctx.strokeRect(c.x, y - hb, c.w, c.bodyH);
      }

      // Glow
      ctx.shadowColor = 'rgba(209,0,63,0.3)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = 'rgba(0,0,0,0)';
      ctx.fillRect(c.x, y - hb, c.w, c.bodyH);
      ctx.shadowBlur = 0;
    });
  }

  // ========== GRID ==========
  function drawGrid() {
    const sp = 55;
    ctx.lineWidth = 0.8;
    for (let x = 0; x < W; x += sp) {
      const f = x / W;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H);
      ctx.strokeStyle = `rgba(122,0,25,${0.12 + f * 0.15})`;
      ctx.stroke();
    }
    for (let y = 0; y < H; y += sp) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y);
      const cd = 1 - Math.abs(y - H * 0.5) / (H * 0.5);
      ctx.strokeStyle = `rgba(122,0,25,${0.08 + cd * 0.15})`;
      ctx.stroke();
    }
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 140, H);
      ctx.lineTo(i * 140 + W * 0.2, 0);
      ctx.strokeStyle = 'rgba(80,0,15,0.1)';
      ctx.stroke();
    }
  }

  // ========== GRID NODES ==========
  function initGridNodes() {
    gridNodes = [];
    const sp = 55;
    for (let x = sp; x < W; x += sp * 1.5)
      for (let y = sp; y < H; y += sp * 1.5)
        if (Math.random() > 0.55)
          gridNodes.push({ x, y, size: 2 + Math.random() * 2.5, phase: Math.random() * 6.28, speed: 0.012 + Math.random() * 0.02 });
  }

  function drawGridNodes() {
    gridNodes.forEach(n => {
      const p = 0.4 + Math.sin(time * n.speed + n.phase) * 0.4;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.size * 5, 0, 6.28);
      ctx.fillStyle = `rgba(209,0,63,${p * 0.12})`; ctx.fill();
      ctx.beginPath(); ctx.arc(n.x, n.y, n.size, 0, 6.28);
      ctx.fillStyle = `rgba(209,0,63,${p * 0.8})`; ctx.fill();
    });
  }

  // ========== DATA BLOCKS ==========
  function initDataBlocks() {
    dataBlocks = [];
    for (let i = 0; i < 50; i++)
      dataBlocks.push({
        x: Math.random() * W,
        y: H * 0.1 + Math.random() * H * 0.8,
        w: 15 + Math.random() * 70, h: 6 + Math.random() * 22,
        alpha: 0.06 + Math.random() * 0.14,
        phase: Math.random() * 6.28, speed: 0.006 + Math.random() * 0.012,
        filled: Math.random() > 0.4,
      });
  }

  function drawDataBlocks() {
    dataBlocks.forEach(b => {
      const f = 0.5 + Math.sin(time * b.speed + b.phase) * 0.5;
      const a = b.alpha * f;
      if (b.filled) {
        ctx.fillStyle = `rgba(122,0,25,${a})`; ctx.fillRect(b.x, b.y, b.w, b.h);
      } else {
        ctx.strokeStyle = `rgba(160,0,40,${a})`; ctx.lineWidth = 0.8;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
      }
    });
  }

  // ========== PRICE LINE ==========
  function drawPriceLine() {
    ctx.beginPath(); ctx.lineWidth = 2;
    for (let x = 0; x < W; x += 2) {
      const p = x / W;
      const y = H * 0.42 + Math.sin(x * 0.008 + time * 0.012) * 60 + Math.sin(x * 0.015 + time * 0.008) * 30 + Math.sin(x * 0.003 + time * 0.005) * 45 + p * -70;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    const gr = ctx.createLinearGradient(0, 0, W, 0);
    gr.addColorStop(0, 'rgba(196,30,58,0.3)');
    gr.addColorStop(0.5, 'rgba(209,0,63,0.6)');
    gr.addColorStop(1, 'rgba(209,0,63,0.8)');
    ctx.strokeStyle = gr; ctx.stroke();

    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
    const ag = ctx.createLinearGradient(0, H * 0.25, 0, H);
    ag.addColorStop(0, 'rgba(196,30,58,0.08)');
    ag.addColorStop(1, 'rgba(196,30,58,0)');
    ctx.fillStyle = ag; ctx.fill();
  }

  // ========== ARROWS ==========
  function drawArrows() {
    [{x:W*0.15,y:H*0.3,s:22},{x:W*0.35,y:H*0.25,s:28},{x:W*0.52,y:H*0.3,s:24},{x:W*0.63,y:H*0.22,s:30},{x:W*0.76,y:H*0.35,s:20},{x:W*0.88,y:H*0.28,s:18}]
    .forEach(a => {
      const b = Math.sin(time * 0.01 + a.x * 0.01) * 6;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + b - a.s);
      ctx.lineTo(a.x - a.s * 0.5, a.y + b);
      ctx.lineTo(a.x + a.s * 0.5, a.y + b);
      ctx.closePath();
      ctx.fillStyle = 'rgba(209,0,63,0.25)'; ctx.fill();
    });
  }

  // ========== AMBIENT FOG ==========
  function drawFog() {
    const g1 = ctx.createRadialGradient(W*0.5+Math.sin(time*0.001)*60,H*0.5,0,W*0.5,H*0.5,W*0.55);
    g1.addColorStop(0,'rgba(122,0,25,0.15)'); g1.addColorStop(0.5,'rgba(80,0,15,0.07)'); g1.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g1; ctx.fillRect(0,0,W,H);

    const g2 = ctx.createRadialGradient(W*0.2,H*0.3,0,W*0.2,H*0.3,W*0.4);
    g2.addColorStop(0,'rgba(160,0,40,0.1)'); g2.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g2; ctx.fillRect(0,0,W,H);

    const g3 = ctx.createRadialGradient(W*0.8,H*0.7,0,W*0.8,H*0.7,W*0.35);
    g3.addColorStop(0,'rgba(160,0,40,0.12)'); g3.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=g3; ctx.fillRect(0,0,W,H);
  }

  // ========== PARTICLES ==========
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random()*W; this.y = Math.random()*H;
      this.vx = (Math.random()-0.5)*0.25; this.vy = (Math.random()-0.5)*0.25;
      this.size = 1+Math.random()*2.5; this.alpha = 0.3+Math.random()*0.5;
      this.ba = this.alpha; this.ph = Math.random()*6.28;
    }
    update() {
      this.x += this.vx; this.y += this.vy + Math.sin(time*0.003+this.ph)*0.2;
      const dx=mouse.x-this.x, dy=mouse.y-this.y, d=Math.sqrt(dx*dx+dy*dy);
      if(d<180){const f=(180-d)/180*0.015;this.vx-=dx*f;this.vy-=dy*f;this.alpha=Math.min(this.ba+0.3,0.9);}
      else this.alpha+=(this.ba-this.alpha)*0.02;
      this.vx*=0.997; this.vy*=0.997;
      if(this.x<-20)this.x=W+10; if(this.x>W+20)this.x=-10;
      if(this.y<-20)this.y=H+20; if(this.y>H+20)this.y=-20;
    }
    draw() {
      ctx.beginPath(); ctx.arc(this.x,this.y,this.size,0,6.28);
      ctx.fillStyle=`rgba(209,0,63,${this.alpha})`; ctx.fill();
      if(this.size>1.5){ctx.beginPath();ctx.arc(this.x,this.y,this.size*4,0,6.28);
      ctx.fillStyle=`rgba(209,0,63,${this.alpha*0.1})`;ctx.fill();}
    }
  }

  function drawConnections() {
    for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){
      const dx=particles[i].x-particles[j].x,dy=particles[i].y-particles[j].y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<160){ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
      ctx.strokeStyle=`rgba(196,30,58,${(1-d/160)*0.2})`;ctx.lineWidth=0.5;ctx.stroke();}
    }
  }

  // Left fade removed — animation covers full screen

  // ========== INIT & LOOP ==========
  function init() {
    resize();
    particles = [];
    for(let i=0;i<80;i++) particles.push(new Particle());
  }

  function animate() {
    time++;
    ctx.clearRect(0,0,W,H);
    drawFog();
    drawGrid();
    drawDataBlocks();
    drawCandlesticks();
    drawPriceLine();
    drawArrows();
    drawGridNodes();
    drawConnections();
    particles.forEach(p=>{p.update();p.draw();});
    requestAnimationFrame(animate);
  }

  canvas.addEventListener('mousemove',e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;});
  canvas.addEventListener('mouseleave',()=>{mouse.x=-1000;mouse.y=-1000;});
  window.addEventListener('resize',()=>{resize();particles.forEach(p=>{if(p.x>W)p.x=W*0.5;if(p.y>H)p.y=H*0.5;});});
  init(); animate();
})();

// ========== NAVBAR SCROLL ==========
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll',()=>{window.scrollY>50?navbar.classList.add('scrolled'):navbar.classList.remove('scrolled');},{passive:true});
}

// ========== MOBILE MENU ==========
function toggleMobile(){document.getElementById('mobileToggle').classList.toggle('active');document.getElementById('mobileMenu').classList.toggle('active');document.body.style.overflow=document.getElementById('mobileMenu').classList.contains('active')?'hidden':'';}
function closeMobile(){document.getElementById('mobileToggle').classList.remove('active');document.getElementById('mobileMenu').classList.remove('active');document.body.style.overflow='';}

// ========== INTERSECTION OBSERVER ==========
const observer = new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');e.target.querySelectorAll('[data-target]').forEach(c=>animateCounter(c));observer.unobserve(e.target);}});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade-up,.fade-in').forEach(el=>observer.observe(el));

// ========== ANIMATED COUNTERS ==========
function animateCounter(el,dur){
  if(el.dataset.animated)return; el.dataset.animated='true';
  const target=parseInt(el.dataset.target), d=dur||2500;
  el.textContent='0+'; const start=performance.now();
  const step=(now)=>{const p=Math.min((now-start)/d,1);const e=p===1?1:1-Math.pow(2,-12*p);
  el.textContent=Math.floor(e*target)+'+';p<1?requestAnimationFrame(step):el.textContent=target+'+';};
  requestAnimationFrame(step);
}
document.querySelectorAll('[data-target]').forEach(el=>{el.textContent='0+';});
const heroStats=document.querySelectorAll('.stats-row .stat-number[data-target]');
if(heroStats.length)setTimeout(()=>{heroStats.forEach((el,i)=>{setTimeout(()=>animateCounter(el,2500),i*200);});},1500);
document.querySelectorAll('.count[data-target]').forEach(el=>{const w=el.closest('.fade-up')||el.parentElement;const o=new IntersectionObserver((e)=>{e.forEach(en=>{if(en.isIntersecting){animateCounter(el,2500);o.unobserve(en.target);}});},{threshold:0.3});o.observe(w);});

// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',(e)=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}});});

// ========== DYNAMIC YEAR ==========
const yearEls=document.querySelectorAll('.footer-bottom p');
if(yearEls.length)yearEls[0].textContent=`© ${new Date().getFullYear()} IFSA Hansraj. All rights reserved.`;



// ========== TYPEWRITER ANIMATION ==========
(function() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Finance & Strategy|Leaders',
    'Capital Markets|Analysts',
    'Research &|Consulting',
    'Investment|Strategists',
  ];
  let phraseIdx = 0, charIdx = 0, isDeleting = false;
  const pauseEnd = 2800, pauseStart = 500;

  function buildHTML(phrase, len) {
    const parts = phrase.split('|');
    const full = parts[0] + ' ' + parts[1];
    const visible = full.substring(0, len);
    const line1 = parts[0];

    if (len <= line1.length) {
      return visible;
    } else {
      const line2text = visible.substring(line1.length + 1);
      return line1 + '<br><span class="highlight">' + line2text + '</span>';
    }
  }

  function type() {
    const phrase = phrases[phraseIdx];
    const fullLen = phrase.split('|').join(' ').length;

    if (!isDeleting) {
      charIdx++;
      el.innerHTML = buildHTML(phrase, charIdx);

      if (charIdx >= fullLen) {
        setTimeout(() => { isDeleting = true; type(); }, pauseEnd);
        return;
      }
      // Variable speed for natural feel
      setTimeout(type, 80 + Math.random() * 50);
    } else {
      charIdx--;
      el.innerHTML = buildHTML(phrase, charIdx);

      if (charIdx <= 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(type, pauseStart);
        return;
      }
      setTimeout(type, 30 + Math.random() * 30);
    }
  }

  setTimeout(type, 1000);
})();

// ========== MOUSE-REACTIVE HERO GLOW ==========
(function() {
  const hero = document.querySelector('.hero');
  const glow = document.getElementById('heroGlow');
  if (!hero || !glow) return;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width * 100).toFixed(1);
    const y = ((e.clientY - r.top) / r.height * 100).toFixed(1);
    glow.style.setProperty('--glow-x', x + '%');
    glow.style.setProperty('--glow-y', y + '%');
  });
  hero.addEventListener('mouseleave', () => {
    glow.style.setProperty('--glow-x', '50%');
    glow.style.setProperty('--glow-y', '50%');
  });
})();

// ========== TERMINAL CLOCK ==========
(function() {
  const clock = document.getElementById('terminalClock');
  if (!clock) return;
  function update() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-IN', { hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST';
  }
  update();
  setInterval(update, 1000);
})();

// ========== SCROLL PROGRESS BAR ==========
(function() {
  const bar = document.getElementById('scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / h * 100) + '%';
  }, { passive: true });
})();

// ========== PARALLAX ON TEAM IMAGE ==========
(function() {
  const img = document.querySelector('.team-hero-img');
  if (!img) return;
  window.addEventListener('scroll', () => {
    const r = img.parentElement.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) {
      const p = (r.top / window.innerHeight) * 30;
      img.style.transform = `scale(1.05) translateY(${p}px)`;
    }
  }, { passive: true });
})();
