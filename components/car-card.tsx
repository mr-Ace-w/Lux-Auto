import Link from 'next/link';
import type {Car} from '@/lib/types';

export function CarCard({ car }: { car: Car }) {
  const image = car.images[0]?.url;
  const badges = [] as string[];
  if (car.is_top) badges.push('ТОП');
  if (car.is_sold) badges.push('Продано');
  if (car.is_recommended) badges.push('Рекомендоване');

  return (
    <article className="car-card">
      {image && (
        <Link href={`/car/${car.id}`}>
          <div className="card-glow" />
          {badges.length > 0 && (
            <div className="card-badges">
              {badges.map((badge) => {
                const cls = badge === 'ТОП' ? 'badge-top' : badge === 'Продано' ? 'sold' : 'rec';
                return (
                  <span key={badge} className={`card-badge ${cls}`}>
                    {badge}
                  </span>
                );
              })}
            </div>
          )}
          <img className="car-image" src={image} alt={`${car.brand} ${car.model}`} />
        </Link>
      )}
      <div className="car-info">
        <div className="car-title">
          <h3>
            {car.brand} {car.model}
          </h3>
          <span className="car-year">{car.year}</span>
        </div>
        <div className="specs">
          <p>
            <img className="spec-icon" src="/images/icons/speedometer.png" alt="" aria-hidden="true" />
            {car.mileage.toLocaleString('uk-UA')} км
          </p>
          <p>
            <img className="spec-icon" src="/images/icons/gasStation.png" alt="" aria-hidden="true" />
            {car.fuel}
          </p>
          <p>
            <img className="spec-icon" src="/images/icons/engine.png" alt="" aria-hidden="true" />
            {car.engine}
          </p>
          <p>
            <img className="spec-icon" src="/images/icons/gearbox.png" alt="" aria-hidden="true" />
            {car.transmission}
          </p>
        </div>
        <div className="price">$ {car.price.toLocaleString('uk-UA')}</div>
        <div className="card-actions">
          <Link className="button" href={`/car/${car.id}`}>
            Деталі
          </Link>
          <a className="call-button" href="tel:+380968264242" aria-label="Зателефонувати">
            <img className="phone-icon-white" src="/images/icons/phone1.png" alt="Зателефонувати" />
            <img className="phone-icon-black" src="/images/icons/phone.png" alt="Зателефонувати" />
          </a>
        </div>
      </div>
    </article>
  );
}
