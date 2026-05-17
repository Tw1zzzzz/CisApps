// PARTY UP — Swipe screen with drag gesture
// Globals: PROFILES, Icon, Avatar, HeroPlaceholder, GameChip, Tag

function SwipeScreen({ onMatch, onOpenProfile, onOpenFilters, filters }) {
  const [stack, setStack] = React.useState(window.PROFILES);
  const [dragX, setDragX] = React.useState(0);
  const [dragY, setDragY] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [exiting, setExiting] = React.useState(null); // {dir: -1/1/2, profile}
  const [actionFlash, setActionFlash] = React.useState(null); // 'like' | 'pass' | 'super'
  const startRef = React.useRef({ x: 0, y: 0 });

  const current = stack[0];
  const next = stack[1];
  const third = stack[2];

  const reset = () => {setDragX(0);setDragY(0);setDragging(false);};

  const advance = (dir, profile) => {
    setExiting({ dir, profile });
    setTimeout(() => {
      setStack((s) => s.slice(1).concat([s[0]])); // cycle for demo
      setExiting(null);
      reset();
      // trigger a match popup randomly on like/super
      if ((dir === 1 || dir === 2) && Math.random() < (dir === 2 ? 0.85 : 0.45)) {
        onMatch && onMatch(profile);
      }
    }, 320);
  };

  const onPointerDown = (e) => {
    if (exiting) return;
    setDragging(true);
    startRef.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    setDragX(e.clientX - startRef.current.x);
    setDragY(e.clientY - startRef.current.y);
  };
  const onPointerUp = (e) => {
    if (!dragging) return;
    setDragging(false);
    const TH = 90;
    if (dragX > TH) advance(1, current);else
    if (dragX < -TH) advance(-1, current);else
    if (dragY < -TH * 1.4) advance(2, current); // up = superlike
    else reset();
  };

  const tap = (dir) => {
    if (exiting) return;
    setActionFlash(dir === 1 ? 'like' : dir === -1 ? 'pass' : 'super');
    setTimeout(() => setActionFlash(null), 280);
    advance(dir, current);
  };

  // tilt / opacity hints for current card
  const tx = exiting ? exiting.dir === 2 ? 0 : exiting.dir * 600 : dragX;
  const ty = exiting ? exiting.dir === 2 ? -800 : dragY * 0.4 : dragY;
  const rot = exiting ? exiting.dir === 2 ? 0 : exiting.dir * 25 : dragX * 0.05;
  const likeOp = Math.min(1, Math.max(0, dragX / 100));
  const passOp = Math.min(1, Math.max(0, -dragX / 100));
  const superOp = Math.min(1, Math.max(0, -dragY / 100));

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        padding: '54px 16px 8px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), #1888c4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(42,171,238,0.4)'
          }}>
            <Icon name="crosshair" size={16} color="#fff" stroke={2.2} />
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1 }}>PARTY UP</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, fontFamily: 'var(--mono)' }}>
              CS2 · {filters?.region || 'EU+CIS'} · elo {filters?.eloMin || 0}–{filters?.eloMax || '∞'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={onOpenFilters} style={iconBtn}><Icon name="filter" size={18} /></button>
          <button style={iconBtn}><Icon name="bell" size={18} /></button>
        </div>
      </div>

      {/* Card stack */}
      <div style={{
        flex: 1, position: 'relative', padding: '8px 16px 12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 360, aspectRatio: '0.7' }}>
          {third &&
          <CardShell zIndex={1} style={{ transform: 'translateY(20px) scale(0.92)', opacity: 0.5 }}>
              <HeroPlaceholder profile={third} />
            </CardShell>
          }
          {next &&
          <CardShell zIndex={2} style={{ transform: 'translateY(10px) scale(0.96)', opacity: 0.85 }}>
              <HeroPlaceholder profile={next} />
              <CardInfoOverlay profile={next} dim />
            </CardShell>
          }
          {current &&
          <CardShell
            zIndex={3}
            style={{
              transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg)`,
              transition: exiting || !dragging ? 'transform 0.32s cubic-bezier(.2,.8,.2,1), opacity 0.32s' : 'none',
              opacity: exiting ? 0 : 1,
              cursor: dragging ? 'grabbing' : 'grab',
              touchAction: 'none'
            }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}>
            
              <HeroPlaceholder profile={current} />
              <CardInfoOverlay profile={current} onExpand={() => onOpenProfile(current)} />
              {/* gesture badges */}
              <GestureBadge label="LIKE" color="var(--like)" opacity={likeOp} side="left" rot={-18} />
              <GestureBadge label="PASS" color="var(--dislike)" opacity={passOp} side="right" rot={18} />
              <GestureBadge label="SUPER" color="var(--super)" opacity={superOp} side="top" rot={-8} />
            </CardShell>
          }

          {/* tap-action flash overlay */}
          {actionFlash &&
          <div style={{
            position: 'absolute', inset: 0, borderRadius: 24,
            pointerEvents: 'none', animation: 'flash-fade 0.3s forwards',
            background: actionFlash === 'like' ?
            'radial-gradient(circle, rgba(78,203,113,0.3), transparent 70%)' :
            actionFlash === 'pass' ?
            'radial-gradient(circle, rgba(255,77,94,0.3), transparent 70%)' :
            'radial-gradient(circle, rgba(181,127,255,0.3), transparent 70%)',
            zIndex: 5
          }} />
          }
        </div>
      </div>

      {/* Action dock */}
      <div style={{
        position: 'relative',
        padding: '14px 16px 80px'
      }}>
        {/* Floating super button */}
        <button onClick={() => tap(2)} style={{
          position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
          width: 54, height: 54, borderRadius: '50%',
          background: 'var(--surface-2)', border: '2px solid var(--super)',
          color: 'var(--super)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 28px rgba(181,127,255,0.45), 0 0 0 4px var(--bg)',
          zIndex: 5, padding: 0
        }}>
          <Icon name="bolt" size={22} stroke={2.4} />
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <DockAction icon="x" color="var(--dislike)" label="Скип" onClick={() => tap(-1)} />
          <DockAction icon="heart" color="var(--like)" label="В пати" onClick={() => tap(1)} primary />
        </div>
      </div>
    </div>);

}

const iconBtn = {
  width: 36, height: 36, borderRadius: 10,
  background: 'var(--surface)', border: '1px solid var(--border)',
  color: 'var(--text-dim)', display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  padding: 0
};

function CardShell({ children, style, zIndex, ...rest }) {
  return (
    <div {...rest} style={{
      position: 'absolute', inset: 0, borderRadius: 24, overflow: 'hidden',
      background: 'var(--surface)',
      boxShadow: '0 18px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset',
      zIndex, ...style
    }}>{children}</div>);

}

function CardInfoOverlay({ profile, dim, onExpand }) {
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      padding: 18, color: '#fff', zIndex: 2,
      opacity: dim ? 0.85 : 1
    }}>
      {/* status tags row */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
        {profile.online &&
          <StatusPill>
            <span className="online-dot" />online
          </StatusPill>
        }
        <StatusPill>
          <Icon name="globe" size={11} stroke={2} />{profile.region}
        </StatusPill>
        {profile.verified &&
          <StatusPill color="#4ECB71">
            <Icon name="shield" size={11} stroke={2.2} />Faceit
          </StatusPill>
        }
        {profile.hasMic &&
          <StatusPill>
            <Icon name="mic" size={11} stroke={2} />Мик
          </StatusPill>
        }
        {profile.vibe &&
          <StatusPill color="#B57FFF">
            <Icon name="fire" size={11} stroke={2} />{profile.vibe}
          </StatusPill>
        }
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>{profile.name}</span>
            <span style={{ fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{profile.age}</span>
          </div>
          <div className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>
            @{profile.nick}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
            <EloBadge elo={profile.elo} size="md" />
            <RoleChip role={profile.role} side={profile.side} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <MapPool maps={profile.maps} max={5} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <PlayTimeRow time={profile.playTime} />
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.4, color: 'rgba(255,255,255,0.82)',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {profile.bio}
          </div>
        </div>
        {!dim && onExpand &&
        <button onClick={(e) => {e.stopPropagation();onExpand();}} style={{
          width: 38, height: 38, borderRadius: 10, flexShrink: 0,
          background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.18)', color: '#fff',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
            <Icon name="chev_u" size={20} stroke={2.2} />
          </button>
        }
      </div>
    </div>);

}

function StatusPill({ children, color }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 8px', borderRadius: 6,
      background: 'rgba(10,12,18,0.5)', backdropFilter: 'blur(8px)',
      fontSize: 11, fontWeight: 600,
      color: color || 'rgba(255,255,255,0.9)',
      border: color ? `1px solid ${color}33` : '1px solid rgba(255,255,255,0.06)',
    }}>{children}</span>
  );
}

function GestureBadge({ label, color, opacity, side, rot }) {
  const pos = side === 'left' ? { top: 40, left: 24 } :
  side === 'right' ? { top: 40, right: 24 } :
  { top: 24, left: '50%', transform: `translateX(-50%) rotate(${rot}deg)` };
  return (
    <div style={{
      position: 'absolute', ...pos,
      transform: (pos.transform || '') + ` rotate(${rot}deg)`,
      padding: '8px 18px', borderRadius: 10,
      border: '3px solid ' + color, color: color,
      fontSize: 24, fontWeight: 900, letterSpacing: '0.05em',
      background: 'rgba(11,14,20,0.55)', backdropFilter: 'blur(4px)',
      opacity, transition: 'opacity 0.1s', pointerEvents: 'none',
      zIndex: 4
    }}>{label}</div>);

}

function DockAction({ icon, color, label, onClick, primary }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, height: 58, borderRadius: 16, cursor: 'pointer',
      background: 'var(--surface)',
      border: '1px solid ' + (primary ? color : 'var(--border)'),
      color: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em',
      boxShadow: primary ?
      '0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 0 3px ' + color + '12' :
      '0 6px 18px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)',
      transition: 'transform 0.12s, background 0.15s',
      padding: 0
    }}
    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.97)'}
    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      
      <Icon name={icon} size={20} stroke={2.4} />
      <span style={{ color: 'var(--text)' }}>{label}</span>
    </button>);

}

const utilBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: 5,
  background: 'transparent', border: 0, padding: '6px 0',
  color: 'var(--text-muted)', fontSize: 11, fontWeight: 600,
  cursor: 'pointer', letterSpacing: '-0.005em'
};

function ActionBtn({ icon, color, size, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--surface)', border: '1px solid var(--border)',
      color: color, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)',
      transition: 'transform 0.12s'
    }}
    onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.92)'}
    onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      
      <Icon name={icon} size={size * 0.42} stroke={2.4} />
    </button>);

}

Object.assign(window, { SwipeScreen });