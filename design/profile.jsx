// PARTY UP — Profile (mine) + Profile detail (other)
// Globals: ME, Icon, Avatar, GameChip, Tag, SectionTitle, Surface

function MyProfileScreen({ onOpenSettings, onOpenAnalytics, onOpenModeration, isAdmin }) {
  const me = window.ME;
  return (
    <div className="screen app-scroll" style={{ paddingBottom: 100 }}>
      <div style={{
        padding: '54px 16px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Профиль</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {isAdmin && (
            <button onClick={onOpenModeration} style={iconBtnP} title="Модерация">
              <Icon name="shield" size={18}/>
            </button>
          )}
          {isAdmin && (
            <button onClick={onOpenAnalytics} style={iconBtnP} title="Аналитика">
              <Icon name="chart" size={18}/>
            </button>
          )}
          <button onClick={onOpenSettings} style={iconBtnP}><Icon name="settings" size={18}/></button>
        </div>
      </div>

      {/* Profile hero */}
      <div style={{ padding: '0 16px' }}>
        <div style={{
          background: 'var(--surface)', borderRadius: 18, border: '1px solid var(--border)',
          padding: 16, display: 'flex', alignItems: 'center', gap: 14,
        }}>
          {/* avatar with completion ring */}
          <CompletionRing pct={me.completion} size={76}>
            <Avatar name={me.name} hue={210} size={70}/>
          </CompletionRing>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>{me.name}</span>
              <span style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-dim)' }}>{me.age}</span>
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>@{me.nick}</div>
            <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>Анкета заполнена</span>
              <span className="mono" style={{ color: 'var(--accent)' }}>{me.completion}%</span>
            </div>
          </div>
        </div>

        {/* Bio prompt */}
        {me.completion < 100 && (
          <div style={{
            marginTop: 10, padding: '12px 14px',
            background: 'rgba(42,171,238,0.08)', borderRadius: 12,
            border: '1px solid rgba(42,171,238,0.18)',
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8, background: 'var(--accent-soft)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--accent)',
            }}><Icon name="bolt" size={16} stroke={2}/></div>
            <div style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>
              Заверши анкету — получи +30% откликов
            </div>
            <Icon name="chev_r" size={16} color="var(--text-dim)"/>
          </div>
        )}

        {/* Quick stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
          <StatCard label="Суперлайки" value={me.superLikes} icon="bolt" color="var(--super)"/>
          <StatCard label="Бусты" value={me.boosts} icon="fire" color="var(--accent)"/>
          <StatCard label="Просмотры" value="142" icon="eye" color="var(--like)"/>
        </div>
      </div>

      <SectionTitle>Faceit</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <FaceitCard p={me}/>
      </div>

      <SectionTitle>CS2 · профиль</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <CS2StatsCard p={me}/>
      </div>

      <SectionTitle>Контакты</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ContactList contacts={me.contacts} editable/>
      </div>

      <SectionTitle>О себе</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <Surface padding={14}>
          <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text)' }}>{me.bio}</div>
        </Surface>
      </div>

      <SectionTitle>Теги</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {me.tags.map(t => <Tag key={t} accent icon="check">{t}</Tag>)}
        <Tag icon="plus">Добавить</Tag>
      </div>

      <SectionTitle>Языки</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', gap: 6 }}>
        {me.langs.map(l => <Tag key={l} icon="globe">{l}</Tag>)}
      </div>

      <SectionTitle>Действия</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <RowAction icon="pencil" label="Редактировать анкету"/>
        <RowAction icon="share" label="Поделиться профилем"/>
        <RowAction icon="eye_off" label="Скрыть профиль" subtle/>
      </div>
    </div>
  );
}

const iconBtnP = {
  width: 36, height: 36, borderRadius: 10,
  background: 'var(--surface)', border: '1px solid var(--border)',
  color: 'var(--text-dim)', display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  padding: 0,
};

function CompletionRing({ pct, size, stroke = 3, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: 'absolute', inset: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--accent)" strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - pct/100)}
          strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
      </svg>
      <div style={{ position: 'absolute', inset: stroke + 1 }}>{children}</div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 12,
      border: '1px solid var(--border)', padding: '12px 12px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ color }}><Icon name={icon} size={13} stroke={2}/></span>
        <span style={{ fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
      </div>
      <div className="mono" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>{value}</div>
    </div>
  );
}

function GameRow({ game }) {
  // Legacy — kept for compatibility, unused in current screens.
  const meta = window.GAME_CATALOG[game.code];
  if (!meta) return null;
  return null;
}

// Faceit profile card — shows linked Faceit account or "not linked" CTA
function FaceitCard({ p }) {
  const linked = !!p.faceitUrl;
  return (
    <div style={{
      background: linked
        ? 'linear-gradient(135deg, rgba(255,80,0,0.10), rgba(255,210,77,0.05))'
        : 'var(--surface)',
      borderRadius: 14,
      border: '1px solid ' + (linked ? 'rgba(255,150,50,0.22)' : 'var(--border)'),
      padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: linked ? 'rgba(255,150,50,0.18)' : 'var(--surface-3)',
        color: linked ? '#FF8A3D' : 'var(--text-dim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: 16, fontFamily: 'var(--mono)', letterSpacing: '-0.04em',
      }}>FC</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>
            {linked ? p.faceitNick : 'Не привязан'}
          </span>
          {linked && p.verified && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              padding: '2px 5px', borderRadius: 4,
              background: 'rgba(78,203,113,0.16)', color: 'var(--like)',
              fontSize: 9, fontWeight: 700, letterSpacing: '0.04em',
              textTransform: 'uppercase', fontFamily: 'var(--mono)',
            }}>
              <Icon name="check" size={9} stroke={3}/>verified
            </span>
          )}
        </div>
        <div className="mono" style={{
          fontSize: 11, color: 'var(--text-muted)', marginTop: 3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{linked ? p.faceitUrl : 'добавь ссылку или укажи elo вручную'}</div>
      </div>
      <Icon name={linked ? "share" : "plus"} size={16} color="var(--text-dim)"/>
    </div>
  );
}

// Contact links list (TG / VK required; Steam / Discord optional)
const CONTACT_META = {
  tg:      { label: 'Telegram', icon: 'chat',   color: '#2AABEE' },
  vk:      { label: 'ВКонтакте',icon: 'globe',  color: '#5181B8' },
  steam:   { label: 'Steam',    icon: 'crosshair', color: '#A8C7E0' },
  discord: { label: 'Discord',  icon: 'mic',    color: '#7289DA' },
};
function ContactList({ contacts = {}, editable }) {
  const entries = Object.entries(CONTACT_META);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {entries.map(([key, meta]) => {
        const val = contacts[key];
        const has = !!val;
        return (
          <div key={key} style={{
            background: 'var(--surface)', borderRadius: 12,
            border: '1px solid var(--border)', padding: '10px 12px',
            display: 'flex', alignItems: 'center', gap: 12,
            opacity: has || editable ? 1 : 0.45,
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: has ? meta.color + '24' : 'var(--surface-3)',
              color: has ? meta.color : 'var(--text-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><Icon name={meta.icon} size={14} stroke={2}/></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 600 }}>{meta.label}</div>
              <div className="mono" style={{
                fontSize: 13, fontWeight: 600, marginTop: 2,
                color: has ? 'var(--text)' : 'var(--text-muted)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{has ? val : (editable ? 'добавить' : '—')}</div>
            </div>
            {editable && (
              <Icon name={has ? 'pencil' : 'plus'} size={15} color="var(--text-muted)"/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// CS2 detailed stats card — the centerpiece of every profile
function CS2StatsCard({ p }) {
  const peak = p.peak;
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 16,
      border: '1px solid var(--border)', overflow: 'hidden',
    }}>
      {/* top hero strip */}
      <div style={{
        padding: '14px 16px',
        background: 'linear-gradient(135deg, rgba(110,198,255,0.08), rgba(181,127,255,0.05))',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <EloBadge elo={p.elo} size="lg"/>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em' }}>Peak elo</div>
          <div className="mono" style={{ fontSize: 16, fontWeight: 700, marginTop: 2 }}>
            {peak.toLocaleString('ru')}
          </div>
        </div>
      </div>

      {/* role + side row */}
      <div style={{
        padding: '12px 16px',
        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10,
        borderBottom: '1px solid var(--border)',
      }}>
        <StatBlock label="Роль" value={p.role}/>
        <StatBlock label="Сайд" value={p.side}/>
        <StatBlock label="Часов" value={p.hours.toLocaleString('ru')} mono/>
      </div>

      {/* maps */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{
          fontSize: 10, color: 'var(--text-muted)', fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8,
        }}>Маппул · {p.maps.length}/9</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {p.maps.map(m => <MapChip key={m} name={m} mode="full"/>)}
        </div>
      </div>

      {/* play time */}
      <div style={{ padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.06em' }}>Когда играет</div>
          <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>{p.playTime}</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--accent-soft)', color: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="bell" size={16} stroke={2}/>
        </div>
      </div>
    </div>
  );
}

function StatBlock({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div className={mono ? 'mono' : ''} style={{
        fontSize: 14, fontWeight: 700, marginTop: 4, letterSpacing: '-0.01em',
      }}>{value}</div>
    </div>
  );
}

function RowAction({ icon, label, subtle, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: 'var(--surface)', borderRadius: 12,
      border: '1px solid var(--border)', padding: '13px 14px',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      color: subtle ? 'var(--text-dim)' : 'var(--text)',
    }}>
      <span style={{ color: subtle ? 'var(--text-dim)' : 'var(--accent)' }}>
        <Icon name={icon} size={18} stroke={2}/>
      </span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{label}</span>
      <Icon name="chev_r" size={16} color="var(--text-muted)"/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Profile detail — full screen overlay shown when expanding a card
// ─────────────────────────────────────────────────────────────
function ProfileDetailScreen({ profile, onClose, onLike, onPass, onSuper }) {
  if (!profile) return null;
  return (
    <div className="screen app-scroll" style={{
      background: 'var(--bg)', paddingBottom: 110,
      animation: 'match-fade 0.25s',
    }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: 460 }}>
        <window.HeroPlaceholder profile={profile} label="галерея фото"/>
        {/* Top controls */}
        <div style={{
          position: 'absolute', top: 50, left: 16, right: 16, zIndex: 10,
          display: 'flex', justifyContent: 'space-between',
        }}>
          <button onClick={onClose} style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(11,14,20,0.55)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}><Icon name="chev_d" size={20} stroke={2.2}/></button>
          <button style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'rgba(11,14,20,0.55)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.12)', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}><Icon name="flag" size={18}/></button>
        </div>
        {/* Photo indicators */}
        <div style={{
          position: 'absolute', top: 100, left: 16, right: 16, zIndex: 10,
          display: 'flex', gap: 4,
        }}>
          {[0,1,2].map((i) => (
            <div key={i} style={{
              flex: 1, height: 3, borderRadius: 2,
              background: i === 0 ? '#fff' : 'rgba(255,255,255,0.3)',
            }}/>
          ))}
        </div>
        {/* Bottom info on hero */}
        <div style={{
          position: 'absolute', bottom: 20, left: 16, right: 16, zIndex: 5, color: '#fff',
        }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {profile.online && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 8px 4px 7px', borderRadius: 6,
                background: 'rgba(11,14,20,0.55)', backdropFilter: 'blur(8px)',
                fontSize: 11, fontWeight: 600,
              }}>
                <span className="online-dot"/>online
              </span>
            )}
            <span style={{
              padding: '4px 8px', borderRadius: 6,
              background: 'rgba(11,14,20,0.55)', backdropFilter: 'blur(8px)',
              fontSize: 11, fontWeight: 600,
            }}>
              <Icon name="pin" size={11} stroke={2}/> {profile.region}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em' }}>{profile.name}</span>
            <span style={{ fontSize: 26, fontWeight: 600, opacity: 0.7 }}>{profile.age}</span>
          </div>
          <div className="mono" style={{ fontSize: 13, opacity: 0.7, marginTop: 2 }}>@{profile.nick}</div>
        </div>
      </div>

      {/* Bio */}
      <div style={{ padding: '18px 16px 0' }}>
        <Surface>
          <div style={{ fontSize: 15, lineHeight: 1.5 }}>{profile.bio}</div>
        </Surface>
      </div>

      <SectionTitle>Faceit</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <FaceitCard p={profile}/>
      </div>

      <SectionTitle>CS2 · профиль</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <CS2StatsCard p={profile}/>
      </div>

      <SectionTitle>Контакты</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <ContactList contacts={profile.contacts}/>
      </div>

      <SectionTitle>Что важно</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {profile.tags.map(t => <Tag key={t} accent icon="check">{t}</Tag>)}
      </div>

      <SectionTitle>Языки</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', gap: 6 }}>
        {profile.langs.map(l => <Tag key={l} icon="globe">{l}</Tag>)}
      </div>

      <SectionTitle>Параметры</SectionTitle>
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        <KV label="Регион" value={profile.region}/>
        <KV label="Пинг" value={profile.ping + 'ms'} mono/>
        <KV label="Дистанция" value={profile.distance}/>
        <KV label="Языки" value={profile.langs.join(', ')}/>
      </div>

      {/* Floating actions */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '14px 16px 24px',
        background: 'linear-gradient(to top, var(--bg) 60%, transparent)',
        display: 'flex', gap: 12, justifyContent: 'center',
      }}>
        <FAB icon="x" color="var(--dislike)" size={54} onClick={() => { onPass(profile); onClose(); }}/>
        <FAB icon="bolt" color="var(--super)" size={48} onClick={() => { onSuper(profile); onClose(); }}/>
        <FAB icon="heart" color="var(--like)" size={54} onClick={() => { onLike(profile); onClose(); }}/>
      </div>
    </div>
  );
}

function KV({ label, value, mono }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 12,
      border: '1px solid var(--border)', padding: '10px 12px',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div className={mono ? 'mono' : ''} style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{value}</div>
    </div>
  );
}

function FAB({ icon, color, size, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: size, height: size, borderRadius: '50%',
      background: 'var(--surface-2)', border: '1px solid var(--border-strong)',
      color: color, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
    }}>
      <Icon name={icon} size={size * 0.4} stroke={2.4}/>
    </button>
  );
}

Object.assign(window, { MyProfileScreen, ProfileDetailScreen, FaceitCard, ContactList });
