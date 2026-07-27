const HeaderComponent = { 
  render() {
    // Check if header already exists to prevent duplicates
    if (document.querySelector('.site-header')) {
      return;
    }

    // Inject header styles
    const style = document.createElement('style');
    style.textContent = `
      /* ── Header Styles ─────────────────────────────────────────── */
      .site-header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        background: rgba(255,255,255,0.95);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid transparent;
        transition: border-color .3s, box-shadow .3s;
        height: 68px;
        will-change: transform;
        transform: translateZ(0);
        backface-visibility: hidden;
      }

      .site-header.scrolled {
        border-color: #E2E8F0;
        box-shadow: 0 2px 20px rgba(0,0,0,0.08);
      }

      .navbar {
        height: 100%;
      }

      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        height: 100%;
        display: flex;
        align-items: center;
        gap: 24px;
        padding: 0 24px;
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        font-size: 1.2rem;
        color: #1A202C;
        flex-shrink: 0;
        text-decoration: none;
      }

      .logo-icon {
        font-size: 1.5rem;
      }

      .logo-text {
        white-space: nowrap;
      }

      .nav-links {
        display: flex;
        align-items: center;
        gap: 4px;
        margin-left: auto;
      }

      .nav-link {
        padding: 8px 12px;
        border-radius: 10px;
        font-size: 0.9rem;
        font-weight: 600;
        color: #4A5568;
        transition: color .2s, background .2s;
        white-space: nowrap;
        text-decoration: none;
        display: block;
      }

      .nav-link:hover {
        color: #FF6B35;
        background: rgba(255,107,53,0.06);
      }

      .has-dropdown {
        position: relative;
      }

      .has-dropdown > a {
        cursor: pointer;
      }

      .has-dropdown > a .arrow {
        display: inline-block;
        transition: transform 0.3s ease;
        margin-left: 4px;
        font-size: 0.7rem;
      }

      .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        background: #FFFFFF;
        border: 1px solid #E2E8F0;
        border-radius: 16px;
        box-shadow: 0 12px 48px rgba(0,0,0,0.14);
        min-width: 180px;
        padding: 8px;
        opacity: 0;
        pointer-events: none;
        transform: translateY(-8px);
        transition: opacity .2s, transform .2s;
        z-index: 100;
        list-style: none;
      }

      .has-dropdown:hover .dropdown {
        opacity: 1;
        pointer-events: auto;
        transform: translateY(0);
      }

      .dropdown li a {
        display: block;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 0.875rem;
        font-weight: 600;
        color: #4A5568;
        transition: background .2s, color .2s;
        text-decoration: none;
      }

      .dropdown li a:hover {
        background: #F0F4F8;
        color: #FF6B35;
      }

      .cta-btn {
        background: #FF6B35;
        color: #fff;
        padding: 10px 22px;
        border-radius: 50px;
        font-weight: 700;
        font-size: 0.9rem;
        transition: background .2s, transform .15s, box-shadow .2s;
        flex-shrink: 0;
        box-shadow: 0 4px 14px rgba(255,107,53,0.35);
        text-decoration: none;
        white-space: nowrap;
      }

      .cta-btn:hover {
        background: #E85520;
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(255,107,53,0.45);
      }

      .nav-toggle {
        display: none;
        flex-direction: column;
        gap: 5px;
        width: 32px;
        height: 32px;
        justify-content: center;
        margin-left: auto;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
      }

      .nav-toggle span {
        display: block;
        height: 2px;
        background: #1A202C;
        border-radius: 2px;
        transition: transform .3s, opacity .3s;
        width: 100%;
      }

      .nav-toggle.active span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }

      .nav-toggle.active span:nth-child(2) {
        opacity: 0;
      }

      .nav-toggle.active span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }

      /* ── Mobile Styles ──────────────────────────────────────────── */
      @media (max-width: 700px) {
        .nav-links {
          display: none !important;
          position: fixed;
          top: 68px;
          left: 0;
          right: 0;
          bottom: 0;
          background: #FFFFFF;
          flex-direction: column;
          align-items: flex-start;
          padding: 24px;
          z-index: 999;
          gap: 4px;
          overflow-y: auto;
          margin: 0;
        }

        .nav-links.open {
          display: flex !important;
        }

        .nav-toggle {
          display: flex;
        }

        .cta-btn {
          display: none;
        }

        .has-dropdown {
          width: 100%;
        }

        .has-dropdown > a {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }

        .has-dropdown .dropdown {
          position: relative !important;
          top: 0 !important;
          left: 0 !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: none !important;
          box-shadow: none !important;
          border: none !important;
          border-left: 3px solid #FF6B35 !important;
          border-radius: 0 !important;
          min-width: 100% !important;
          background: transparent !important;
          padding: 0 !important;
          margin-top: 4px !important;
          max-height: 0 !important;
          overflow: hidden !important;
          transition: max-height 0.4s ease, padding 0.3s ease !important;
          display: block !important;
        }

        .has-dropdown .dropdown.open {
          max-height: 800px !important;
          padding: 8px 0 8px 12px !important;
          overflow-y: auto !important;
        }

        .has-dropdown .dropdown li a {
          padding: 10px 12px !important;
          font-size: 0.9rem !important;
        }

        .has-dropdown > a[aria-expanded="true"] .arrow {
          transform: rotate(180deg) !important;
        }

        .has-dropdown:hover .dropdown {
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: none !important;
        }

        .nav-link {
          width: 100%;
          padding: 10px 12px;
        }
      }

      @media (max-width: 480px) {
        .has-dropdown .dropdown.open {
          max-height: 600px !important;
        }
      }

      /* Prevent body scroll when mobile menu is open */
      body.menu-open {
        overflow: hidden !important;
      }

      /* Font fallback */
      .wf-loading {
        visibility: hidden;
      }
      .wf-active, .wf-inactive {
        visibility: visible;
      }
    `;
    document.head.appendChild(style);

    // Create header HTML
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
    const dropdownLink = header.querySelector('.has-dropdown > a');
    const dropdown = header.querySelector('.dropdown');

    // Mobile menu toggle
    if (toggle && navLinks) {
      const toggleNav = () => {
        const isOpen = navLinks.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
      };

      toggle.addEventListener('click', toggleNav);

      // Close nav when clicking a link
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          // Don't close if clicking dropdown toggle on mobile
          if (link === dropdownLink && window.innerWidth <= 700) {
            e.preventDefault();
            const isExpanded = link.getAttribute('aria-expanded') === 'true';
            link.setAttribute('aria-expanded', String(!isExpanded));
            dropdown.classList.toggle('open', !isExpanded);
            return;
          }
          
          navLinks.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('active');
          document.body.classList.remove('menu-open');
        });
      });

      // Close on escape key
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

    // Handle dropdown on desktop hover and mobile click
    if (dropdownLink && dropdown) {
      const parent = dropdownLink.closest('.has-dropdown');
      
      // Desktop: hover support
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

      // Mobile: click support
      dropdownLink.addEventListener('click', (e) => {
        if (window.innerWidth <= 700) {
          e.preventDefault();
          const isExpanded = dropdownLink.getAttribute('aria-expanded') === 'true';
          dropdownLink.setAttribute('aria-expanded', String(!isExpanded));
          dropdown.classList.toggle('open', !isExpanded);
        }
      });
    }

    // Sticky header with throttle
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

    // Handle resize for mobile/desktop transitions
    const handleResize = () => {
      if (window.innerWidth > 700) {
        // Reset mobile states
        navLinks?.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.classList.remove('active');
        document.body.classList.remove('menu-open');
        dropdown?.classList.remove('open');
        dropdownLink?.setAttribute('aria-expanded', 'false');
      }
    };

    window.addEventListener('resize', handleResize);

    // Store cleanup function
    header._cleanup = () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      toggle?.removeEventListener('click', toggleNav);
    };

    return header;
  },

  // Cleanup method to prevent memory leaks
  destroy() {
    const header = document.querySelector('.site-header');
    if (header && header._cleanup) {
      header._cleanup();
      header.remove();
    }
    // Remove injected styles
    const style = document.querySelector('style[data-header-style]');
    if (style) {
      style.remove();
    }
  }
};

export default HeaderComponent;
