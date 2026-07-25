import type { Metadata } from 'next';
import Script from 'next/script';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Catalog } from '@/components/catalog';
import { getCars } from '@/lib/cars';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Купити авто з пробігом у Теребовлі | Автосалон Lux Auto',
  description: 'Шукаєте надійне вживане авто? Автомайданчик Lux Auto в Теребовлі пропонує великий вибір перевірених автомобілів з прозорою історією за вигідними цінами. 🚗',
  alternates: {
    canonical: 'https://lux-auto.xyz/',
  },
  robots: {
    index: true,
    follow: true,
  },
  keywords: [
    'купити авто Теребовля',
    'продаж авто Теребовля',
    'автомайданчик Теребовля',
    'вживані авто',
    'авто з пробігом',
    'Lux Auto',
    'Люкс Авто Теребовля',
    'автосалон',
    'автоплощадка'
  ],
  openGraph: {
    title: 'Купити авто з пробігом у Теребовлі | Автосалон Lux Auto',
    description: 'Шукаєте надійне вживане авто? Автомайданчик Lux Auto в Теребовлі пропонує великий вибір перевірених автомобілів з прозорою історією за вигідними цінами. 🚗',
    url: 'https://lux-auto.xyz/',
    siteName: 'Lux Auto',
    locale: 'uk_UA',
    type: 'website',
    images: [
      {
        url: 'https://lux-auto.xyz/images/logo/1.png.webp',
        width: 1200,
        height: 630,
        alt: 'Автосалон Lux Auto Теребовля',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Купити авто з пробігом у Теребовлі | Автосалон Lux Auto',
    description: 'Автомайданчик Lux Auto в Теребовлі пропонує великий вибір перевірених автомобілів з прозорою історією.',
    images: ['https://lux-auto.xyz/images/logo/1.png.webp'],
  },
};

export default async function Home() {
  const cars = await getCars();

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://lux-auto.xyz/#website',
    'url': 'https://lux-auto.xyz/',
    'name': 'Lux Auto',
    'description': 'Автосалон та автомайданчик вживаних автомобілів у Теребовлі.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://lux-auto.xyz/?search={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const autoDealerSchema = {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': 'https://lux-auto.xyz/#localbusiness',
    'name': 'Lux Auto',
    'alternateName': 'Люкс Авто Теребовля',
    'image': 'https://lux-auto.xyz/images/logo/1.png.webp',
    'url': 'https://lux-auto.xyz/',
    'telephone': '+380968264242',
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'вулиця Князя Василька, 1/5',
      'addressLocality': 'Теребовля',
      'addressRegion': 'Тернопільська область',
      'postalCode': '48100',
      'addressCountry': 'UA'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 49.3006277,
      'longitude': 25.6881729
    },
    'openingHoursSpecification': {
      '@type': 'OpeningHoursSpecification',
      'dayOfWeek': [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
      ],
      'opens': '08:00',
      'closes': '20:00'
    },
    'sameAs': [
      'https://t.me/luxautotern',
      'https://www.instagram.com/lux_auto_tern/'
    ]
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Головна',
        'item': 'https://lux-auto.xyz/'
      }
    ]
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://lux-auto.xyz/#organization',
    'name': 'Lux Auto',
    'alternateName': 'Люкс Авто',
    'url': 'https://lux-auto.xyz/',
    'logo': 'https://lux-auto.xyz/images/logo/1.png.webp',
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+380968264242',
      'contactType': 'sales',
      'areaServed': 'UA',
      'availableLanguage': 'Ukrainian'
    },
    'sameAs': [
      'https://t.me/luxautotern',
      'https://www.instagram.com/lux_auto_tern/'
    ]
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Де знаходиться автомайданчик Lux Auto?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Автомайданчик Lux Auto розташований за адресою: вулиця Князя Василька, 1/5, Теребовля, Тернопільська область, 48100. Ви можете завітати до нас щодня з 08:00 до 20:00.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Які послуги надає автосалон Lux Auto в Теребовлі?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Ми пропонуємо продаж вживаних автомобілів з пробігом, швидкий викуп авто, обмін автомобілів за програмою Trade-In, допомогу з вибором та повний супровід при оформленні документів.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Чи можна обміняти своє старе авто на автомобіль з автомайданчика?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Так, у нас діє послуга Trade-In (обмін автомобілів). Ви можете приїхати на своєму авто для оцінки та обміняти його на будь-який автомобіль у наявності з доплатою в будь-яку сторону.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Чи проходять автомобілі в наявності технічну перевірку?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Так, усі автомобілі з пробігом у нашому автосалоні проходять ретельну перевірку технічного стану, перевірку юридичної чистоти та чесної історії автомобіля перед продажем.'
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="website-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Script
        id="autodealer-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(autoDealerSchema) }}
      />
      <Script
        id="breadcrumb-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Script
        id="organization-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Script
        id="faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />
      <main>
        <section className="hero">
          <span className="badge">🚗 Автомобілі в наявності</span>
          <h1>
            <span className="hero-brand-title">Lux Auto</span>
            <span className="hero-subtitle">Автомайданчик та продаж авто з пробігом у Теребовлі</span>
          </h1>
          <p>
            Продаж, обмін та викуп автомобілів. Перевірені авто з прозорою історією,
            чесними цінами та комфортною підтримкою по всіх питаннях.
          </p>
          <div className="pills">
            <span>✓ Перевірені авто</span>
            <span>✓ Trade-In</span>
            <span>✓ Викуп авто</span>
            <span>✓ Документи</span>
          </div>
        </section>

        <div id="catalog">
          <Catalog cars={cars} />
        </div>

        <section className="seo-text-section collapsed" id="seo-section">
          <div className="seo-container">
            <h2>Автосалон Lux Auto в Теребовлі — ваш надійний автомайданчик</h2>
            <p>
              Ласкаво просимо на офіційний сайт <strong>Люкс Авто</strong> — сучасний та професійний <strong>автомайданчик</strong>, 
              де здійснюється надійний <strong>продаж авто</strong> з гарантією прозорості та якості. Якщо ви плануєте 
              <strong>купити авто</strong>, наш <strong>автосалон</strong> у місті <strong>Теребовля</strong> стане ідеальним вибором. 
              Ми прагнемо змінити уявлення про покупку вживаної техніки, пропонуючи клієнтам винятково 
              <strong>перевірені автомобілі</strong> з чесною історією, без прихованих дефектів чи скручених пробігів. 
              Наш <strong>авторинок</strong> постійно оновлюється, надаючи покупцям актуальні <strong>авто в наявності</strong> на будь-який смак та бюджет.
            </p>

            <h3>Великий вибір перевірених автомобілів у Тернопільській області</h3>
            <p>
              На нашій <strong>автоплощадці в Теребовлі</strong> представлено <strong>великий вибір автомобілів</strong> від провідних світових виробників. 
              У каталозі <strong>Люкс Авто Теребовля</strong> ви знайдете популярні моделі таких брендів, як німецькі флагмани 
              <strong>BMW</strong>, <strong>Audi</strong>, <strong>Mercedes-Benz</strong>, <strong>Volkswagen</strong> та <strong>Opel</strong>. 
              Також ми пропонуємо практичні та надійні автомобілі сімейного та міського класу від <strong>Skoda</strong>, 
              <strong>Toyota</strong>, <strong>Renault</strong>, <strong>Ford</strong>, <strong>Nissan</strong>, <strong>Hyundai</strong>, 
              <strong>Kia</strong>, <strong>Mazda</strong>, <strong>Peugeot</strong> та багатьох інших. Усі <strong>автомобілі Теребовля</strong>, 
              які потрапляють на наш <strong>автомайданчик</strong>, проходять детальний технічний огляд. 
              Це гарантує, що ви купуєте <strong>якісні автомобілі</strong> та <strong>надійні автомобілі</strong>, повністю готові до експлуатації.
            </p>

            <h3>Переваги купівлі вживаного авто з пробігом у Люкс Авто</h3>
            <p>
              Купуючи <strong>вживані авто</strong> або <strong>авто з пробігом</strong> на нашій <strong>автоплощадці</strong>, ви отримуєте ряд переваг:
            </p>
            <ul>
              <li><strong>Чесна історія автомобіля:</strong> Ми відкрито надаємо інформацію про стан кузова, двигуна, ходової частини та реальний пробіг кожного транспортного засобу.</li>
              <li><strong>Вигідні ціни:</strong> Наші прайси є конкурентними на ринку, а гнучкі умови купівлі дозволяють кожному обрати оптимальний варіант.</li>
              <li><strong>Допомога з вибором:</strong> Наші експерти завжди на зв'язку, щоб надати вичерпні консультації та допомогти підібрати ідеальний автомобіль під ваші потреби.</li>
              <li><strong>Підготовка документів:</strong> Ми беремо на себе юридичний супровід та допомагаємо швидко оформити документи в сервісному центрі МВС.</li>
            </ul>

            <h3>Автомобілі для будь-яких життєвих цілей</h3>
            <p>
              Розуміючи, що у кожного водія свої вимоги, ми намагаємось тримати в наявності різноманітний модельний ряд. 
              У нас ви знайдете містке та безпечне <strong>авто для сім'ї</strong>, витривале та економічне <strong>авто для роботи</strong>, 
              маневрене та компактне <strong>авто для міста</strong> з невеликими габаритами, а також комфортне <strong>авто для подорожей</strong> на далекі відстані. 
              Завдяки зручній системі фільтрації на сайті <strong>Lux Auto</strong>, ви можете легко вибрати автомобілі за маркою, моделлю, діапазоном років випуску, коробкою передач, типом пального та вартістю.
            </p>

            <h3>Комплексні послуги: Trade-In, швидкий викуп та перевірка автомобілів</h3>
            <p>
              Окрім безпосереднього продажу, наш <strong>автосалон</strong> пропонує сучасну послугу обміну автомобілів — Trade-In. 
              Ви можете приїхати до нас на своєму транспортному засобі, пройти швидку оцінку та обміняти його на будь-яке інше <strong>авто в хорошому стані</strong> з нашого майданчика, доплативши різницю в будь-яку сторону. 
              Якщо ж вам терміново потрібні кошти, ми пропонуємо терміновий викуп авто за максимально вигідною ціною.
            </p>
            <p>
              Для того щоб почати підбір, перейдіть до нашого <a href="#catalog">каталогу автомобілів</a>, дізнайтеся більше <a href="/about">про нашу компанію</a> або зв'яжіться з нашими фахівцями через розділ <a href="/contacts">контакти</a>. 
              Завітайте до <strong>Люкс Авто Теребовля</strong> особисто — ми допоможемо здійснити вашу мрію про надійне авто!
            </p>
            <div className="seo-fade-overlay"></div>
          </div>
          <div className="seo-btn-wrapper">
            <button id="seo-toggle-btn" className="seo-toggle-btn" type="button">
              Читати повністю
            </button>
          </div>
          <script dangerouslySetInnerHTML={{ __html: `
            document.getElementById('seo-toggle-btn').addEventListener('click', function() {
              var sec = document.getElementById('seo-section');
              sec.classList.toggle('collapsed');
              this.textContent = sec.classList.contains('collapsed') ? 'Читати повністю' : 'Згорнути';
            });
          `}} />
        </section>
      </main>
      <Footer />
    </>
  );
}
