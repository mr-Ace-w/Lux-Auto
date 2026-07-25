'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import type { Car } from '@/lib/types';
import { CarCard } from './car-card';

const formatOptionLabel = (text: string) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export function Catalog({ cars }: { cars: Car[] }) {
  // Applied filters states
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [yearFrom, setYearFrom] = useState('');
  const [yearTo, setYearTo] = useState('');
  const [mileageFrom, setMileageFrom] = useState('');
  const [mileageTo, setMileageTo] = useState('');
  const [selectedFuels, setSelectedFuels] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>([]);
  const [sort, setSort] = useState('new');
  const [limit, setLimit] = useState(16);

  // State for Body Type dropdown (replacing Transport Type)
  const [selectedTransportType, setSelectedTransportType] = useState('Всі типи кузова');
  const [tempTransportType, setTempTransportType] = useState('Всі типи кузова');

  // Dropdown open states
  const [transportTypeDropdownOpen, setTransportTypeDropdownOpen] = useState(false);
  const [brandModelDropdownOpen, setBrandModelDropdownOpen] = useState(false);
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);
  const [fuelDropdownOpen, setFuelDropdownOpen] = useState(false);
  const [transmissionDropdownOpen, setTransmissionDropdownOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Temporary/unapplied states for dropdowns
  const [tempBrands, setTempBrands] = useState<string[]>([]);
  const [tempModels, setTempModels] = useState<string[]>([]);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [modelSearchQuery, setModelSearchQuery] = useState('');

  const [tempPriceFrom, setTempPriceFrom] = useState('');
  const [tempPriceTo, setTempPriceTo] = useState('');

  const [tempYearFrom, setTempYearFrom] = useState('');
  const [tempYearTo, setTempYearTo] = useState('');

  const [tempFuels, setTempFuels] = useState<string[]>([]);
  const [tempTransmissions, setTempTransmissions] = useState<string[]>([]);
  const [tempSort, setTempSort] = useState('new');

  // Unique options extracted from available cars
  const brandOptions = useMemo(() => {
    return Array.from(new Set(cars.map((car) => car.brand).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [cars]);

  const modelOptions = useMemo(() => {
    if (tempBrands.length === 0) return [];
    return Array.from(
      new Set(
        cars
          .filter((car) => tempBrands.includes(car.brand))
          .map((car) => car.model)
          .filter(Boolean)
      )
    ).sort((a, b) => a.localeCompare(b));
  }, [cars, tempBrands]);

  const fuelOptions = useMemo(() => {
    return Array.from(new Set(cars.map((car) => car.fuel).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [cars]);

  const transmissionOptions = useMemo(() => {
    return Array.from(new Set(cars.map((car) => car.transmission).filter(Boolean))).sort((a, b) => a.localeCompare(b));
  }, [cars]);

  const years = useMemo(() => {
    const arr = [];
    for (let y = new Date().getFullYear() + 1; y >= 1990; y--) {
      arr.push(y);
    }
    return arr;
  }, []);

  const transportTypeOptions = [
    'Всі типи кузова', 
    'Седан', 
    'Позашляховик / Кросовер', 
    'Хетчбек', 
    'Універсал', 
    'Мінівен', 
    'Купе', 
    'Кабріолет'
  ];
  
  const sortOptions = [
    { value: 'new', label: 'Спочатку нові' },
    { value: 'price-up', label: 'Ціна: дешевші' },
    { value: 'price-down', label: 'Ціна: дорожчі' },
    { value: 'year-up', label: 'Рік: старіші' },
    { value: 'year-down', label: 'Рік: новіші' },
    { value: 'mileage-up', label: 'Пробіг: менший' },
    { value: 'mileage-down', label: 'Пробіг: більший' }
  ];

  // Sync temp state when opening dropdowns
  const openTransportTypeDropdown = () => {
    setTempTransportType(selectedTransportType);
    setTransportTypeDropdownOpen(true);
  };

  const openBrandModelDropdown = () => {
    setTempBrands(selectedBrands);
    setTempModels(selectedModels);
    setBrandSearchQuery('');
    setModelSearchQuery('');
    setBrandModelDropdownOpen(true);
  };

  const openPriceDropdown = () => {
    setTempPriceFrom(priceFrom);
    setTempPriceTo(priceTo);
    setPriceDropdownOpen(true);
  };

  const openYearDropdown = () => {
    setTempYearFrom(yearFrom);
    setTempYearTo(yearTo);
    setYearDropdownOpen(true);
  };

  const openFuelDropdown = () => {
    setTempFuels(selectedFuels);
    setFuelDropdownOpen(true);
  };

  const openTransmissionDropdown = () => {
    setTempTransmissions(selectedTransmissions);
    setTransmissionDropdownOpen(true);
  };

  const openSortDropdown = () => {
    setTempSort(sort);
    setSortDropdownOpen(true);
  };

  // Click outside listener
  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (!target.closest('.transport-type-field')) setTransportTypeDropdownOpen(false);
      if (!target.closest('.brand-model-field')) setBrandModelDropdownOpen(false);
      if (!target.closest('.price-field')) setPriceDropdownOpen(false);
      if (!target.closest('.year-dropdown-field')) setYearDropdownOpen(false);
      if (!target.closest('.fuel-field')) setFuelDropdownOpen(false);
      if (!target.closest('.transmission-field')) setTransmissionDropdownOpen(false);
      if (!target.closest('.sort-field')) setSortDropdownOpen(false);
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Reset limit when filters change
  useEffect(() => {
    setLimit(16);
  }, [selectedBrands, selectedModels, priceFrom, priceTo, yearFrom, yearTo, mileageFrom, mileageTo, selectedFuels, selectedTransmissions, sort]);

  // Card reveal observer
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
      { threshold: 0.1 }
    );
    cards.forEach((card) => cardsObserver.observe(card));
    return () => cardsObserver.disconnect();
  }, [sort, selectedBrands, selectedModels, priceFrom, priceTo, yearFrom, yearTo, mileageFrom, mileageTo, selectedFuels, selectedTransmissions, limit]);

  // Helper toggle functions
  const toggleBrand = (b: string) => {
    setTempBrands(prev => {
      const next = prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b];
      setTempModels(mPrev => mPrev.filter(m => 
        cars.some(car => next.includes(car.brand) && car.model === m)
      ));
      return next;
    });
  };

  const toggleModel = (m: string) => {
    setTempModels(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const toggleFuel = (f: string) => {
    setTempFuels(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const toggleTransmission = (t: string) => {
    setTempTransmissions(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  // Header display labels
  const getBrandModelLabel = () => {
    if (selectedBrands.length === 0) return 'Марка, Модель';
    if (selectedBrands.length === 1) {
      const brandName = selectedBrands[0];
      const brandModels = selectedModels.filter(m => 
        cars.some(car => car.brand === brandName && car.model === m)
      );
      if (brandModels.length === 0) return brandName;
      return `${brandName} (${brandModels.join(', ')})`;
    }
    return `Обрано: ${selectedBrands.length} марок`;
  };

  const getPriceLabel = () => {
    if (!priceFrom && !priceTo) return 'Вартість';
    return `${priceFrom ? `від $${Number(priceFrom).toLocaleString('uk-UA')}` : ''} ${priceTo ? `до $${Number(priceTo).toLocaleString('uk-UA')}` : ''}`.trim();
  };

  const getYearLabel = () => {
    if (!yearFrom && !yearTo) return 'Рік випуску';
    return `${yearFrom ? `від ${yearFrom}` : ''} ${yearTo ? `до ${yearTo}` : ''}`.trim();
  };

  const getFuelLabel = () => {
    if (selectedFuels.length === 0) return 'Пальне';
    return selectedFuels.map(f => formatOptionLabel(f)).join(', ');
  };

  const getTransmissionLabel = () => {
    if (selectedTransmissions.length === 0) return 'Коробка передач';
    return selectedTransmissions.map(t => formatOptionLabel(t)).join(', ');
  };

  const getSortLabel = () => {
    const opt = sortOptions.find(o => o.value === sort);
    return opt ? opt.label : 'Спочатку нові';
  };

  // Filter cars logic
  const filtered = useMemo(() => {
    const minPrice = priceFrom === '' ? null : Number(priceFrom);
    const maxPrice = priceTo === '' ? null : Number(priceTo);
    const minYear = yearFrom === '' ? null : Number(yearFrom);
    const maxYear = yearTo === '' ? null : Number(yearTo);
    const minMileage = mileageFrom === '' ? null : Number(mileageFrom);
    const maxMileage = mileageTo === '' ? null : Number(mileageTo);

    const result = cars.filter((car) => {
      // 1. Brands & Models Multi-select Filter
      if (selectedBrands.length > 0) {
        if (!selectedBrands.includes(car.brand)) return false;
        if (selectedModels.length > 0 && !selectedModels.includes(car.model)) return false;
      }
      // 2. Price Range
      if (minPrice !== null && car.price < minPrice) return false;
      if (maxPrice !== null && car.price > maxPrice) return false;
      // 3. Year Range
      if (minYear !== null && car.year < minYear) return false;
      if (maxYear !== null && car.year > maxYear) return false;
      // 4. Mileage Range
      if (minMileage !== null && car.mileage < minMileage) return false;
      if (maxMileage !== null && car.mileage > maxMileage) return false;
      // 5. Fuel Multi-select
      if (selectedFuels.length > 0) {
        const carFuel = car.fuel.toLowerCase();
        const match = selectedFuels.some(f => f.toLowerCase() === carFuel);
        if (!match) return false;
      }
      // 6. Transmission Multi-select
      if (selectedTransmissions.length > 0) {
        const carTrans = car.transmission.toLowerCase();
        const match = selectedTransmissions.some(t => t.toLowerCase() === carTrans);
        if (!match) return false;
      }
      // 7. Body Type Filter
      if (selectedTransportType !== 'Всі типи кузова') {
        const carBody = car.body_type ? car.body_type.toLowerCase() : '';
        const selectedBody = selectedTransportType.toLowerCase();
        
        let match = false;
        if (selectedBody === 'седан') {
          match = carBody.includes('седан') || carBody.includes('sedan');
        } else if (selectedBody === 'позашляховик / кросовер') {
          match = carBody.includes('кросовер') || carBody.includes('позашляховик') || carBody.includes('suv') || carBody.includes('crossover');
        } else if (selectedBody === 'хетчбек') {
          match = carBody.includes('хетчбек') || carBody.includes('hatchback');
        } else if (selectedBody === 'універсал') {
          match = carBody.includes('універсал') || carBody.includes('wagon') || carBody.includes('avant') || carBody.includes('touring');
        } else if (selectedBody === 'мінівен') {
          match = carBody.includes('мінівен') || carBody.includes('minivan') || carBody.includes('mpv');
        } else if (selectedBody === 'купе') {
          match = carBody.includes('купе') || carBody.includes('coupe');
        } else if (selectedBody === 'кабріолет') {
          match = carBody.includes('кабріолет') || carBody.includes('cabriolet') || carBody.includes('convertible');
        } else {
          match = carBody === selectedBody;
        }
        
        if (!match) return false;
      }
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
  }, [selectedBrands, selectedModels, cars, selectedFuels, selectedTransmissions, mileageFrom, mileageTo, priceFrom, priceTo, sort, yearFrom, yearTo]);

  const displayedCars = useMemo(() => {
    return filtered.slice(0, limit);
  }, [filtered, limit]);

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedModels([]);
    setSelectedFuels([]);
    setSelectedTransmissions([]);
    setSelectedTransportType('Всі типи кузова');
    setPriceFrom('');
    setPriceTo('');
    setYearFrom('');
    setYearTo('');
    setMileageFrom('');
    setMileageTo('');
    setSort('new');
  };

  const filteredBrandsList = brandOptions.filter(b => 
    b.toLowerCase().includes(brandSearchQuery.toLowerCase())
  );

  const filteredModelsList = modelOptions.filter(m => 
    m.toLowerCase().includes(modelSearchQuery.toLowerCase())
  );

  return (
    <>
      <div className="filters">
        <div className="filters-grid">
          
          {/* A. Body Type Dropdown (replacing Transport Type) */}
          <div className="filter-field transport-type-field">
            <label>Тип кузова</label>
            <div className="dropdown-container">
              <button 
                type="button" 
                className={`dropdown-trigger-btn ${selectedTransportType !== 'Всі типи кузова' ? 'active' : ''}`}
                onClick={() => transportTypeDropdownOpen ? setTransportTypeDropdownOpen(false) : openTransportTypeDropdown()}
              >
                <span className="trigger-label">{selectedTransportType}</span>
                <span className="arrow">▼</span>
              </button>

              {transportTypeDropdownOpen && (
                <div className="dropdown-menu transport-type-menu">
                  <div className="options-list">
                    {transportTypeOptions.map(t => (
                      <label key={t} className="option-radio-label">
                        <input 
                          type="radio" 
                          name="transportType"
                          checked={tempTransportType === t} 
                          onChange={() => setTempTransportType(t)}
                        />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button 
                      type="button" 
                      className="apply-btn"
                      onClick={() => {
                        setSelectedTransportType(tempTransportType);
                        setTransportTypeDropdownOpen(false);
                      }}
                    >
                      Застосувати
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 1. Brand & Model Dropdown */}
          <div className="filter-field brand-model-field">
            <label>Марка, Модель</label>
            <div className="dropdown-container">
              <button 
                type="button" 
                className={`dropdown-trigger-btn ${selectedBrands.length > 0 ? 'active' : ''}`}
                onClick={() => brandModelDropdownOpen ? setBrandModelDropdownOpen(false) : openBrandModelDropdown()}
              >
                <span className="trigger-label">{getBrandModelLabel()}</span>
                <span className="arrow">▼</span>
              </button>

              {brandModelDropdownOpen && (
                <div className="dropdown-menu brand-model-menu">
                  <div className="dropdown-columns">
                    {/* Brand column */}
                    <div className="dropdown-column">
                      <div className="column-header">Марка</div>
                      <input 
                        type="text" 
                        className="dropdown-search" 
                        placeholder="Пошук марки"
                        value={brandSearchQuery}
                        onChange={(e) => setBrandSearchQuery(e.target.value)}
                      />
                      <div className="options-list">
                        {filteredBrandsList.map(b => (
                          <label key={b} className="option-checkbox-label">
                            <input 
                              type="checkbox" 
                              checked={tempBrands.includes(b)} 
                              onChange={() => toggleBrand(b)}
                            />
                            <span>{b}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Model column */}
                    <div className="dropdown-column">
                      <div className="column-header">Модель</div>
                      <input 
                        type="text" 
                        className="dropdown-search" 
                        placeholder="Пошук моделі"
                        value={modelSearchQuery}
                        onChange={(e) => setModelSearchQuery(e.target.value)}
                        disabled={tempBrands.length === 0}
                      />
                      <div className="options-list">
                        {tempBrands.length === 0 ? (
                          <div className="empty-message">Оберіть марку спочатку</div>
                        ) : filteredModelsList.length === 0 ? (
                          <div className="empty-message">Немає моделей</div>
                        ) : (
                          filteredModelsList.map(m => (
                            <label key={m} className="option-checkbox-label">
                              <input 
                                type="checkbox" 
                                checked={tempModels.includes(m)} 
                                onChange={() => toggleModel(m)}
                              />
                              <span>{m}</span>
                            </label>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-footer">
                    <button 
                      type="button" 
                      className="apply-btn"
                      onClick={() => {
                        setSelectedBrands(tempBrands);
                        setSelectedModels(tempModels);
                        setBrandModelDropdownOpen(false);
                      }}
                    >
                      Застосувати
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Year Dropdown */}
          <div className="filter-field year-dropdown-field">
            <label>Рік випуску</label>
            <div className="dropdown-container">
              <button 
                type="button" 
                className={`dropdown-trigger-btn ${yearFrom || yearTo ? 'active' : ''}`}
                onClick={() => yearDropdownOpen ? setYearDropdownOpen(false) : openYearDropdown()}
              >
                <span className="trigger-label">{getYearLabel()}</span>
                <span className="arrow">▼</span>
              </button>

              {yearDropdownOpen && (
                <div className="dropdown-menu year-menu">
                  <div className="dropdown-columns">
                    {/* Year From */}
                    <div className="dropdown-column">
                      <div className="column-header">Від</div>
                      <div className="options-list">
                        <label className="option-radio-label">
                          <input 
                            type="radio" 
                            name="tempYearFrom" 
                            checked={tempYearFrom === ''} 
                            onChange={() => setTempYearFrom('')} 
                          />
                          <span>Неважливо</span>
                        </label>
                        {years.map(y => (
                          <label key={`from-${y}`} className="option-radio-label">
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

                    {/* Year To */}
                    <div className="dropdown-column">
                      <div className="column-header">До</div>
                      <div className="options-list">
                        <label className="option-radio-label">
                          <input 
                            type="radio" 
                            name="tempYearTo" 
                            checked={tempYearTo === ''} 
                            onChange={() => setTempYearTo('')} 
                          />
                          <span>Неважливо</span>
                        </label>
                        {years.map(y => (
                          <label key={`to-${y}`} className="option-radio-label">
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

                  <div className="dropdown-footer">
                    <button 
                      type="button" 
                      className="apply-btn"
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

          {/* 3. Price (Вартість) Dropdown */}
          <div className="filter-field price-field">
            <label>Вартість</label>
            <div className="dropdown-container">
              <button 
                type="button" 
                className={`dropdown-trigger-btn ${priceFrom || priceTo ? 'active' : ''}`}
                onClick={() => priceDropdownOpen ? setPriceDropdownOpen(false) : openPriceDropdown()}
              >
                <span className="trigger-label">{getPriceLabel()}</span>
                <span className="arrow">▼</span>
              </button>

              {priceDropdownOpen && (
                <div className="dropdown-menu price-menu">
                  <div className="price-inputs">
                    <input 
                      type="number" 
                      placeholder="Ціна від ($)" 
                      value={tempPriceFrom}
                      onChange={(e) => setTempPriceFrom(e.target.value)}
                    />
                    <input 
                      type="number" 
                      placeholder="Ціна до ($)" 
                      value={tempPriceTo}
                      onChange={(e) => setTempPriceTo(e.target.value)}
                    />
                  </div>
                  <div className="dropdown-footer">
                    <button 
                      type="button" 
                      className="apply-btn"
                      onClick={() => {
                        setPriceFrom(tempPriceFrom);
                        setPriceTo(tempPriceTo);
                        setPriceDropdownOpen(false);
                      }}
                    >
                      Застосувати
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 4. Fuel Dropdown */}
          <div className="filter-field fuel-field">
            <label>Пальне</label>
            <div className="dropdown-container">
              <button 
                type="button" 
                className={`dropdown-trigger-btn ${selectedFuels.length > 0 ? 'active' : ''}`}
                onClick={() => fuelDropdownOpen ? setFuelDropdownOpen(false) : openFuelDropdown()}
              >
                <span className="trigger-label">{getFuelLabel()}</span>
                <span className="arrow">▼</span>
              </button>

              {fuelDropdownOpen && (
                <div className="dropdown-menu fuel-menu">
                  <div className="options-list">
                    {fuelOptions.map(f => (
                      <label key={f} className="option-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={tempFuels.includes(f)} 
                          onChange={() => toggleFuel(f)}
                        />
                        <span>{formatOptionLabel(f)}</span>
                      </label>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button 
                      type="button" 
                      className="apply-btn"
                      onClick={() => {
                        setSelectedFuels(tempFuels);
                        setFuelDropdownOpen(false);
                      }}
                    >
                      Застосувати
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 5. Transmission Dropdown */}
          <div className="filter-field transmission-field">
            <label>Коробка передач</label>
            <div className="dropdown-container">
              <button 
                type="button" 
                className={`dropdown-trigger-btn ${selectedTransmissions.length > 0 ? 'active' : ''}`}
                onClick={() => transmissionDropdownOpen ? setTransmissionDropdownOpen(false) : openTransmissionDropdown()}
              >
                <span className="trigger-label">{getTransmissionLabel()}</span>
                <span className="arrow">▼</span>
              </button>

              {transmissionDropdownOpen && (
                <div className="dropdown-menu transmission-menu">
                  <div className="options-list">
                    {transmissionOptions.map(t => (
                      <label key={t} className="option-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={tempTransmissions.includes(t)} 
                          onChange={() => toggleTransmission(t)}
                        />
                        <span>{formatOptionLabel(t)}</span>
                      </label>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button 
                      type="button" 
                      className="apply-btn"
                      onClick={() => {
                        setSelectedTransmissions(tempTransmissions);
                        setTransmissionDropdownOpen(false);
                      }}
                    >
                      Застосувати
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sort Selection Dropdown */}
          <div className="filter-field sort-field">
            <label>Сортування</label>
            <div className="dropdown-container">
              <button 
                type="button" 
                className="dropdown-trigger-btn active"
                onClick={() => sortDropdownOpen ? setSortDropdownOpen(false) : openSortDropdown()}
              >
                <span className="trigger-label">{getSortLabel()}</span>
                <span className="arrow">▼</span>
              </button>

              {sortDropdownOpen && (
                <div className="dropdown-menu sort-menu">
                  <div className="options-list">
                    {sortOptions.map(opt => (
                      <label key={opt.value} className="option-radio-label">
                        <input 
                          type="radio" 
                          name="sortOption"
                          checked={tempSort === opt.value} 
                          onChange={() => setTempSort(opt.value)}
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="dropdown-footer">
                    <button 
                      type="button" 
                      className="apply-btn"
                      onClick={() => {
                        setSort(tempSort);
                        setSortDropdownOpen(false);
                      }}
                    >
                      Застосувати
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions (Reset) */}
          <div className="filter-field action-field">
            <label style={{ visibility: 'hidden' }}>Дія</label>
            <button className="reset-btn" type="button" onClick={resetFilters}>
              Скинути фільтри
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
