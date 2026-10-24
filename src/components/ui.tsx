import React from 'react';
import { BellIcon, BuildingIcon, ClockIcon, GlobeIcon, HybridIcon, SearchIcon } from './Icons';

// ─── GEC Crest SVG ────────────────────────────────────────────────────────────
export function GECCrest({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="GEC Thrissur Crest">
      <polygon points="24,2 46,44 2,44" fill="#800020" stroke="#fff" strokeWidth="1.5"/>
      <polygon points="24,8 41,42 7,42" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.75"/>
      <circle cx="24" cy="28" r="9" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1"/>
      <text x="24" y="32" textAnchor="middle" fontSize="6" fill="white" fontFamily="serif" fontWeight="bold">GEC</text>
      <text x="24" y="47" textAnchor="middle" fontSize="3.2" fill="#800020" fontFamily="serif" letterSpacing="-0.2">
        योगः कर्मसु कौशलम्
      </text>
    </svg>
  );
}

export function GECCrestOnDark({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="GEC Thrissur Crest">
      <polygon points="24,2 46,44 2,44" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"/>
      <polygon points="24,8 41,42 7,42" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75"/>
      <circle cx="24" cy="28" r="9" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
      <text x="24" y="32" textAnchor="middle" fontSize="6" fill="white" fontFamily="serif" fontWeight="bold">GEC</text>
    </svg>
  );
}

// ─── Avatar ────────────────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  '#800020', '#1D4ED8', '#059669', '#7C3AED', '#D97706', '#0891B2'
];
function colorForName(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name: string) {
  return name.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
}

export function Avatar({ name, size = 40, ring = false }: { name: string; size?: number; ring?: boolean }) {
  const bg = colorForName(name);
  const fontSize = size < 36 ? size * 0.38 : size * 0.33;
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        backgroundColor: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontWeight: 700, fontSize,
        flexShrink: 0,
        outline: ring ? '3px solid white' : undefined,
        outlineOffset: ring ? '1px' : undefined,
      }}
      aria-label={name}
    >
      {initials(name)}
    </div>
  );
}

// ─── Badges ────────────────────────────────────────────────────────────────────
export function SkillBadge({ label, matched = false }: { label: string; matched?: boolean }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center',
        height: 28, padding: '0 12px', borderRadius: 6,
        fontSize: 13, lineHeight: 1,
        fontWeight: matched ? 700 : 500,
        border: matched ? '1.5px solid #16A34A' : '1px solid #CBD5E1',
        background: matched ? '#F0FDF4' : '#F1F5F9',
        color: matched ? '#16A34A' : '#475569',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

export function DomainTag({ label }: { label: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 28, padding: '0 12px', borderRadius: 6,
      fontSize: 13, fontWeight: 600,
      background: '#FBEFF2', color: '#800020',
      border: '1px solid #F3D6DD',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

export function ModeBadge({ mode }: { mode: string }) {
  const config: Record<string, { icon: React.ComponentType<{ size?: number }>; color: string; bg: string; border: string }> = {
    Online:  { icon: GlobeIcon, color: '#1D4ED8', bg: '#EFF6FF', border: '#BFDBFE' },
    Offline: { icon: BuildingIcon, color: '#374151', bg: '#F9FAFB', border: '#E5E7EB' },
    Hybrid:  { icon: HybridIcon, color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  };
  const c = config[mode] || config.Hybrid;
  const ModeIcon = c.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 28, padding: '0 10px', borderRadius: 6,
      fontSize: 13, fontWeight: 500,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      <ModeIcon size={13} /> {mode}
    </span>
  );
}

export function ExperienceBadge({ level }: { level: string }) {
  const config: Record<string, { color: string; bg: string; border: string }> = {
    Beginner:     { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
    Intermediate: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
    Expert:       { color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  };
  const c = config[level] || config.Beginner;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      height: 28, padding: '0 10px', borderRadius: 6,
      fontSize: 13, fontWeight: 600,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
      whiteSpace: 'nowrap',
    }}>
      {level}
    </span>
  );
}

export function HoursBadge({ hours }: { hours: number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 28, padding: '0 10px', borderRadius: 6,
      fontSize: 13, fontWeight: 500,
      background: '#F1F5F9', color: '#475569', border: '1px solid #CBD5E1',
      whiteSpace: 'nowrap',
    }}>
      <ClockIcon size={13} /> {hours} hrs/week
    </span>
  );
}

export function ReciprocalBadge() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: 24, padding: '0 10px', borderRadius: 6,
      fontSize: 11, fontWeight: 600,
      background: '#FBEFF2', color: '#800020', border: '1.5px solid #A30000',
      whiteSpace: 'nowrap',
    }}>
      ⇄ Reciprocal Trade
    </span>
  );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({
  filled, total, label, urgent = false
}: { filled: number; total: number; label?: string; urgent?: boolean }) {
  const pct = Math.min(100, (filled / total) * 100);
  const isUrgent = urgent || (total - filled === 1);
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: '#475569', fontWeight: 500 }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: isUrgent ? '#D97706' : '#1E293B' }}>
            {filled}/{total}
          </span>
        </div>
      )}
      <div style={{
        height: 8, borderRadius: 999, background: '#E2E8F0', overflow: 'hidden'
      }}>
        <div style={{
          height: '100%', borderRadius: 999, width: `${pct}%`,
          background: isUrgent ? '#D97706' : '#800020',
          transition: 'width 400ms ease',
        }} />
      </div>
    </div>
  );
}

// ─── Buttons ───────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'on-brand';
type BtnSize = 'sm' | 'md' | 'lg';

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  icon?: React.ReactNode;
  loading?: boolean;
}

export function Button({
  variant = 'primary', size = 'md', icon, loading, children, style, ...rest
}: BtnProps) {
  const heights: Record<BtnSize, number> = { sm: 36, md: 44, lg: 52 };
  const pads: Record<BtnSize, string> = { sm: '0 14px', md: '0 20px', lg: '0 24px' };
  const fontSizes: Record<BtnSize, number> = { sm: 13, md: 15, lg: 16 };

  const variantStyles: Record<BtnVariant, React.CSSProperties> = {
    primary: {
      background: '#800020', color: '#fff', border: 'none',
    },
    secondary: {
      background: '#fff', color: '#800020', border: '1px solid #800020',
    },
    ghost: {
      background: 'transparent', color: '#1E293B', border: 'none',
    },
    'on-brand': {
      background: '#fff', color: '#800020', border: 'none',
    },
  };

  return (
    <button
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        height: heights[size], padding: pads[size],
        borderRadius: 10, cursor: 'pointer',
        fontSize: fontSizes[size], fontWeight: 600,
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'background 150ms, opacity 150ms, transform 100ms',
        outline: 'none',
        whiteSpace: 'nowrap',
        ...variantStyles[variant],
        ...(rest.disabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}),
        ...style,
      }}
      onMouseEnter={e => {
        if (!rest.disabled) {
          if (variant === 'primary') (e.currentTarget as HTMLButtonElement).style.background = '#A30000';
          if (variant === 'secondary') (e.currentTarget as HTMLButtonElement).style.background = '#FBEFF2';
        }
      }}
      onMouseLeave={e => {
        if (!rest.disabled) {
          if (variant === 'primary') (e.currentTarget as HTMLButtonElement).style.background = '#800020';
          if (variant === 'secondary') (e.currentTarget as HTMLButtonElement).style.background = '#fff';
        }
      }}
      {...rest}
    >
      {loading ? <span style={{ fontSize: 13, fontWeight: 600 }}>…</span> : icon}
      {children}
    </button>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────────
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  helper?: string;
  error?: string;
  prefix?: React.ReactNode;
}
export function Input({ label, helper, error, prefix, style, ...rest }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{label}</label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{
            position: 'absolute', left: 12, color: '#64748B', display: 'flex', alignItems: 'center'
          }}>{prefix}</span>
        )}
        <input
          style={{
            width: '100%', height: 44, borderRadius: 6, border: `1px solid ${error ? '#DC2626' : '#E2E8F0'}`,
            padding: prefix ? '0 12px 0 36px' : '0 12px',
            fontSize: 15, color: '#1E293B', background: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif',
            outline: 'none', transition: 'border 150ms',
            ...style,
          }}
          onFocus={e => { e.currentTarget.style.border = '2px solid #800020'; }}
          onBlur={e => { e.currentTarget.style.border = `1px solid ${error ? '#DC2626' : '#E2E8F0'}`; }}
          {...rest}
        />
      </div>
      {helper && !error && <span style={{ fontSize: 12, color: '#64748B' }}>{helper}</span>}
      {error && <span style={{ fontSize: 12, color: '#DC2626' }}>{error}</span>}
    </div>
  );
}

// ─── Textarea ──────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  maxChars?: number;
  currentLength?: number;
}
export function Textarea({ label, helper, maxChars, currentLength, style, ...rest }: TextareaProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{label}</label>}
      <textarea
        style={{
          width: '100%', borderRadius: 6, border: '1px solid #E2E8F0',
          padding: '10px 12px', fontSize: 15, color: '#1E293B',
          background: '#fff', fontFamily: 'Inter, system-ui, sans-serif',
          outline: 'none', resize: 'vertical', minHeight: 100,
          transition: 'border 150ms',
          ...style,
        }}
        onFocus={e => { e.currentTarget.style.border = '2px solid #800020'; }}
        onBlur={e => { e.currentTarget.style.border = '1px solid #E2E8F0'; }}
        {...rest}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {helper && <span style={{ fontSize: 12, color: '#64748B' }}>{helper}</span>}
        {maxChars && (
          <span style={{ fontSize: 12, color: '#64748B', marginLeft: 'auto' }}>
            {currentLength ?? 0}/{maxChars}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Select ────────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}
export function Select({ label, options, style, ...rest }: SelectProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{label}</label>}
      <select
        style={{
          width: '100%', height: 44, borderRadius: 6, border: '1px solid #E2E8F0',
          padding: '0 12px', fontSize: 15, color: '#1E293B', background: '#fff',
          fontFamily: 'Inter, system-ui, sans-serif', outline: 'none', cursor: 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: 36,
          ...style,
        }}
        {...rest}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ─── SearchBar ─────────────────────────────────────────────────────────────────
interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}
export function SearchBar({ value, onChange, placeholder = 'Search…', style }: SearchBarProps) {
  return (
    <div style={{ position: 'relative', flex: 1, ...style }}>
      <span style={{
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
        color: '#64748B', pointerEvents: 'none', display: 'flex',
      }}><SearchIcon size={17} /></span>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', height: 48, borderRadius: 10, border: '1px solid #E2E8F0',
          paddingLeft: 42, paddingRight: 16,
          fontSize: 15, color: '#1E293B', background: '#fff',
          fontFamily: 'Inter, system-ui, sans-serif', outline: 'none',
          transition: 'border 150ms', boxShadow: '0 1px 3px rgba(15,23,42,.06)',
        }}
        onFocus={e => { e.currentTarget.style.border = '2px solid #800020'; }}
        onBlur={e => { e.currentTarget.style.border = '1px solid #E2E8F0'; }}
      />
    </div>
  );
}

// ─── Checkbox ──────────────────────────────────────────────────────────────────
interface CheckboxProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}
export function Checkbox({ checked, onChange, label }: CheckboxProps) {
  return (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 2,
          border: `2px solid ${checked ? '#800020' : '#CBD5E1'}`,
          background: checked ? '#800020' : '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 150ms', cursor: 'pointer',
        }}
      >
        {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>✓</span>}
      </div>
      <span style={{ fontSize: 14, color: '#1E293B', lineHeight: 1.5 }}>{label}</span>
    </label>
  );
}

// ─── Radio Group ───────────────────────────────────────────────────────────────
interface RadioGroupProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}
export function RadioGroup({ label, options, value, onChange }: RadioGroupProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{label}</label>}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {options.map(o => (
          <label key={o.value} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <div
              onClick={() => onChange(o.value)}
              style={{
                width: 20, height: 20, borderRadius: '50%', border: `2px solid ${value === o.value ? '#800020' : '#CBD5E1'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                transition: 'border 150ms',
              }}
            >
              {value === o.value && (
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#800020' }} />
              )}
            </div>
            <span style={{ fontSize: 14, color: '#1E293B' }}>{o.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

// ─── Tag Input ─────────────────────────────────────────────────────────────────
interface TagInputProps {
  label?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}
export function TagInput({ label, tags, onChange, placeholder = 'Add skill…', suggestions = [] }: TagInputProps) {
  const [input, setInput] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);

  const addTag = (tag: string) => {
    const t = tag.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
    setShowSuggestions(false);
  };

  const filtered = suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{label}</label>}
      <div style={{
        minHeight: 44, borderRadius: 6, border: '1px solid #E2E8F0',
        padding: '6px 10px', background: '#fff',
        display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
      }}>
        {tags.map(tag => (
          <span key={tag} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            height: 28, padding: '0 10px', borderRadius: 6,
            background: '#FBEFF2', color: '#800020', border: '1px solid #F3D6DD', fontSize: 13, fontWeight: 600,
          }}>
            {tag}
            <button onClick={() => onChange(tags.filter(t => t !== tag))} style={{
              border: 'none', background: 'none', color: '#800020', cursor: 'pointer', padding: 0, lineHeight: 1
            }}>×</button>
          </span>
        ))}
        <input
          value={input}
          onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(input); } }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ''}
          style={{
            flex: 1, minWidth: 120, border: 'none', outline: 'none', fontSize: 14,
            fontFamily: 'Inter, system-ui, sans-serif', color: '#1E293B', background: 'transparent',
          }}
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div style={{
          position: 'absolute', zIndex: 100,
          background: '#fff', border: '1px solid #E2E8F0',
          borderRadius: 8, padding: 4,
          boxShadow: '0 8px 24px rgba(15,23,42,.12)',
          maxHeight: 200, overflowY: 'auto',
          marginTop: 50,
        }}>
          {filtered.map(s => (
            <button key={s} onMouseDown={() => addTag(s)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px',
              border: 'none', background: 'none', cursor: 'pointer', fontSize: 14,
              borderRadius: 6, color: '#1E293B',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Number Stepper ────────────────────────────────────────────────────────────
interface StepperProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}
export function Stepper({ label, value, min = 1, max = 20, onChange }: StepperProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <label style={{ fontSize: 14, fontWeight: 600, color: '#1E293B' }}>{label}</label>}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 0,
        border: '1px solid #E2E8F0', borderRadius: 6, overflow: 'hidden', height: 44, width: 110,
      }}>
        <button onClick={() => onChange(Math.max(min, value - 1))} style={{
          width: 36, height: '100%', border: 'none', background: '#F8FAFC', cursor: 'pointer',
          fontSize: 18, color: '#475569', fontWeight: 600,
        }}>−</button>
        <span style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600, color: '#1E293B' }}>
          {value}
        </span>
        <button onClick={() => onChange(Math.min(max, value + 1))} style={{
          width: 36, height: '100%', border: 'none', background: '#F8FAFC', cursor: 'pointer',
          fontSize: 18, color: '#475569', fontWeight: 600,
        }}>+</button>
      </div>
    </div>
  );
}

// ─── Accordion ─────────────────────────────────────────────────────────────────
interface AccordionProps {
  items: { question: string; answer: string }[];
}
export function Accordion({ items }: AccordionProps) {
  const [open, setOpen] = React.useState<number | null>(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '18px 0', background: 'none', border: 'none', cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 600, color: '#1E293B' }}>{item.question}</span>
            <span style={{
              fontSize: 18, color: '#800020', transition: 'transform 200ms',
              transform: open === i ? 'rotate(180deg)' : 'none',
              flexShrink: 0, marginLeft: 16,
            }}>⌄</span>
          </button>
          {open === i && (
            <div style={{ padding: '0 0 18px', fontSize: 15, color: '#475569', lineHeight: 1.7 }}>
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Pill Tabs ─────────────────────────────────────────────────────────────────
interface PillTabsProps {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}
export function PillTabs({ tabs, active, onChange }: PillTabsProps) {
  return (
    <div style={{
      display: 'inline-flex', background: '#F1F5F9', borderRadius: 10, padding: 4, gap: 2,
    }}>
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onChange(t)}
          style={{
            padding: '6px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: 14, fontWeight: 600,
            background: active === t ? '#fff' : 'transparent',
            color: active === t ? '#800020' : '#64748B',
            boxShadow: active === t ? '0 1px 3px rgba(15,23,42,.12)' : 'none',
            transition: 'all 150ms',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

// ─── Card Shell ────────────────────────────────────────────────────────────────
export function Card({
  children, style, className
}: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: '#fff', borderRadius: 16, padding: 24,
        boxShadow: '0 1px 3px rgba(15,23,42,.08)', border: '1px solid #E2E8F0',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Notification Bell ─────────────────────────────────────────────────────────
export function NotificationBell({ count = 0, onClick }: { count?: number; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 40, height: 40, borderRadius: '50%', border: 'none',
      background: 'transparent', cursor: 'pointer', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      transition: 'background 150ms',
    }}
      onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      aria-label="Notifications"
    >
      <BellIcon size={21} />
      {count > 0 && (
        <span style={{
          position: 'absolute', top: 2, right: 2,
          minWidth: 16, height: 16, padding: '0 3px', borderRadius: 8,
          background: '#800020', border: '2px solid #fff',
          fontSize: 9, color: '#fff', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{count > 9 ? '9+' : count}</span>
      )}
    </button>
  );
}
