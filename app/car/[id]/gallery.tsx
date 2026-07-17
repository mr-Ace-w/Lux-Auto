'use client';

import { useEffect, useState } from 'react';

type GalleryProps = {
  images: string[];
  name: string;
};

export function Gallery({ images, name }: GalleryProps) {
  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="gallery">
        <div className="image-empty">
          Фото відсутні
        </div>
      </div>
    );
  }

  function change(step: number) {
    setCurrent((prev) => {
      let next = prev + step;

      if (next < 0) next = images.length - 1;
      if (next >= images.length) next = 0;

      return next;
    });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!lightbox) return;

      if (e.key === 'Escape') setLightbox(false);

      if (e.key === 'ArrowRight') change(1);

      if (e.key === 'ArrowLeft') change(-1);
    }

    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  useEffect(() => {
    let start = 0;

    const image = document.getElementById('mainImage');

    if (!image) return;

    const touchStart = (e: TouchEvent) => {
      start = e.touches[0].clientX;
    };

    const touchEnd = (e: TouchEvent) => {
      const end = e.changedTouches[0].clientX;

      if (start - end > 50) change(1);

      if (end - start > 50) change(-1);
    };

    image.addEventListener('touchstart', touchStart);

    image.addEventListener('touchend', touchEnd);

    return () => {
      image.removeEventListener('touchstart', touchStart);
      image.removeEventListener('touchend', touchEnd);
    };
  }, []);

  useEffect(() => {
    const topEl = document.querySelector('.top');
    if (!topEl) return;

    const topObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            topObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.25,
      }
    );

    topObserver.observe(topEl);

    return () => {
      topObserver.disconnect();
    };
  }, []);

  const [isVertical, setIsVertical] = useState(false);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setIsVertical(img.naturalHeight > img.naturalWidth);
  };

  return (
    <>
      <div className="gallery">

        <button className="prev" onClick={() => change(-1)}>
          ❮
        </button>

        <img
          id="mainImage"
          src={images[current]}
          alt={name}
          onLoad={handleImageLoad}
          className={isVertical ? 'img-contain' : 'img-cover'}
          onClick={() => setLightbox(true)}
        />

        <button className="next" onClick={() => change(1)}>
          ❯
        </button>

      </div>

      <div className="thumbs">

        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`${name} ${i + 1}`}
            className={i === current ? 'active-thumb' : ''}
            onClick={() => setCurrent(i)}
          />
        ))}

      </div>

      {lightbox && (

        <div
          className="lightbox show"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightbox(false);
          }}
        >

          <span
            className="close"
            onClick={() => setLightbox(false)}
          >
            ×
          </span>

          <button
            className="light-prev"
            onClick={() => change(-1)}
          >
            ❮
          </button>

          <img
            src={images[current]}
            alt={name}
          />

          <button
            className="light-next"
            onClick={() => change(1)}
          >
            ❯
          </button>

        </div>

      )}
    </>
  );
}