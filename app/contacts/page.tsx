'use client';

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Contacts() {
  useEffect(() => {
    document.title = "Зв'яжіться з нами | Lux Auto";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.transitionDelay = `${index * 0.05}s`;
            el.classList.add("show");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    const animElements = document.querySelectorAll(".catalog-hero, .cards-info");
    animElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />

      <main className="contacts-page">

        {/* Hero */}
        <section id="catalog-hero" className="catalog-hero">
          <div id="catalog-hero-text" className="catalog-hero-text">
            <div className="badge">
              🚗 Як зв'язатися з нами?
            </div>
            <h1>Зв'яжіться з Lux Auto</h1>
            <p>
              Маєте питання щодо автомобіля?<br />
              Ми допоможемо підібрати авто або проконсультуємо щодо обміну та викупу.
            </p>
          </div>
        </section>

        {/* Карточки */}
        <section id="#cards" className="cards">

          {/* Контакти */}
          <div className="cards-info">
            <div className="badge2">
              <h4> 📞 Зв'яжіться з нами</h4>
            </div>
            <div className="card-content">
              <h2>За номером:</h2>
              <div className="phone-number">
                <p>+380-96-826-4242</p>
              </div>
              <p><b>Або</b></p>
              <div className="phone-card">
                <a href="https://t.me/luxautotern" target="_blank" rel="noopener noreferrer">
                  <img src="/images/icons/telegram.png" alt="Telegram Icon" />
                  <img src="/images/icons/telegram_qr.png" alt="Telegram QR" />
                </a>
                <a href="https://www.instagram.com/lux_auto_tern/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/icons/instagram.png" alt="Instagram Icon" />
                  <img src="/images/icons/lux_auto_tern_qr.png" alt="Instagram QR" />
                </a>
              </div>
            </div>
          </div>

          {/* Адреса */}
          <div className="cards-info">
            <div className="badge2">
              <h4>📍 Де ми знаходимось?</h4>
            </div>
            <div className="card-content">
              <h2>Наша адреса:</h2>
              <p>Вулиця Князя Василька, 1/5, Теребовля, Тернопільська область, 48100</p>
              <a className="btn" href="https://maps.app.goo.gl/dVUPc9niT6nk2k5T8" target="_blank" rel="noopener noreferrer">
                Відкрити на карті
              </a>
            </div>
          </div>

          {/* Графік */}
          <div className="cards-info">
            <div className="badge2">
              <h4>⏰ Графік?</h4>
            </div>
            <div className="card-content">
              <div className="work-time">
                <h2>Працюємо щодня</h2>
                <p>Пн-Нд:</p>
                <span className="big-time"><p>08:58 – 21:21</p></span>
              </div>
            </div>
          </div>

        </section>

        {/* Карта */}
        <div className="contacts-map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2598.636009848529!2d25.68598421272659!3d49.30062767921206!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4731b1007b520b9d%3A0x9e1a9ef93a656d7c!2sLUX%20AUTO!5e0!3m2!1suk!2sua!4v1700000000000!5m2!1suk!2sua"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lux Auto Google Map"
          />
        </div>

        {/* Допомога */}
        <div className="card2">
          <div className="card2-info">
            <div className="badge3">
              <h4>🚗 Не знайшли потрібне авто?</h4>
            </div>
            <div className="help-car">
              <h3>Ми допоможемо підібрати автомобіль,<br /> під ваш бюджет та побажання.</h3>
              <a href="#catalog-hero" className="btn2">Зв'язатися зараз</a>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </>
  );
}