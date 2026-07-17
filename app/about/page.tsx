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

        <section className="about-section">

          <h2 className="section-title">
            Чому обирають нас?
          </h2>

          <div className="cards">

            <div className="card">
              🚗 Великий вибір автомобілів
            </div>

            <div className="card">
              🔍 Перевірка технічного стану
            </div>

            <div className="card">
              📄 Допомога з документами
            </div>

            <div className="card">
              🤝 Чесний обмін та викуп
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

    <img
        src="/images/logo/geo2.png"
        alt="Карта"
    />

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