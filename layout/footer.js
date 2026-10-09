// Application footer component

export function render() {
  return `
    <footer class="main-footer">
      <div class="footer-row footer-top">
        <div class="footer-col col-contact">
          <h4 class="col-title">Контакти</h4>
          <p class="footer-phone-only">Тел: <a href="tel:+359876799244">+359876799244</a></p>
          <p class="footer-email-only">Email: <a href="mailto:byalov.v.martin@gmail.com">byalov.v.martin@gmail.com</a></p>
          <div class="map-widget">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.282173809726!2d23.326219650804765!3d42.65393897916878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40aa844f44a22e1d%3A0x8b0a4e232c8f84bc!2z0KTQsNC60YPQu9GM0YLQtdGCINCc0LjRg9C70LjQuSDQvNC10LvQuNGH0LXQu9Cw!5e0!3m2!1sbg!2sbg"
              width="100%" height="150" style="border:0; border-radius: 8px;" allowfullscreen=""
              loading="lazy" referrerpolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
        <div class="footer-col col-initiatives">
          <h4 class="col-title">Полезни връзки</h4>
          <ul>
            <li><a href="https://edu.google.com/workspace-for-education/products/classroom/" target="_blank" rel="noopener">Google Classroom</a></li>
            <li><a href="https://learningapps.org/" target="_blank" rel="noopener">LearningApps</a></li>
            <li><a href="https://ebook.domino.bg/" target="_blank" rel="noopener">изд. Домино</a></li>
            <li><a href="https://www.w3schools.com/" target="_blank" rel="noopener">w3schools</a></li>
            <li><a href="https://planeta42.com/it/bg.html" target="_blank" rel="noopener">planeta42</a></li>
            <li><a href="https://safenet.bg/" target="_blank" rel="noopener">safenet</a></li>
          </ul>
        </div>
        <div class="footer-col col-social">
          <h4 class="col-title">Социални мрежи</h4>
          <div class="social-links">
            <a href="https://bg.linkedin.com/in/martin-byalov-42615392" target="_blank" rel="noopener"><i class="fab fa-linkedin-in"></i></a>
            <a href="https://www.youtube.com/@%D0%9C%D0%B0%D1%80%D1%82%D0%B8%D0%BD%D0%91%D1%8F%D0%BB%D0%BE%D0%B2" target="_blank" rel="noopener"><i class="fab fa-youtube"></i></a>
            <a href="https://discord.com/users/martinbyalov" target="_blank" rel="noopener"><i class="fab fa-discord"></i></a>
          </div>
          <div class="footer-other">
            <h4 class="col-title">Други</h4>
            <div class="footer-wix-buttons">
              <a href="https://www.melodia.lol/" target="_blank" rel="noopener" class="wix-icon-btn wix-icon-btn-triangle" aria-label="Melodia.Lol">
                <span class="wix-icon-wrapper">
                  <svg viewBox="0 0 331 331" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M0 165.5V331h331V0H0v165.5zm166.7-66.3c.6.7 3.1 5.1 5.6 9.8 2.4 4.7 13.6 25.4 24.7 46s22.3 41.3 24.8 46c2.5 4.7 5.4 9.8 6.4 11.5 1 1.6 1.8 3.8 1.8 4.7 0 1.7-3.8 1.8-65 1.8-35.7 0-65-.4-65-.8 0-.5 11.5-22.2 25.6-48.3 29.9-55.4 33.4-62 36.4-67.7 2.3-4.4 3.1-5 4.7-3z"></path>
                    <path d="M164.4 130.2c-.5.7-2 3.5-3.5 6.3-4.5 8.7-13.1 24.8-15.9 30-10.9 20-18.1 34.8-17.6 36 .8 2.2 75.4 2.2 76.2 0 .3-.7-1.4-5.1-3.9-9.7-6.6-12.2-11.7-22-18.2-34.3-15.5-29.5-15.9-30.2-17.1-28.3z"></path>
                  </svg>
                </span>
              </a>
              <a href="https://martinbyalov.github.io/foly/" class="wix-icon-btn wix-icon-btn-stairs" aria-label="Tradehut">
                <span class="wix-icon-wrapper">
                  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M124.167 124.167V75.833H75.833V27.5H27.5v145h145v-48.333h-48.333z"></path>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-row footer-bottom">
        <p>© 2026 Всички права запазени | <a href="#/">Начало</a> | <a href="#top" class="back-to-top">Горе <i class="fas fa-arrow-up"></i></a></p>
      </div>
    </footer>
  `;
}
