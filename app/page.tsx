import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Catalog } from '@/components/catalog';
import { getCars } from '@/lib/cars';

export const revalidate = 60;
export const dynamic = 'force-dynamic';

export default async function Home() {
  const cars = await getCars();

  return (
    <>
      <Header />
      <main>
        <section className="hero">
          <span className="badge">🚗 Автомобілі в наявності</span>
          <h1>Знайди своє наступне авто</h1>
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
        <Catalog cars={cars} />
      </main>
      <Footer />
    </>
  );
}
