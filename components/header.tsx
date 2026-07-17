'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <div className="header">
      <img src="/images/logo/LuxAutoImg3.png" alt="LuxAuto Logo" />
      <h2 className="header-center">Lux Auto</h2>
      <div>
        {pathname !== '/' && (
          <Link className="head-btn" href="/">
            <span className="d-text">На головну</span>
            <span className="m-text">Головна</span>
          </Link>
        )}
        {pathname !== '/about' && (
          <Link className="head-btn" href="/about">Про нас</Link>
        )}
        {pathname !== '/contacts' && (
          <Link className="head-btn" href="/contacts">
            <span className="d-text">Зв&apos;яжіться з нами</span>
            <span className="m-text">Контакти</span>
          </Link>
        )}
        {!pathname.startsWith('/car/') && !pathname.startsWith('/admin') && (
          <Link
            className="head-btn header-account-link-old"
            href="/admin"
            aria-label="Увійти в адмінку"
            title="Адмінка"
            style={{ marginLeft: '25px', display: 'inline-flex', alignItems: 'center', verticalAlign: 'middle' }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" style={{ width: '20px', height: '20px', fill: 'currentColor' }}>
              <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.31 0-6 1.79-6 4v1h12v-1c0-2.21-2.69-4-6-4Z" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
