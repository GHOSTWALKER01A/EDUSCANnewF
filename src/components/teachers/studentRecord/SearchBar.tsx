
'use client'
import React, { useEffect, useRef, useState } from 'react';

type SearchBarProps = {
  value?: string;
  onChange?: (val: string) => void;
  onSearch?: (val: string) => void; 
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  ariaLabel?: string;
  showClear?: boolean;
};

export default function SearchBar({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  debounceMs = 350,
  className = '',
  ariaLabel = 'Search',
  showClear = true,
}: SearchBarProps) {
  const [inner, setInner] = useState<string>(value);
  const timer = useRef<number | null>(null);

 
  useEffect(() => setInner(value), [value]);

  // debounce effect
  useEffect(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => {
      if (onSearch) onSearch(inner);
    }, debounceMs);

    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, [inner, debounceMs, onSearch]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setInner(v);
    if (onChange) onChange(v);
  }

  function handleClear() {
    setInner('');
    if (onChange) onChange('');
    if (onSearch) onSearch('');
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="search-input" className="sr-only">{ariaLabel}</label>
      <input
        id="search-input"
        type="search"
        value={inner}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="px-3 py-2 rounded-md bg-[var(--bg-primary)] text-[var(--text-primary)] 
        outline-none focus:ring-2 focus:ring-[var(--accent)] w-full"
      />
      {/* {showClear && inner && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="px-3 py-2 rounded-md bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:opacity-90"
        >
          Clear
        </button>
      )} */}
    </div>
  );
}
