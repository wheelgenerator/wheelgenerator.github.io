const HeaderComponent = { 
  render() {
    // Check if header already exists to prevent duplicates
    if (document.querySelector('.site-header')) {
      return;
    }

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
        document.body.style.overflow = isOpen ? 'hidden' : '';
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
          document.body.style.overflow = '';
        });
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('open')) {
          navLinks.classList.remove('open');
          toggle.setAttribute('aria-expanded', 'false');
          toggle.classList.remove('active');
          document.body.style.overflow = '';
          toggle.focus();
        }
      });
    }

    // Handle dropdown on desktop hover and mobile click
    if (dropdownLink && dropdown) {
      // Desktop: hover support
      const parent = dropdownLink.closest('.has-dropdown');
      
      parent?.addEventListener('mouseenter', () => {
        if (window.innerWidth > 700) {
          dropdownLink.setAttribute('aria-expanded', 'true');
          dropdown.style.opacity = '1';
          dropdown.style.pointerEvents = 'auto';
          dropdown.style.transform = 'translateY(0)';
        }
      });

      parent?.addEventListener('mouseleave', () => {
        if (window.innerWidth > 700) {
          dropdownLink.setAttribute('aria-expanded', 'false');
          dropdown.style.opacity = '0';
          dropdown.style.pointerEvents = 'none';
          dropdown.style.transform = 'translateY(-8px)';
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
        document.body.style.overflow = '';
        dropdown?.classList.remove('open');
        dropdownLink?.setAttribute('aria-expanded', 'false');
        
        // Reset dropdown styles for desktop
        if (dropdown && window.innerWidth > 700) {
          dropdown.style.opacity = '0';
          dropdown.style.pointerEvents = 'none';
          dropdown.style.transform = 'translateY(-8px)';
        }
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
  }
};

export default HeaderComponent;
