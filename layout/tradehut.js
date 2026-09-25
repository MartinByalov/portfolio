// Tradehut presentation view

export function renderTradehutPage() {
  return `
    <div class="tradehut-page-wrapper">
      <!-- Tradehut Black Header -->
      <header class="tradehut-header">
        <div class="tradehut-header-container">
          <a href="#/tradehut" class="tradehut-brand-title">Tradehut</a>
        </div>
      </header>

      <!-- Video Background & Analysis Sections -->
      <main class="tradehut-hero-section">
        <div class="tradehut-video-background">
          <video autoplay loop muted playsinline class="tradehut-bg-video" poster="https://static.wixstatic.com/media/84770f_59ee7c392e4b43de8ea55f18cb0a304f~mv2.jpg">
            <source src="https://video.wixstatic.com/video/26357a_07594806ca564172be0267fa44f5ac9a/720p/mp4/file.mp4" type="video/mp4">
          </video>
          <div class="tradehut-video-overlay"></div>
        </div>

        <div class="tradehut-cards-container">
          <!-- Section 1: Technical Analysis -->
          <div class="tradehut-analysis-card">
            <div class="tradehut-card-header">
              <h2 class="tradehut-card-title">Technical<br>Analysis</h2>
              <div class="tradehut-card-line"></div>
            </div>
            <div class="tradehut-card-media">
              <img src="https://static.wixstatic.com/media/26357a_758aa5e9c5224c00a3239bc83f2d739e~mv2.gif" alt="Technical Analysis" loading="eager" class="tradehut-card-gif">
            </div>
          </div>

          <!-- Section 2: Fundamental Analysis -->
          <div class="tradehut-analysis-card">
            <div class="tradehut-card-header">
              <h2 class="tradehut-card-title">Fundamental<br>Analysis</h2>
              <div class="tradehut-card-line"></div>
            </div>
            <div class="tradehut-card-media">
              <img src="https://static.wixstatic.com/media/26357a_d0e75a9d6c174403ae0492d9263cfef4~mv2.gif" alt="Fundamental Analysis" loading="eager" class="tradehut-card-gif">
            </div>
          </div>

          <!-- Section 3: Technical Analysis -->
          <div class="tradehut-analysis-card">
            <div class="tradehut-card-header">
              <h2 class="tradehut-card-title">Technical<br>Analysis</h2>
              <div class="tradehut-card-line"></div>
            </div>
            <div class="tradehut-card-media tradehut-card-empty-media">
              <!-- Empty media slot as in original site design -->
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}
