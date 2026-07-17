'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import type { Car } from '@/lib/types';
import { CarCard } from './car-card';

export function Catalog({ cars }: { cars: Car[] }) {
  const [brand, setBrand] = useState('');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [mileageFrom, setMileageFrom] = useState('');
  const [mileageTo, setMileageTo] = useState('');
  const [fuel, setFuel] = useState('');
  const [sort, setSort] = useState('new');
  const [limit, setLimit] = useState(16);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [tempYearFrom, setTempYearFrom] = useState('');
  const [tempYearTo, setTempYearTo] = useState('');

  const years = useMemo(() => {
    const arr = [];
    for (let y = 2026; y >= 1990; y--) {
      arr.push(y);
    }
    return arr;
  }, []);

  useEffect(() => {
    if (!yearDropdownOpen) return;
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.year-dropdown-container')) {
        setYearDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [yearDropdownOpen]);

  const toggleYearDropdown = () => {
    if (!yearDropdownOpen) {
      setTempYearFrom(yearFrom);
      setTempYearTo(yearTo);
    }
    setYearDropdownOpen(!yearDropdownOpen);
  };

  useEffect(() => {
    setLimit(16);
  }, [brand, priceFrom, priceTo, yearFrom, yearTo, mileageFrom, mileageTo, fuel, sort]);


  useEffect(() => {
    const cards = document.querySelectorAll('.car-card');
    const cardsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardEl = entry.target as HTMLElement;
            const parent = cardEl.parentElement;
            if (parent) {
              const index = Array.from(parent.children).indexOf(cardEl);
              cardEl.style.transitionDelay = `${(index % 4) * 0.06}s`;
            }
            cardEl.classList.add('show');
            cardsObserver.unobserve(cardEl);
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    cards.forEach((card) => {
      cardsObserver.observe(card);
    });

    return () => {
      cardsObserver.disconnect();
    };
  }, [sort, brand, priceFrom, priceTo, yearFrom, yearTo, mileageFrom, mileageTo, fuel, limit]);

  const fuelOptions = useMemo(() => {
    return Array.from(new Set(cars.map((car) => car.fuel).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [cars]);

  const filtered = useMemo(() => {
    const term = brand.trim().toLowerCase();
    const minPrice = priceFrom === '' ? null : Number(priceFrom);
    const maxPrice = priceTo === '' ? null : Number(priceTo);
    const minYear = yearFrom === '' ? null : Number(yearFrom);
    const maxYear = yearTo === '' ? null : Number(yearTo);
    const minMileage = mileageFrom === '' ? null : Number(mileageFrom);
    const maxMileage = mileageTo === '' ? null : Number(mileageTo);

    const result = cars.filter((car) => {
      const haystack = `${car.brand} ${car.model}`.toLowerCase();
      if (term && !haystack.includes(term)) return false;
      if (minPrice !== null && car.price < minPrice) return false;
      if (maxPrice !== null && car.price > maxPrice) return false;
      if (minYear !== null && car.year < minYear) return false;
      if (maxYear !== null && car.year > maxYear) return false;
      if (minMileage !== null && car.mileage < minMileage) return false;
      if (maxMileage !== null && car.mileage > maxMileage) return false;
      if (fuel && car.fuel.toLowerCase() !== fuel.toLowerCase()) return false;
      return true;
    });

    return result.sort((a, b) => {
      switch (sort) {
        case 'price-up':
          return a.price - b.price;
        case 'price-down':
          return b.price - a.price;
        case 'year-up':
          return a.year - b.year;
        case 'year-down':
          return b.year - a.year;
        case 'mileage-up':
          return a.mileage - b.mileage;
        case 'mileage-down':
          return b.mileage - a.mileage;
        default:
          if (a.is_top !== b.is_top) {
            return (b.is_top ? 1 : 0) - (a.is_top ? 1 : 0);
          }
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });
  }, [brand, cars, fuel, mileageFrom, mileageTo, priceFrom, priceTo, sort, yearFrom, yearTo]);

  const displayedCars = useMemo(() => {
    return filtered.slice(0, limit);
  }, [filtered, limit]);

  const resetFilters = () => {
    setBrand('');
    setPriceFrom('');
    setPriceTo('');
    setYearFrom('');
    setYearTo('');
    setTempYearFrom('');
    setTempYearTo('');
    setMileageFrom('');
    setMileageTo('');
    setFuel('');
    setSort('new');
  };

  return (
    <>
      <div className="filters">
        <div className="filters-row">
          <div className="filter-field">
            <label>Марка</label>
            <Autocomplete value={brand} onChange={setBrand} options={['Audi', 'BMW', 'Mercedes-Benz', 'Tesla', 'Honda', 'Jeep', 'Land Rover', 'Toyota', 'Volkswagen', 'Ford', 'Hyundai', 'Kia', 'Nissan', 'Skoda', 'Renault', 'Lexus', 'Porsche', 'Mazda', 'Volvo', 'Opel', 'Chevrolet', 'Mitsubishi', 'Dodge', 'Aston Martin']} placeholder="BMW, Audi, VW" />
          </div>
          <div className="filter-field">
            <label>Ціна від</label>
            <input type="number" value={priceFrom} onChange={(e) => setPriceFrom(e.target.value)} placeholder="5000" />
          </div>
          <div className="filter-field">
            <label>Ціна до</label>
            <input type="number" value={priceTo} onChange={(e) => setPriceTo(e.target.value)} placeholder="20000" />
          </div>
          
          <div className="filter-field year-dropdown-field">
            <label>Рік випуску</label>
            <div className="year-dropdown-container">
              <button 
                type="button" 
                className="year-dropdown-trigger-btn"
                onClick={toggleYearDropdown}
              >
                {yearFrom || yearTo ? (
                  `${yearFrom ? `від ${yearFrom}` : ''} ${yearTo ? `до ${yearTo}` : ''}`
                ) : (
                  'Рік випуску'
                )}
                <span className={`arrow ${yearDropdownOpen ? 'open' : ''}`}>▼</span>
              </button>

              {yearDropdownOpen && (
                <div className="year-dropdown-menu">
                  <div className="year-dropdown-columns">
                    <div className="year-column">
                      <div className="column-header">Від</div>
                      <div className="year-options-list">
                        <label className="year-option">
                          <input 
                            type="radio" 
                            name="tempYearFrom" 
                            checked={tempYearFrom === ''} 
                            onChange={() => setTempYearFrom('')} 
                          />
                          <span>Неважливо</span>
                        </label>
                        {years.map(y => (
                          <label key={`from-${y}`} className="year-option">
                            <input 
                              type="radio" 
                              name="tempYearFrom" 
                              value={y}
                              checked={tempYearFrom === String(y)} 
                              onChange={(e) => setTempYearFrom(e.target.value)} 
                            />
                            <span>{y}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="year-column">
                      <div className="column-header">До</div>
                      <div className="year-options-list">
                        <label className="year-option">
                          <input 
                            type="radio" 
                            name="tempYearTo" 
                            checked={tempYearTo === ''} 
                            onChange={() => setTempYearTo('')} 
                          />
                          <span>Неважливо</span>
                        </label>
                        {years.map(y => (
                          <label key={`to-${y}`} className="year-option">
                            <input 
                              type="radio" 
                              name="tempYearTo" 
                              value={y}
                              checked={tempYearTo === String(y)} 
                              onChange={(e) => setTempYearTo(e.target.value)} 
                            />
                            <span>{y}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="year-dropdown-footer">
                    <button 
                      type="button" 
                      className="year-apply-btn"
                      onClick={() => {
                        setYearFrom(tempYearFrom);
                        setYearTo(tempYearTo);
                        setYearDropdownOpen(false);
                      }}
                    >
                      Застосувати
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-field">
            <label>Пробіг від</label>
            <input type="number" value={mileageFrom} onChange={(e) => setMileageFrom(e.target.value)} placeholder="10000" />
          </div>
          <div className="filter-field">
            <label>Пробіг до</label>
            <input type="number" value={mileageTo} onChange={(e) => setMileageTo(e.target.value)} placeholder="200000" />
          </div>
          <div className="filter-field">
            <label>Паливо</label>
            <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
              <option value="">Усі</option>
              {fuelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-field">
            <label>Сортування</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="new">Спочатку нові</option>
              <option value="price-up">Ціна: дешевші</option>
              <option value="price-down">Ціна: дорожчі</option>
              <option value="year-up">Рік: старіші</option>
              <option value="year-down">Рік: новіші</option>
              <option value="mileage-up">Пробіг: менший</option>
              <option value="mileage-down">Пробіг: більший</option>
            </select>
          </div>
          <div className="filter-actions">
            <button className="reset-btn" type="button" onClick={resetFilters}>
              Скинути
            </button>
          </div>
        </div>
      </div>

      <p className="car-count">
        В наявності <b>{filtered.length}</b> авто
      </p>
      <div className="catalog">
        {displayedCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>

      {filtered.length > limit && (
        <div className="load-more-wrapper">
          <button 
            type="button" 
            className="load-more-btn"
            onClick={() => setLimit((prev) => prev + 16)}
          >
            Показати більше
          </button>
        </div>
      )}

    </>
  );
}

type AutocompleteProps = {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
};

function Autocomplete({ value, onChange, options, placeholder }: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filtered = options.filter(opt =>
    opt.toLowerCase().includes(value.toLowerCase())
  );

  return (
    <div className="autocomplete-container" ref={containerRef}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <ul className="autocomplete-dropdown">
          {filtered.map((opt) => (
            <li
              key={opt}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

