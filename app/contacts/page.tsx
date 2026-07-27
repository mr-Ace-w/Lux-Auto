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
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animElements = document.querySelectorAll(".contacts-split-container");
    animElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />

      <main className="contacts-page">
        {/* Sleek Header Section */}
        <section className="contacts-hero-new">
          <div className="contacts-hero-inner">
            <span className="section-eyebrow">Ми завжди на зв'язку</span>
            <h1>Зв'яжіться з нами</h1>
            <p>Хочете оглянути автомобіль, обговорити умови Trade-In чи запропонувати авто на викуп? Ми чекаємо на вас!</p>
          </div>
        </section>

        {/* Contacts Split Layout (Map + Cards) */}
        <section className="contacts-split-container">
          {/* Left Column: Full height interactive Google Map */}
          <div className="contacts-map-column-split">
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

          {/* Right Column: Premium Info Cards stack */}
          <div className="contacts-info-column-split">
            {/* Phone & Socials Card */}
            <div className="contact-info-card-modern">
              <div className="card-header-row">
                <span className="card-icon-badge">📞</span>
                <h4>Зв'язатися з нами</h4>
              </div>
              <div className="card-body-content">
                <a href="tel:+380968264242" className="contact-phone-accent">+380 96 826 42 42</a>
                <p className="contact-desc-text">Телефонуйте у будь-який час. Ми завжди готові проконсультувати.</p>
                <div className="contact-socials-row">
                  <a href="https://t.me/luxautotern" target="_blank" rel="noopener noreferrer" className="contact-social-pill telegram">
                    Telegram
                  </a>
                  <a href="https://www.instagram.com/lux_auto_tern/" target="_blank" rel="noopener noreferrer" className="contact-social-pill instagram">
                    Instagram
                  </a>
                  <a href="https://www.tiktok.com/@luxavtoter" target="_blank" rel="noopener noreferrer" className="contact-social-pill tiktok">
                    TikTok
                  </a>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="contact-info-card-modern">
              <div className="card-header-row">
                <span className="card-icon-badge">📍</span>
                <h4>Де ми знаходимось</h4>
              </div>
              <div className="card-body-content">
                <p className="contact-address-bold">вул. Князя Василька, 1/5</p>
                <p className="contact-desc-text">Теребовля, Тернопільська область, 48100</p>
                <a href="https://maps.app.goo.gl/dVUPc9niT6nk2k5T8" target="_blank" rel="noopener noreferrer" className="route-action-button">
                  Прокласти маршрут
                </a>
              </div>
            </div>

            {/* Schedule Card */}
            <div className="contact-info-card-modern">
              <div className="card-header-row">
                <span className="card-icon-badge">⏰</span>
                <h4>Режим роботи</h4>
              </div>
              <div className="card-body-content">
                <p className="contact-schedule-bold">Працюємо щодня без вихідних</p>
                <p className="contact-schedule-time">Пн - Нд: 08:58 – 21:21</p>
                <p className="contact-desc-text">Огляди автомобілів можливі у будь-який зручний для вас час за попередньою домовленістю.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}