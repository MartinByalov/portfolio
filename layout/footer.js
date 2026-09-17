// Application footer component

export function render() {
  return `
    <footer class="main-footer">
      <div class="footer-row footer-top">
        <div class="footer-col col-contact">
          <h4 class="col-title">Контакти</h4>
          <p class="footer-phone-only">Тел: <a href="tel:+359876311455">+359876311455</a></p>
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
        </div>
      </div>
      <div class="footer-row footer-bottom">
        <p>© 2026 Всички права са запазени | <a href="#/">Начало</a> | <a href="#top" class="back-to-top">Горе <i class="fas fa-arrow-up"></i></a></p>
      </div>
    </footer>
  `;
}
