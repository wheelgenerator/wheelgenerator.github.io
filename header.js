const HeaderComponent = {
  render() {
    const header = document.createElement('header');
    header.className = 'site-header';
    header.innerHTML = `
      <nav class="navbar">
        <div class="nav-container">
          <a href="/" class="logo" aria-label="WheelGenerator Home">
            <span class="logo-icon">🎡</span>
            <span class="logo-text">WheelGenerator</span>
          </a>
          <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
          <ul class="nav-links" id="navLinks" role="navigation" aria-label="Main navigation">
            <li><a href="/#wheel-app" class="nav-link">Spin Wheel</a></li>
            <li class="has-dropdown">
              <a href="/#wheel-types" class="nav-link">Wheel Types <span class="arrow">▾</span></a>
              <ul class="dropdown">
                <li><a href="/#wheel-types">Random Picker</a></li>
                <li><a href="/#wheel-types">Yes/No Wheel</a></li>
                <li><a href="/#wheel-types">Number Wheel</a></li>
                <li><a href="/#wheel-types">Color Wheel</a></li>
                <li><a href="/#wheel-types">Custom Wheel</a></li>
              </ul>
            </li>
            <li><a href="/#features" class="nav-link">Features</a></li>
            <li><a href="/#how-it-works" class="nav-link">How It Works</a></li>
            <li><a href="/#faq" class="nav-link">FAQ</a></li>
          </ul>
          <a href="/#wheel-app" class="cta-btn">Spin Now</a>
        </div>
      </nav>
    `;
    document.body.prepend(header);

    const toggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    toggle?.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !expanded);
      navLinks?.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Close nav on link click
    navLinks?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle?.setAttribute('aria-expanded', 'false');
        toggle?.classList.remove('active');
      });
    });

    // Sticky header
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    });
  }
};

export default HeaderComponent;
