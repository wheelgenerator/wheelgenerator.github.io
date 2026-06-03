const FooterComponent = {
  render() {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="footer-container">
        <div class="footer-brand">
          <a href="/" class="footer-logo" aria-label="Spin ">
            <span class="logo-icon">🎡</span>
            <span>Spin The Wheel</span>
          </a>
          <p class="footer-tagline">Make every decision fun with a spin! The best free spin wheel random picker tool online.</p>
          <div class="footer-social">
            
          </div>
        </div>
        <div class="footer-links">
          <div class="footer-col">
            <h4>Spin Wheels</h4>
            <ul>
              <li><a href="/#wheel-app">Random Wheel Spinner</a></li>
              <li><a href="/#wheel-types">Yes or No Wheel</a></li>
              <li><a href="/#wheel-types">Number Wheel</a></li>
              <li><a href="/#wheel-types">Color Picker Wheel</a></li>
              <li><a href="/#wheel-types">Spin The Wheel Custom</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Features</h4>
            <ul>
              <li><a href="/#features">Free Spin Wheel</a></li>
              <li><a href="/#features">Custom Wheel Builder</a></li>
              <li><a href="/#features">Save & Share</a></li>
              <li><a href="/#features">Multiple Themes</a></li>
              <li><a href="/#features">Wheel Generator</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Use Cases</h4>
            <ul>
              <li><a href="/#use-cases">Random Picker</a></li>
              <li><a href="/#use-cases">Classroom Tools</a></li>
              <li><a href="/#use-cases">Giveaways</a></li>
              <li><a href="/#use-cases">Team Decisions</a></li>
              <li><a href="/#use-cases">Games & Fun</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Pages</h4>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} WheelGenerator — <a href="https://wheelgenerator.github.io">wheelgenerator.github.io</a>. Free Spin Wheel Online.</p>
      </div>
    `;
    document.body.appendChild(footer);
  }
};

export default FooterComponent;
