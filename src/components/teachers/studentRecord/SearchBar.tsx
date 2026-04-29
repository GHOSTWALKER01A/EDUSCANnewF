
'use client'
import React, { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

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
    <div className={clsx("relative flex items-center w-full max-w-sm", className)}>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
         <Search className="w-5 h-5 text-[var(--text-secondary)] opacity-70" strokeWidth={1.5} />
      </div>
      
      <label htmlFor="search-input" className="sr-only">{ariaLabel}</label>
      <input
        id="search-input"
        type="search"
        value={inner}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-[var(--border-color)]/30 bg-[var(--bg-secondary)]/50 text-[var(--text-primary)] outline-none focus:bg-[var(--bg-primary)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all placeholder-[var(--text-secondary)] placeholder-opacity-60"
      />
      
      {showClear && inner && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors focus:outline-none"
        >
          <X className="w-4 h-4" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
