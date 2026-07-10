import SpinWheel from '/wheel.js';
import HeaderComponent from '/header.js';
import FooterComponent from '/footer.js';

document.addEventListener('DOMContentLoaded', () => {
  HeaderComponent.render();
  FooterComponent.render();

  // Confetti
  function launchConfetti() {
    const colors = ['#FF6B6B','#FFE66D','#4ECDC4','#A29BFE','#FD79A8','#00B894'];
    for (let i = 0; i < 80; i++) {
      const div = document.createElement('div');
      div.className = 'confetti-piece';
      div.style.cssText = `
        left:${Math.random()*100}vw;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        width:${6+Math.random()*6}px;
        height:${6+Math.random()*6}px;
        animation-delay:${Math.random()*0.6}s;
        animation-duration:${1.2+Math.random()*0.8}s;
        border-radius:${Math.random()>0.5?'50%':'2px'};
      `;
      document.body.appendChild(div);
      setTimeout(() => div.remove(), 2200);
    }
  }

  // --- Main Wheel ---
  let soundEnabled = true;
  let currentTheme = 'classic';

  const wheel = new SpinWheel('mainWheel', {
    soundEnabled: true,
    theme: 'classic',
    onResult: (winner) => {
      launchConfetti();
      const resultEl = document.getElementById('resultText');
      const resultBox = document.getElementById('resultBox');
      if (resultEl) {
        resultEl.textContent = winner.text;
        resultBox.classList.add('show');
        setTimeout(() => resultBox.classList.remove('show'), 5000);
      }
      addToHistory(winner.text);
    }
  });

  // Spin button
  document.getElementById('spinBtn')?.addEventListener('click', () => {
    wheel.spin();
  });

  // Canvas click to spin
  document.getElementById('mainWheel')?.addEventListener('click', () => {
    wheel.spin();
  });

  // Sound toggle
  document.getElementById('soundToggle')?.addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    wheel.soundEnabled = soundEnabled;
    this.classList.toggle('muted', !soundEnabled);
    this.title = soundEnabled ? 'Mute sound' : 'Enable sound';
    this.textContent = soundEnabled ? '🔊' : '🔇';
  });

  // Fullscreen
  document.getElementById('fullscreenBtn')?.addEventListener('click', () => {
    const el = document.getElementById('wheel-app');
    if (!document.fullscreenElement) el?.requestFullscreen?.();
    else document.exitFullscreen?.();
  });

  // --- Entries Management ---
  let entries = wheel.segments.map(s => s.text);

  function updateEntriesUI() {
    const list = document.getElementById('entriesList');
    if (!list) return;
    list.innerHTML = entries.map((e, i) => `
      <div class="entry-item" data-index="${i}">
        <span class="entry-dot" style="background:${getColor(i)}"></span>
        <span class="entry-text" contenteditable="true" onblur="window.updateEntry(${i}, this.textContent)">${e}</span>
        <button class="entry-delete" onclick="window.removeEntry(${i})" aria-label="Remove ${e}">✕</button>
      </div>
    `).join('');
    document.getElementById('entryCount').textContent = entries.length;
  }

  function getColor(i) {
    const colors = ['#FF6B6B','#FFE66D','#4ECDC4','#45B7D1','#96CEB4','#FF9A76','#A29BFE','#FD79A8','#6C5CE7','#00B894','#FDCB6E','#E17055'];
    return colors[i % colors.length];
  }

  // FIX: Theme colors mapping
  function getThemeColors(theme) {
    const themes = {
      classic: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#45B7D1', '#96CEB4', '#FF9A76', '#A29BFE', '#FD79A8', '#6C5CE7', '#00B894'],
      neon: ['#FF0080', '#00FF41', '#0080FF', '#FF00FF', '#00FFFF', '#FFFF00', '#FF4400', '#00FF80'],
      pastel: ['#FFB3BA', '#BAFFC9', '#BAE1FF', '#FFD1DC', '#E8D5B7', '#D4F0C0', '#F7DC6F', '#D7BDE2'],
      dark: ['#2D3436', '#636E72', '#74B9FF', '#FD79A8', '#00B894', '#FDCB6E', '#E17055', '#6C5CE7'],
      rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#8B00FF'],
      earth: ['#8B4513', '#A0522D', '#DEB887', '#CD853F', '#D2B48C', '#F5DEB3', '#8FBC8F', '#556B2F']
    };
    return themes[theme] || themes.classic;
  }

  function syncWheel() {
    const themeColors = getThemeColors(currentTheme);
    const segs = entries.filter(e => e.trim()).map((text, i) => ({ 
      text, 
      color: themeColors[i % themeColors.length] 
    }));
    wheel.setSegments(segs);
    updateEntriesUI();
  }

  window.updateEntry = (i, val) => { entries[i] = val.trim() || entries[i]; syncWheel(); };
  window.removeEntry = (i) => { entries.splice(i, 1); syncWheel(); };

  document.getElementById('addEntryBtn')?.addEventListener('click', () => {
    const inp = document.getElementById('newEntryInput');
    const val = inp?.value.trim();
    if (val) { entries.push(val); inp.value = ''; syncWheel(); }
  });

  document.getElementById('newEntryInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('addEntryBtn')?.click();
  });

  document.getElementById('clearAllBtn')?.addEventListener('click', () => {
    if (confirm('Clear all entries?')) { entries = []; syncWheel(); }
  });

  document.getElementById('sortBtn')?.addEventListener('click', () => {
    entries.sort((a, b) => a.localeCompare(b));
    syncWheel();
  });

  document.getElementById('shuffleBtn')?.addEventListener('click', () => {
    for (let i = entries.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [entries[i], entries[j]] = [entries[j], entries[i]];
    }
    syncWheel();
  });

  // Bulk add
  document.getElementById('bulkAddBtn')?.addEventListener('click', () => {
    const textarea = document.getElementById('bulkInput');
    const vals = (textarea?.value || '').split('\n').map(s => s.trim()).filter(Boolean);
    entries.push(...vals);
    if (textarea) textarea.value = '';
    document.getElementById('bulkModal').classList.remove('open');
    syncWheel();
  });

  document.getElementById('openBulkBtn')?.addEventListener('click', () => {
    document.getElementById('bulkModal').classList.add('open');
  });

  document.getElementById('closeBulkModal')?.addEventListener('click', () => {
    document.getElementById('bulkModal').classList.remove('open');
  });

  // FIX: Theme selector - Improved
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      // Update active state
      document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      // Set current theme
      currentTheme = this.dataset.theme;
      
      // Update wheel theme
      wheel.theme = currentTheme;
      
      // Sync wheel with new theme colors
      syncWheel();
    });
  });

  // Preset wheels
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const presets = {
        food: ['Pizza','Tacos','Ramen','Sushi','Burger','Curry','Pasta','BBQ'],
        yesno: ['Yes','No','Maybe','Ask Again','Definitely','No Way'],
        numbers: ['1','2','3','4','5','6','7','8','9','10'],
        colors: ['Red','Blue','Green','Yellow','Purple','Orange','Pink','Teal'],
        days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        truth: ['Truth','Dare','Skip','Wild Card','Double Dare','Pass'],
        custom: entries.length ? entries : ['Option 1','Option 2','Option 3'],
      };
      const key = this.dataset.preset;
      entries = [...(presets[key] || presets.custom)];
      syncWheel();
    });
  });

  // History
  let history = [];
  function addToHistory(text) {
    history.unshift({ text, time: new Date().toLocaleTimeString() });
    if (history.length > 20) history.pop();
    renderHistory();
  }
  function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    list.innerHTML = history.map((h, i) => `
      <div class="history-item">
        <span class="history-num">${i + 1}</span>
        <span class="history-text">${h.text}</span>
        <span class="history-time">${h.time}</span>
      </div>
    `).join('') || '<p class="no-history">No spins yet. Spin the wheel!</p>';
  }

  document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
    history = [];
    renderHistory();
  });

  // Remove duplicate toggle
  document.getElementById('removeAfterSpin')?.addEventListener('change', function() {
    wheel.removeAfterSpin = this.checked;
    if (this.checked) {
      wheel.onResult = (winner, index) => {
        launchConfetti();
        const resultEl = document.getElementById('resultText');
        const resultBox = document.getElementById('resultBox');
        if (resultEl) { resultEl.textContent = winner.text; resultBox.classList.add('show'); setTimeout(() => resultBox.classList.remove('show'), 5000); }
        addToHistory(winner.text);
        entries.splice(index, 1);
        if (entries.length === 0) entries = ['Refill entries!'];
        syncWheel();
      };
    } else {
      wheel.onResult = (winner) => {
        launchConfetti();
        const resultEl = document.getElementById('resultText');
        const resultBox = document.getElementById('resultBox');
        if (resultEl) { resultEl.textContent = winner.text; resultBox.classList.add('show'); setTimeout(() => resultBox.classList.remove('show'), 5000); }
        addToHistory(winner.text);
      };
    }
  });

  // Preset wheel type tabs
  document.querySelectorAll('.wheel-type-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.wheel-type-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.wheel-type-panel').forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      document.getElementById('panel-' + this.dataset.type)?.classList.add('active');
    });
  });

  // Share wheel
  document.getElementById('shareBtn')?.addEventListener('click', () => {
    const url = `https://wheelgenerator.github.io/?entries=${encodeURIComponent(entries.join(','))}`;
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('shareBtn');
      btn.textContent = '✅ Copied!';
      setTimeout(() => btn.textContent = '🔗 Share Wheel', 2000);
    });
  });

  // Init
  syncWheel();
  renderHistory();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});
