'use client';

import { useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function About() {
  useEffect(() => {
    document.title = "Про нас | Lux Auto";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const sections = document.querySelectorAll(
      ".about-hero, .about-stats, .about-section, .about-location, .reviews"
    );
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />

      <main className="about-page">

        <section className="about-hero">

          <img
            src="/images/logo/1.png.webp"
            alt="Lux Auto"
            className="about-image"
          />

          <div className="about-text">

            <div className="badge">
              🚗 Надійні автомобілі з пробігом
            </div>

            <h1>Lux Auto</h1>

            <p>
              Майданчик з продажу, обміну та викупу автомобілів у Теребовлі.
              Допомагаємо знайти надійне авто за чесною ціною.
            </p>

            <div className="about-features">

              <span>✔ Продаж авто</span>

              <span>✔ Обмін авто</span>

              <span>✔ Викуп авто</span>

              <span>✔ Допомога з документами</span>

            </div>

            <Link href="/contacts" className="btn">
              Зв'язатися з нами
            </Link>

          </div>

        </section>

        <section className="about-stats">

          <div>
            <h2>200+</h2>
            <p>Проданих авто</p>
          </div>

          <div>
            <h2>3+</h2>
            <p>Років досвіду</p>
          </div>

          <div>
            <h2>100+</h2>
            <p>Авто в наявності</p>
          </div>

        </section>

        <section className="about-section why-us-section">
          <div className="why-us-inner">
            <div className="why-us-header">
              <span className="section-eyebrow">Наші переваги</span>
              <h2>Чому обирають <span className="text-red">Lux Auto</span>?</h2>
              <p>Ми не просто продаємо авто — ми створюємо новий стандарт надійності та прозорості</p>
            </div>
            <div className="why-us-grid">
              <div className="why-card bento-wide">
                <div className="why-card-content">
                  <h3>Ретельна перевірка автомобілів</h3>
                  <p>Кожен автомобіль проходить комплексний технічний огляд по 100+ пунктах, комп'ютерну діагностику та ретельну перевірку юридичної чистоти перед продажем.</p>
                </div>
                <div className="why-icon-absolute">🔍</div>
              </div>

              <div className="why-card">
                <div className="why-card-content">
                  <h3>Вигідний Trade-In</h3>
                  <p>Обміняйте свій старий автомобіль на будь-який інший з нашого майданчика з доплатою в обидві сторони за 1 годину.</p>
                </div>
                <div className="why-icon-absolute">🔄</div>
              </div>

              <div className="why-card">
                <div className="why-card-content">
                  <h3>Чесні ціни без комісій</h3>
                  <p>Ціна, яку ви бачите на сайті, є кінцевою. Жодних прихованих платежів, накруток чи додаткових зборів.</p>
                </div>
                <div className="why-icon-absolute">💰</div>
              </div>

              <div className="why-card bento-wide">
                <div className="why-card-content">
                  <h3>Юридичний супровід та документи</h3>
                  <p>Ми повністю беремо на себе переоформлення: перевірка в реєстрах, підготовка договорів та повний супровід під час реєстрації в сервісному центрі МВС.</p>
                </div>
                <div className="why-icon-absolute">📋</div>
              </div>

              <div className="why-card">
                <div className="why-card-content">
                  <h3>Швидкий автовикуп</h3>
                  <p>Терміново потрібні гроші? Ми проведемо експрес-оцінку та викупимо ваше авто за максимально вигідною ринковою ціною.</p>
                </div>
                <div className="why-icon-absolute">⚡</div>
              </div>

              <div className="why-card bento-wide">
                <div className="why-card-content">
                  <h3>Підтримка та робота щодня</h3>
                  <p>Працюємо без вихідних та свят з 08:58 до 21:21. Наші менеджери завжди готові відповісти на будь-які запитання та допомогти з вибором.</p>
                </div>
                <div className="why-icon-absolute">🤝</div>
              </div>
            </div>
          </div>
        </section>



        {/* Галерея */}

<section className="about-gallery">

    <img
        src="/images/logo/9.png"
        alt="Lux Auto"
    />

</section>


{/* Адреса */}

<section className="about-location">

    <div className="location-text">

        <h2>Наша адреса</h2>

        <p>
           Вулиця Князя Василька, 1/5, Теребовля, Тернопільська область, 48100
        </p>

        <a
            href="https://maps.app.goo.gl/dVUPc9niT6nk2k5T8"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
        >
            Відкрити на карті
        </a>

    </div>

    <div className="about-map-container">
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

</section>


{/* Соцмережі */}

<section className="about-section">

    <h2 className="section-title">
        Наші соцмережі
    </h2>

    <div className="social">

        <a
            href="https://www.instagram.com/lux_auto_tern/"
            target="_blank"
        >
            <img
                src="/images/icons/lux_auto_tern_qr.png"
                alt="Instagram"
            />
        </a>

        <a
            href="https://www.tiktok.com/@luxavtoter"
            target="_blank"
        >
            <img
                src="/images/icons/tiktok_qr.jpg"
                alt="TikTok"
            />
        </a>

        <a
            href="https://t.me/luxautotern"
            target="_blank"
        >
            <img
                src="/images/icons/telegram_qr.png"
                alt="Telegram"
            />
        </a>

    </div>

    <div className="social-text">

        <h3>Instagram</h3>

        <h3>TikTok</h3>

        <h3>Telegram</h3>

    </div>

</section>


{/* Відгуки */}

<section className="reviews">

    <h1>Що кажуть клієнти</h1>

    <div className="reviews-grid">

        <div className="review-box">

            ⭐⭐⭐⭐⭐

            <p>
                Майданчик з величезним вибором автомобілів
                за приємними цінами та в гарному стані.
                Рекомендую!!!!
            </p>

        </div>

        <div className="review-box">

            ⭐⭐⭐⭐⭐

            <p>
                Дуже порядні хлопці!!!
                Допоможуть підібрати любе авто
                за любий бюджет!!!
                Молодці!!!
                Рекомендую!!!
            </p>

        </div>

        <div className="review-box">

            ⭐⭐⭐⭐⭐

            <p>
                Надзвичайно кваліфіковані фахівці
                та дуже великий вибір.
                Придбали авто, мега щасливі.
            </p>

        </div>

    </div>

</section>

      </main>

      <Footer />
    </>
  );
}