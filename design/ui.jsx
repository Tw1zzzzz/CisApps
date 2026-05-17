// PARTY UP — shared UI atoms (icons, avatars, chips)
// Globals: GAME_CATALOG

// ─────────────────────────── Icons ───────────────────────────
const Icon = ({ name, size = 20, color = 'currentColor', stroke = 1.7 }) => {
  const s = { width: size, height: size, display: 'inline-block', flexShrink: 0 };
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    cards:   <><rect x="3" y="6" width="14" height="16" rx="2" {...p}/><rect x="7" y="2" width="14" height="16" rx="2" {...p}/></>,
    heart:   <path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z" {...p}/>,
    chat:    <path d="M4 19V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-5 3v-2z" {...p}/>,
    user:    <><circle cx="12" cy="8" r="4" {...p}/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" {...p}/></>,
    settings:<><circle cx="12" cy="12" r="3" {...p}/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" {...p}/></>,
    close:   <><path d="M18 6 6 18M6 6l12 12" {...p}/></>,
    x:       <path d="M18 6 6 18M6 6l12 12" {...p}/>,
    back:    <path d="M15 18l-6-6 6-6" {...p}/>,
    forward: <path d="M9 18l6-6-6-6" {...p}/>,
    rewind:  <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" {...p}/>,
    bolt:    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" {...p}/>,
    star:    <path d="M12 2l3 7 7 .6-5.4 4.7L18 22l-6-3.7L6 22l1.4-7.7L2 9.6 9 9z" {...p}/>,
    filter:  <path d="M3 5h18M6 12h12M10 19h4" {...p}/>,
    shield:  <path d="M12 3l8 4v5c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V7l8-4z" {...p}/>,
    bell:    <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" {...p}/><path d="M10 21a2 2 0 0 0 4 0" {...p}/></>,
    share:   <><circle cx="18" cy="5" r="3" {...p}/><circle cx="6" cy="12" r="3" {...p}/><circle cx="18" cy="19" r="3" {...p}/><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" {...p}/></>,
    pencil:  <><path d="M14 4l6 6L10 20H4v-6L14 4z" {...p}/></>,
    check:   <path d="M5 13l4 4L19 7" {...p}/>,
    pin:     <><path d="M12 22s-7-7-7-12a7 7 0 1 1 14 0c0 5-7 12-7 12z" {...p}/><circle cx="12" cy="10" r="2.5" {...p}/></>,
    plus:    <path d="M12 5v14M5 12h14" {...p}/>,
    search:  <><circle cx="11" cy="11" r="7" {...p}/><path d="m20 20-3.5-3.5" {...p}/></>,
    chev_r:  <path d="M9 6l6 6-6 6" {...p}/>,
    chev_d:  <path d="M6 9l6 6 6-6" {...p}/>,
    chev_u:  <path d="M6 15l6-6 6 6" {...p}/>,
    crown:   <path d="M3 7l4 4 5-6 5 6 4-4-2 12H5L3 7z" {...p}/>,
    fire:    <path d="M12 3s4 4 4 8a4 4 0 1 1-8 0c0-2 1-3 1-3s-1 4 2 4 3-3 3-6c0-2-2-3-2-3z" {...p}/>,
    crosshair:<><circle cx="12" cy="12" r="9" {...p}/><path d="M12 3v4M12 17v4M3 12h4M17 12h4" {...p}/></>,
    mic:     <><rect x="9" y="3" width="6" height="12" rx="3" {...p}/><path d="M5 12a7 7 0 0 0 14 0M12 19v3" {...p}/></>,
    globe:   <><circle cx="12" cy="12" r="9" {...p}/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" {...p}/></>,
    chart:   <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" {...p}/></>,
    trash:   <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14" {...p}/></>,
    info:    <><circle cx="12" cy="12" r="9" {...p}/><path d="M12 11v6M12 7.5v.01" {...p}/></>,
    flag:    <path d="M5 21V4h13l-2 4 2 4H5" {...p}/>,
    eye:     <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" {...p}/><circle cx="12" cy="12" r="3" {...p}/></>,
    eye_off: <><path d="m3 3 18 18M10.5 6.2A10 10 0 0 1 22 12c-1 2-2.4 3.6-4 4.8M6 7c-2 1.4-3.4 3-4 5 0 0 4 7 10 7a9 9 0 0 0 5-1.5" {...p}/></>,
  };
  return <svg viewBox="0 0 24 24" style={s}>{paths[name] || null}</svg>;
};

// ─────────────────────────── Avatar (gradient + initials placeholder) ───────────────────────────
// hue: HSL hue used to seed gradient. Initials shown over a textured gradient.
function Avatar({ name, nick, hue = 200, size = 56, round = '50%', gradient }) {
  const initials = (name || nick || '?').slice(0, 1).toUpperCase();
  const bg = gradient
    ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
    : `radial-gradient(circle at 30% 25%, hsl(${hue} 70% 45%), hsl(${(hue+40)%360} 65% 22%) 60%, hsl(${(hue+80)%360} 60% 14%))`;
  return (
    <div style={{
      width: size, height: size, borderRadius: round,
      background: bg, position: 'relative', overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.4, color: 'rgba(255,255,255,0.92)',
      letterSpacing: '-0.02em',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -20px 30px rgba(0,0,0,0.25)',
      flexShrink: 0,
    }}>
      {/* noise texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle at 70% 80%, rgba(0,0,0,0.4), transparent 50%)',
        mixBlendMode: 'multiply',
      }}/>
      <span style={{ position: 'relative', zIndex: 1 }}>{initials}</span>
    </div>
  );
}

// ─────────────────────────── Hero card visual ───────────────────────────
// Big card photo placeholder for swipe view: gradient with textured pattern + monogram + caption
function HeroPlaceholder({ profile, label = 'фото анкеты' }) {
  const [a, b] = profile.gradient;
  const initials = profile.name.slice(0, 1).toUpperCase();
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(160deg, ${a} 0%, ${b} 100%)`,
      overflow: 'hidden',
    }}>
      {/* radial highlight */}
      <div style={{
        position: 'absolute', top: '-30%', left: '20%',
        width: '120%', height: '120%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.18), transparent 50%)',
      }}/>
      {/* diagonal stripes texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 18px, rgba(255,255,255,0.5) 18px 19px)',
      }}/>
      {/* big initial */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -55%)',
        fontSize: 220, fontWeight: 800, color: 'rgba(255,255,255,0.08)',
        fontFamily: 'var(--font)', letterSpacing: '-0.05em', lineHeight: 1,
      }}>{initials}</div>
      {/* drop hint */}
      <div style={{
        position: 'absolute', top: 14, right: 14,
        fontFamily: 'var(--mono)', fontSize: 9, color: 'rgba(255,255,255,0.45)',
        letterSpacing: '0.08em', textTransform: 'uppercase',
        background: 'rgba(0,0,0,0.18)', padding: '4px 8px', borderRadius: 4,
        backdropFilter: 'blur(4px)',
      }}>{label}</div>
      {/* bottom gradient for text legibility */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '55%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
      }}/>
    </div>
  );
}

// ─────────────────────────── Game chip with rank ───────────────────────────
function GameChip({ code, rank, size = 'md' }) {
  const game = (window.GAME_CATALOG)[code] || { name: code, short: code.toUpperCase(), cls: 'gchip-default' };
  const sz = {
    sm: { fs: 10, pad: '3px 6px', short: 10, rfs: 10 },
    md: { fs: 11, pad: '4px 4px 4px 4px', short: 11, rfs: 12 },
    lg: { fs: 12, pad: '5px 6px 5px 5px', short: 12, rfs: 13 },
  }[size];
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: sz.pad,
      borderRadius: 8, background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)' }}>
      <span className={'gchip ' + game.cls} style={{
        fontFamily: 'var(--mono)', fontSize: sz.short, fontWeight: 700,
        padding: '3px 6px', borderRadius: 5, letterSpacing: '0.03em',
      }}>{game.short}</span>
      {rank && <span style={{ fontSize: sz.rfs, fontWeight: 600, color: 'var(--text)', paddingRight: 4 }}>{rank}</span>}
    </div>
  );
}

// ─────────────────────────── Tag pill ───────────────────────────
function Tag({ children, accent = false, icon, style = {} }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '5px 9px', borderRadius: 8,
      fontSize: 11.5, fontWeight: 600,
      background: accent ? 'var(--accent-soft)' : 'rgba(255,255,255,0.05)',
      color: accent ? 'var(--accent)' : 'var(--text-dim)',
      border: '1px solid ' + (accent ? 'transparent' : 'rgba(255,255,255,0.06)'),
      ...style,
    }}>
      {icon && <Icon name={icon} size={11} stroke={2}/>}
      {children}
    </span>
  );
}

// ─────────────────────────── CS2-specific atoms ───────────────────────────
// Faceit elo bracket meta — used to color the badge tier-style
function eloMeta(elo) {
  if (elo >= 2001) return { tier: 'Lvl 10',  color: '#FFD24D', bg: 'rgba(255,210,77,0.12)',  border: 'rgba(255,210,77,0.32)' };
  if (elo >= 1751) return { tier: 'Lvl 9',   color: '#FF8FA0', bg: 'rgba(255,143,160,0.10)', border: 'rgba(255,143,160,0.28)' };
  if (elo >= 1531) return { tier: 'Lvl 8',   color: '#FFB78A', bg: 'rgba(255,183,138,0.10)', border: 'rgba(255,183,138,0.28)' };
  if (elo >= 1351) return { tier: 'Lvl 7',   color: '#6EC6FF', bg: 'rgba(110,198,255,0.10)', border: 'rgba(110,198,255,0.28)' };
  if (elo >= 1201) return { tier: 'Lvl 6',   color: '#8FB7FF', bg: 'rgba(143,183,255,0.10)', border: 'rgba(143,183,255,0.28)' };
  if (elo >= 1051) return { tier: 'Lvl 5',   color: '#A8E6C5', bg: 'rgba(168,230,197,0.10)', border: 'rgba(168,230,197,0.28)' };
  if (elo >=  901) return { tier: 'Lvl 4',   color: '#A8E6C5', bg: 'rgba(168,230,197,0.08)', border: 'rgba(168,230,197,0.22)' };
  if (elo >=  751) return { tier: 'Lvl 3',   color: '#9AA3B5', bg: 'rgba(154,163,181,0.10)', border: 'rgba(154,163,181,0.22)' };
  if (elo >=  501) return { tier: 'Lvl 2',   color: '#9AA3B5', bg: 'rgba(154,163,181,0.08)', border: 'rgba(154,163,181,0.18)' };
  return                  { tier: 'Lvl 1',   color: '#9AA3B5', bg: 'rgba(154,163,181,0.06)', border: 'rgba(154,163,181,0.15)' };
}

function EloBadge({ elo, size = 'md', label = true, verified = false }) {
  const m = eloMeta(elo);
  const sz = size === 'lg'
    ? { fs: 22, pad: '8px 12px', lfs: 9.5, gap: 2 }
    : size === 'sm'
      ? { fs: 13, pad: '4px 8px', lfs: 8.5, gap: 1 }
      : { fs: 16, pad: '6px 10px', lfs: 9, gap: 2 };
  return (
    <div style={{
      display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start',
      padding: sz.pad, borderRadius: 8, gap: sz.gap,
      background: m.bg, border: '1px solid ' + m.border,
    }}>
      {label && (
        <span className="mono" style={{
          fontSize: sz.lfs, fontWeight: 700, color: m.color,
          letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1,
          display: 'inline-flex', alignItems: 'center', gap: 4,
        }}>
          Faceit · {m.tier}
          {verified && <Icon name="check" size={sz.lfs + 1} stroke={3} color={m.color}/>}
        </span>
      )}
      <span className="mono" style={{
        fontSize: sz.fs, fontWeight: 800, color: '#fff',
        letterSpacing: '-0.02em', lineHeight: 1,
      }}>{elo}<span style={{ fontSize: sz.fs * 0.55, fontWeight: 600, opacity: 0.55, marginLeft: 3 }}>elo</span></span>
    </div>
  );
}

// Map chips with name truncation (3-letter short)
const MAP_ABBR = {
  Mirage: 'mir', Inferno: 'inf', Ancient: 'anc', Anubis: 'anu',
  Nuke: 'nuk', Dust2: 'd2', Overpass: 'ovp', Vertigo: 'vrt', Train: 'trn',
};
function MapChip({ name, mode = 'short' }) {
  return (
    <span className="mono" style={{
      display: 'inline-block',
      padding: '4px 7px', borderRadius: 6,
      background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.88)',
      fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em',
      border: '1px solid rgba(255,255,255,0.08)',
      textTransform: mode === 'short' ? 'lowercase' : 'none',
    }}>{mode === 'short' ? (MAP_ABBR[name] || name.slice(0,3).toLowerCase()) : name}</span>
  );
}

function MapPool({ maps, max = 4, mode = 'short' }) {
  const shown = maps.slice(0, max);
  const extra = maps.length - shown.length;
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {shown.map(m => <MapChip key={m} name={m} mode={mode}/>)}
      {extra > 0 && (
        <span className="mono" style={{
          padding: '4px 7px', borderRadius: 6,
          background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)',
          fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>+{extra}</span>
      )}
    </div>
  );
}

function RoleChip({ role, side }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 8px', borderRadius: 6,
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.08)',
      fontSize: 11.5, fontWeight: 700, color: '#fff',
    }}>
      <Icon name="crosshair" size={11} stroke={2.2} color="rgba(255,255,255,0.7)"/>
      {role}{side ? <span style={{ color: 'rgba(255,255,255,0.5)' }}> · {side}</span> : null}
    </span>
  );
}

function PlayTimeRow({ time, color = 'rgba(255,255,255,0.7)' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11.5, fontWeight: 600, color,
    }}>
      <Icon name="rewind" size={11} stroke={2} color={color}/>
      {time}
    </span>
  );
}

// Section header
function SectionTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', margin: '8px 0 10px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--text-muted)' }}>{children}</div>
      {action}
    </div>
  );
}

// Card surface
function Surface({ children, style = {}, onClick, padding = 14 }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--surface)', borderRadius: 14,
      border: '1px solid var(--border)', padding,
      ...style,
    }}>{children}</div>
  );
}

Object.assign(window, { Icon, Avatar, HeroPlaceholder, GameChip, Tag, SectionTitle, Surface, EloBadge, MapChip, MapPool, RoleChip, PlayTimeRow, eloMeta });
