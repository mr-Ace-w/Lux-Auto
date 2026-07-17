import {notFound} from 'next/navigation';
import {Header} from '@/components/header';
import {Footer} from '@/components/footer';
import {getCar} from '@/lib/cars';
import {Gallery} from './gallery';
import {ViewCounter} from './view-counter';
import type {Metadata} from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const car = await getCar((await params).id);
  if (!car || car.is_hidden) return { title: 'Авто не знайдено' };
  return {
    title: `${car.brand} ${car.model} ${car.year}`,
    description: car.short_description || `Продаж ${car.brand} ${car.model} ${car.year} року в Теребовлі на Lux Auto.`,
    openGraph: {
      title: `${car.brand} ${car.model} ${car.year}`,
      description: car.short_description || `Продаж ${car.brand} ${car.model} ${car.year} року в Теребовлі на Lux Auto.`,
      images: car.images[0] ? [car.images[0].url] : [],
    }
  };
}

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const car = await getCar((await params).id);
  if (!car || car.is_hidden) return notFound();

  const statusLabel = car.is_sold ? 'Продано' : car.is_top ? 'ТОП авто' : 'В наявності';
  const details = Object.entries(car.details || {});

  return (
    <>
      <Header />
      <main className="car-page">
        <ViewCounter id={car.id} />
        <div className="container">
          <div className="top">
            <div>
              <Gallery images={car.images.map((img) => img.url)} name={`${car.brand} ${car.model}`} />
            </div>
            <div>
              <div className="status" style={{ marginBottom: '10px' }}>{statusLabel}</div>
              <h1>
                {car.brand} {car.model} {car.year}
              </h1>
              <div className="price">$ {car.price.toLocaleString('uk-UA')}</div>
              <div className="short-about">
                <p>{car.short_description || 'Надійний сімейний кросовер у відмінному стані. Автомобіль обслужений, вкладень не потребує.'}</p>
              </div>

              <div className="section-specs">
                <h2>Характеристики</h2>
                <div className="specs">
                  <div className="spec">
                    <b>Пробіг:</b>
                    <br />
                    {car.mileage >= 1000 ? `${Math.round(car.mileage / 1000)} тис. км` : `${car.mileage} км`}
                  </div>
                  <div className="spec">
                    <b>Паливо:</b>
                    <br />
                    {car.fuel}
                  </div>
                  <div className="spec">
                    <b>Двигун:</b>
                    <br />
                    {car.engine}
                  </div>
                  <div className="spec">
                    <b>Коробка:</b>
                    <br />
                    {car.transmission}
                  </div>
                  <div className="spec">
                    <b>Привід:</b>
                    <br />
                    {car.drive ?? '—'}
                  </div>
                  <div className="spec">
                    <b>Кузов:</b>
                    <br />
                    {car.body_type ?? '—'}
                  </div>
                </div>
              </div>

              <a className="btn" href="/contacts">
                Зв&apos;язатися з нами
              </a>
            </div>
          </div>

          {car.description && (
            <div className="section">
              <h2>Опис автомобіля</h2>
              <p style={{ whiteSpace: 'pre-line' }}>{car.description}</p>
            </div>
          )}

          {details.length > 0 && (
            <div className="section-specs">
              <h2>Детальніше про характеристики</h2>
              <div className="specs">
                {details.map(([key, value]) => {
                  const isUrl = value.startsWith('http://') || value.startsWith('https://');
                  return (
                    <div className="spec" key={key}>
                      <b>{key}:</b>
                      <br />
                      {isUrl ? (
                        <a className="btn2" href={value} target="_blank" rel="noopener noreferrer">
                          Дивитись деталі
                        </a>
                      ) : (
                        value
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {car.features.length > 0 && (
            <div className="section">
              <h2>Комплектація</h2>
              <div className="features">
                {car.features.map((feature) => (
                  <div className="feature" key={feature}>
                    ✓ {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

