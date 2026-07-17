export function Footer() {
  return (
    <footer>
      <h3>Lux Auto</h3>
      <br />
      <div className="info-footer">
        <div className="phone">
          <h4>Телефонуйте:</h4>
          <p><a href="tel:+380968264242">+380 96 826 4242</a></p>
        </div>
        <br />
        <div className="work-time">
          <h4>Графік роботи:</h4>
          <p>Пн-Нд 08:58–21:21</p>
        </div>
        <br />
        <div className="footer-logo">
          <img src="/images/logo/LuxAutoImg2.png" alt="Lux Auto Logo" />
          <span>
            © 2026 Lux Auto.<br />
            All rights reserved.<br />
            Designed & Developed by Vynn.
          </span>
        </div>
      </div>
    </footer>
  );
}
