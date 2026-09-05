const HeaderComponent = { 
  render() {
    // Check if header already exists to prevent duplicates
    if (document.querySelector('.site-header')) {
      return;
    }

    // Create header HTML (no style injection)
    const header = document.createElement('header');
    header.className = 'site-header';
    header.setAttribute('role', 'banner');
    header.innerHTML = `
      <nav class="navbar" role="navigation" aria-label="Main navigation">
        <div class="nav-container">
          <a href="/" class="logo" aria-label="WheelGenerator Home">
            <span class="logo-icon">🎡</span>
            <span class="logo-text">Spin The Wheel</span>
          </a>
          <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
          <ul class="nav-links" id="navLinks" role="menubar">
            <li role="none"><a href="/#wheel-app" class="nav-link" role="menuitem">Spin Wheel</a></li>
            <li class="has-dropdown" role="none">
              <a href="/#wheel-types" class="nav-link" role="menuitem" aria-haspopup="true" aria-expanded="false">
                Wheel Types <span class="arrow">▾</span>
              </a>
              <ul class="dropdown" role="menu">
                <li role="none"><a href="/random-number-generator" role="menuitem">Random Number</a></li>
                <li role="none"><a href="/coin-flip" role="menuitem">Coin Flip</a></li>
                <li role="none"><a href="/decision-maker" role="menuitem">Decision Maker</a></li>
                <li role="none"><a href="/dice-roller" role="menuitem">Dice-roller</a></li>                
              </ul>
            </li>
            <li role="none"><a href="/#features" class="nav-link" role="menuitem">Features</a></li>
            <li role="none"><a href="/#how-it-works" class="nav-link" role="menuitem">How It Works</a></li>
            <li role="none"><a href="/#faq" class="nav-link" role="menuitem">FAQ</a></li>
            <li role="none"><a href="/blog" class="nav-link" role="menuitem">Blog</a></li>
            <li class="has-dropdown lang-dropdown" role="none">
              <a href="#" class="nav-link lang-link" role="menuitem" aria-haspopup="true" aria-expanded="false">
                🌐 <span class="current-lang">EN</span> <span class="arrow">▾</span>
              </a>
              <ul class="dropdown" role="menu">
                <li role="none"><a href="/" role="menuitem" data-lang="en">English</a></li>
                <li role="none"><a href="/de/" role="menuitem" data-lang="de">Deutsch</a></li>
                <li role="none"><a href="/es/" role="menuitem" data-lang="es">Español</a></li>
                <li role="none"><a href="/fr/" role="menuitem" data-lang="fr">Français</a></li>
                <li role="none"><a href="/it/" role="menuitem" data-lang="it">Italiano</a></li>
                <li role="none"><a href="/id/" role="menuitem" data-lang="id">Bahasa Indonesia</a></li>
              </ul>
            </li>
          </ul>
          <a href="/#wheel-app" class="cta-btn">Spin Now</a>
        </div>
      </nav>
    `;

    // Insert header as first child of body
    document.body.insertBefore(header, document.body.firstChild);

    // Get DOM references
    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const dropdownLinks = header.querySelectorAll('.has-dropdown > a');

    // Mobile menu toggle
    let toggleNav;
    if (toggle && navLinks) {
      toggleNav = () => {
        const isOpen = navLinks.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
      };

      toggle.addEventListener('click', toggleNav);

      // Close nav when clicking a link
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          const parentDropdown = link.closest('.has-dropdown');
          if (parentDropdown && link === parentDropdown.querySelector(':scope > a') && window.innerWidth <= 700) {
            e.preventDefault();
            const dropdown = parentDropdown.querySelector('.dropdown');
            const isExpanded = link.getAttribute('aria-expanded') === 'true';
            link.setAttribute('aria-expanded', String(!isExpanded));
            dropdown?.classList.toggle('open', !isExpanded);
            return;
          }
          
          navLinks.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('active');
          document.body.classList.remove('menu-open');
        });
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('active');
          document.body.classList.remove('menu-open');
          toggle.focus();
        }
      });
    }

    // Handle dropdowns (including language selector)
    dropdownLinks.forEach(dropdownLink => {
      const parent = dropdownLink.closest('.has-dropdown');
      const dropdown = parent?.querySelector('.dropdown');

      parent?.addEventListener('mouseenter', () => {
        if (window.innerWidth > 700) {
          dropdownLink.setAttribute('aria-expanded', 'true');
        }
      });

      parent?.addEventListener('mouseleave', () => {
        if (window.innerWidth > 700) {
          dropdownLink.setAttribute('aria-expanded', 'false');
        }
      });

      dropdownLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 700) {
          e.preventDefault();
          const isExpanded = dropdownLink.getAttribute('aria-expanded') === 'true';
          dropdownLink.setAttribute('aria-expanded', String(!isExpanded));
          dropdown?.classList.toggle('open', !isExpanded);
        }
      });
    });

    // Detect current path and update current-lang label
    const path = window.location.pathname;
    const currentLangLabel = header.querySelector('.current-lang');
    if (currentLangLabel) {
      if (path.startsWith('/de/')) currentLangLabel.textContent = 'DE';
      else if (path.startsWith('/es/')) currentLangLabel.textContent = 'ES';
      else if (path.startsWith('/fr/')) currentLangLabel.textContent = 'FR';
      else if (path.startsWith('/it/')) currentLangLabel.textContent = 'IT';
      else if (path.startsWith('/id/')) currentLangLabel.textContent = 'ID';
      else currentLangLabel.textContent = 'EN';
    }

    // Sticky header
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.scrollY > 50;
          header.classList.toggle('scrolled', scrolled);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle resize
    const handleResize = () => {
      if (window.innerWidth > 700) {
        navLinks?.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.classList.remove('active');
        document.body.classList.remove('menu-open');
        header.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
        dropdownLinks.forEach(dl => dl.setAttribute('aria-expanded', 'false'));
      }
    };

    window.addEventListener('resize', handleResize);

    header._cleanup = () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (toggleNav && toggle) toggle.removeEventListener('click', toggleNav);
    };

    return header;
  },

  destroy() {
    const header = document.querySelector('.site-header');
    if (header && header._cleanup) {
      header._cleanup();
      header.remove();
    }
  }
};

export default HeaderComponent;
