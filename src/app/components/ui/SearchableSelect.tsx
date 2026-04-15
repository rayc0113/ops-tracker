import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  error?: boolean;
}

export default function SearchableSelect({ options, value, onChange, placeholder = '請選擇', searchable = true, error = false }: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value);

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => { setOpen(o => !o); setSearch(''); }}
        className={`w-full px-3 py-2 bg-[#EFF0F8] rounded-[10px] text-sm text-left flex items-center justify-between focus:outline-none focus:bg-white focus:border focus:border-black ${error ? 'ring-1 ring-red-500' : ''}`}
      >
        <span className={`truncate ${selected ? 'text-[#2D336B]' : 'text-[#8F9BC8]'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown size={14} className="text-[#8F9BC8] flex-shrink-0 ml-1" />
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
          {searchable && (
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8F9BC8]" />
                <input
                  autoFocus
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="搜尋..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-[#EFF0F8] rounded-lg text-[#2D336B] placeholder:text-[#8F9BC8] focus:outline-none"
                />
              </div>
            </div>
          )}
          <div className="overflow-y-auto max-h-[256px]">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-sm text-[#8F9BC8] text-center">無符合結果</div>
            ) : (
              filtered.map(o => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => { onChange(o.value); setOpen(false); setSearch(''); }}
                  className={`w-full px-3 py-2.5 text-sm text-left hover:bg-[#EFF0F8] transition-colors ${
                    o.value === value ? 'text-blue-600 bg-[#EFF0F8]' : 'text-[#2D336B]'
                  }`}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
