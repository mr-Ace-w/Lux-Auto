export function Footer() {
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/images/logo/LuxAutoImg2.png" alt="Lux Auto Logo" className="footer-logo-img" />
          <div>
            <div className="footer-brand-name">
              <span className="footer-turbo">Lux</span><span className="footer-auto">Auto</span>
            </div>
            <p className="footer-tagline">Ваш надійний автомайданчик у Теребовлі</p>
          </div>
        </div>

        <div className="footer-col">
          <h4>Контакти</h4>
          <p><a href="tel:+380968264242">+380 96 826 4242</a></p>
          <p>вул. Князя Василька, 1/5</p>
          <p>Теребовля, 48100</p>
        </div>

        <div className="footer-col">
          <h4>Графік роботи</h4>
          <p>Пн–Нд: 08:58 – 21:21</p>
          <p>Без вихідних</p>
        </div>

        <div className="footer-col">
          <h4>Соцмережі</h4>
          <div className="footer-socials">
            <a href="https://t.me/luxautotern" target="_blank" rel="noopener noreferrer" aria-label="Telegram">
              <img src="/images/icons/telegram.png" alt="Telegram" />
            </a>
            <a href="https://www.instagram.com/lux_auto_tern/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/images/icons/instagram.png" alt="Instagram" />
            </a>
            <a href="https://www.tiktok.com/@luxavtoter" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <img src="/images/icons/tiktok.png" alt="TikTok" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 Lux Auto. All rights reserved.</span>
        <span>Designed &amp; Developed by Vynnytsky.</span>
      </div>
    </footer>
  );
}
