// PARTY UP — Main app shell + navigation + match popup + tab bar + tweaks
// Globals: IOSDevice, useTweaks, TweaksPanel, Tweak* controls
// Plus all screens & UI atoms

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2AABEE",
  "font": "Manrope",
  "showAdmin": true,
  "skipOnboarding": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = window.useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to CSS vars
  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', t.accent);
    // soft variant of accent
    document.documentElement.style.setProperty('--accent-soft', t.accent + '24');
    document.documentElement.style.setProperty('--font', `'${t.font}', -apple-system, system-ui, sans-serif`);
  }, [t.accent, t.font]);

  const [onboarded, setOnboarded] = React.useState(t.skipOnboarding);
  React.useEffect(() => { setOnboarded(t.skipOnboarding); }, [t.skipOnboarding]);

  const [tab, setTab] = React.useState('swipe');
  const [overlay, setOverlay] = React.useState(null); // 'profile' | 'filters' | 'settings' | 'analytics'
  const [openedProfile, setOpenedProfile] = React.useState(null);
  const [match, setMatch] = React.useState(null);
  const [filters, setFilters] = React.useState({
    role: 'all', region: 'EU+CIS', ageMin: 19, ageMax: 28,
    eloMin: 1200, eloMax: 2500, maps: [], playTimes: [],
    onlyOnline: false, withMic: true, verified: false,
  });

  const openProfile = (p) => { setOpenedProfile(p); setOverlay('profile'); };
  const closeOverlay = () => { setOverlay(null); setOpenedProfile(null); };

  const onMatch = (p) => setMatch(p);
  const dismissMatch = () => setMatch(null);

  // Main screen content
  let screen = null;
  if (!onboarded) {
    screen = <OnboardingScreen onComplete={() => setOnboarded(true)}/>;
  } else if (tab === 'swipe') {
    screen = <SwipeScreen
      onMatch={onMatch}
      onOpenProfile={openProfile}
      onOpenFilters={() => setOverlay('filters')}
      filters={filters}/>;
  } else if (tab === 'likes') {
    screen = <LikesScreen onOpenProfile={openProfile}/>;
  } else if (tab === 'chats') {
    screen = <ChatsScreen/>;
  } else if (tab === 'me') {
    screen = <MyProfileScreen
      isAdmin={t.showAdmin}
      onOpenSettings={() => setOverlay('settings')}
      onOpenAnalytics={() => setOverlay('analytics')}
      onOpenModeration={() => setOverlay('moderation')}/>;
  }

  // Overlay
  let overlayEl = null;
  if (overlay === 'profile' && openedProfile) {
    overlayEl = <ProfileDetailScreen profile={openedProfile} onClose={closeOverlay}
      onLike={onMatch} onPass={() => {}} onSuper={onMatch}/>;
  } else if (overlay === 'filters') {
    overlayEl = <FiltersScreen filters={filters} setFilters={setFilters} onClose={closeOverlay}/>;
  } else if (overlay === 'settings') {
    overlayEl = <SettingsScreen onClose={closeOverlay}/>;
  } else if (overlay === 'analytics') {
    overlayEl = <AnalyticsScreen onClose={closeOverlay}/>;
  } else if (overlay === 'moderation') {
    overlayEl = <ModerationScreen onClose={closeOverlay}/>;
  }

  return (
    <>
      <div style={{ position: 'relative', height: '100%' }}>
        {screen}
        {/* Tab bar */}
        {onboarded && !overlay && (
          <TabBar tab={tab} setTab={setTab}/>
        )}
        {/* Overlay (slides up) */}
        {overlayEl && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'var(--bg)',
            animation: 'slide-up 0.28s cubic-bezier(.2,.8,.2,1)',
            zIndex: 100,
          }}>
            {overlayEl}
          </div>
        )}
        {/* Match popup */}
        {match && <MatchPopup profile={match} onClose={dismissMatch}/>}
      </div>

      {/* Tweaks panel (outside device frame) */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Color"/>
        <TweakColor label="Акцент" value={t.accent}
          options={['#2AABEE', '#FF4D5E', '#B57FFF', '#4ECB71', '#FFB13D', '#E94585']}
          onChange={v => setTweak('accent', v)}/>
        <TweakSection label="Typography"/>
        <TweakSelect label="Шрифт" value={t.font}
          options={['Manrope', 'Onest', 'Space Grotesk', 'IBM Plex Sans', 'Inter']}
          onChange={v => setTweak('font', v)}/>
        <TweakSection label="State"/>
        <TweakToggle label="Скип онбординга" value={t.skipOnboarding}
          onChange={v => setTweak('skipOnboarding', v)}/>
        <TweakToggle label="Режим админа (Аналитика)" value={t.showAdmin}
          onChange={v => setTweak('showAdmin', v)}/>
      </TweaksPanel>
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// Tab bar
// ─────────────────────────────────────────────────────────────
function TabBar({ tab, setTab }) {
  const tabs = [
    { id: 'swipe', icon: 'cards', label: 'Анкеты' },
    { id: 'likes', icon: 'heart', label: 'Лайки', badge: 6 },
    { id: 'chats', icon: 'chat',  label: 'Чаты', badge: 2 },
    { id: 'me',    icon: 'user',  label: 'Профиль' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      padding: '8px 8px calc(env(safe-area-inset-bottom, 0) + 22px)',
      background: 'rgba(11,14,20,0.88)',
      backdropFilter: 'blur(16px) saturate(180%)',
      borderTop: '1px solid var(--border)',
      display: 'grid', gridTemplateColumns: `repeat(${tabs.length}, 1fr)`, gap: 4,
      zIndex: 50,
    }}>
      {tabs.map(tb => (
        <button key={tb.id} onClick={() => setTab(tb.id)} style={{
          padding: '8px 6px', borderRadius: 10, border: 0,
          background: 'transparent', cursor: 'pointer',
          color: tab === tb.id ? 'var(--accent)' : 'var(--text-muted)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          position: 'relative',
        }}>
          <div style={{ position: 'relative' }}>
            <Icon name={tb.icon} size={22} stroke={tab === tb.id ? 2.2 : 1.8}/>
            {tb.badge && (
              <span className="mono" style={{
                position: 'absolute', top: -4, right: -8,
                background: 'var(--dislike)', color: '#fff',
                fontSize: 9, fontWeight: 700,
                padding: '1px 4px', borderRadius: 6, minWidth: 14, textAlign: 'center',
                border: '1.5px solid var(--bg)',
              }}>{tb.badge}</span>
            )}
          </div>
          <span style={{
            fontSize: 10.5, fontWeight: 700, letterSpacing: '-0.01em',
          }}>{tb.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Match popup — "It's a match!"
// ─────────────────────────────────────────────────────────────
function MatchPopup({ profile, onClose }) {
  const me = window.ME;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(8,10,16,0.82)', backdropFilter: 'blur(16px)',
      animation: 'match-fade 0.3s', overflow: 'hidden',
    }} onClick={onClose}>
      {/* Background rays */}
      <div style={{
        position: 'absolute', top: '40%', left: '50%',
        width: 700, height: 700,
        transform: 'translate(-50%, -50%)',
        background: `conic-gradient(from 0deg,
          ${profile.gradient[0]} 0deg, transparent 30deg,
          ${profile.gradient[0]} 60deg, transparent 90deg,
          ${profile.gradient[1]} 120deg, transparent 150deg,
          ${profile.gradient[0]} 180deg, transparent 210deg,
          ${profile.gradient[1]} 240deg, transparent 270deg,
          ${profile.gradient[0]} 300deg, transparent 330deg,
          ${profile.gradient[0]} 360deg)`,
        opacity: 0.18, filter: 'blur(40px)',
        animation: 'spin-slow 30s linear infinite',
      }}/>

      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '0 28px',
        animation: 'match-pop 0.5s cubic-bezier(.2,.8,.2,1)',
      }} onClick={e => e.stopPropagation()}>

        <div style={{
          fontSize: 13, fontWeight: 700, letterSpacing: '0.2em',
          color: 'var(--accent)', textTransform: 'uppercase',
          fontFamily: 'var(--mono)',
        }}>// СВЯЗЬ УСТАНОВЛЕНА</div>

        <div style={{
          fontSize: 42, fontWeight: 800, letterSpacing: '-0.03em',
          marginTop: 8, textAlign: 'center', lineHeight: 1.05,
          background: 'linear-gradient(90deg, #fff, #c8d8f0)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Это пати!</div>

        <div style={{
          fontSize: 15, color: 'var(--text-dim)', marginTop: 14, textAlign: 'center',
          maxWidth: 280, lineHeight: 1.45,
        }}>
          Вы оба готовы катать вместе. Напиши первым — секунда решает всё.
        </div>

        {/* Two avatars overlapping */}
        <div style={{ display: 'flex', marginTop: 36, position: 'relative' }}>
          <div style={{
            padding: 3, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent), #fff)',
            transform: 'rotate(-6deg) translateX(10px)',
            zIndex: 1,
          }}>
            <Avatar name={me.name} hue={210} size={100}/>
          </div>
          <div style={{
            padding: 3, borderRadius: '50%',
            background: `linear-gradient(135deg, ${profile.gradient[0]}, ${profile.gradient[1]})`,
            transform: 'rotate(6deg) translateX(-10px)',
            zIndex: 2,
          }}>
            <Avatar name={profile.name} gradient={profile.gradient} size={100}/>
          </div>
          {/* spark */}
          <div style={{
            position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
            width: 36, height: 36, borderRadius: '50%',
            background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid var(--super)', zIndex: 5,
            boxShadow: '0 0 24px rgba(181,127,255,0.6)',
          }}>
            <Icon name="bolt" size={18} color="var(--super)" stroke={2.4}/>
          </div>
        </div>

        {/* Names + common stats */}
        <div style={{ marginTop: 28, textAlign: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {me.name} <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>×</span> {profile.name}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            <EloBadge elo={profile.elo} size="sm"/>
            <RoleChip role={profile.role} side={profile.side}/>
          </div>
        </div>

        <div style={{ width: '100%', marginTop: 36, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className="btn-primary" onClick={onClose}>Написать сейчас</button>
          <button onClick={onClose} style={{
            background: 'transparent', color: 'var(--text-dim)',
            border: 0, padding: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>Продолжить свайпы</button>
        </div>
      </div>
    </div>
  );
}

// keyframes for overlay slide-in (injected once)
(function injectKeyframes() {
  if (document.getElementById('partyup-kf')) return;
  const s = document.createElement('style');
  s.id = 'partyup-kf';
  s.textContent = `
    @keyframes slide-up {
      from { transform: translateY(8%); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(s);
})();

// ─────────────────────────────────────────────────────────────
// Root render — wraps App in iOS device frame
// ─────────────────────────────────────────────────────────────
function Root() {
  return (
    <div data-screen-label="App">
      <window.IOSDevice width={390} height={844} dark>
        <App/>
      </window.IOSDevice>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root/>);
