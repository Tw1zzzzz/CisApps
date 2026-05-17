// PARTY UP — Likes, Chats, Filters, Settings, Analytics, Onboarding
// Globals: LIKED_ME, MATCHES, Icon, Avatar, GameChip, Tag, SectionTitle, Surface

// ─────────────────────────────────────────────────────────────
// Likes screen
// ─────────────────────────────────────────────────────────────
function LikesScreen({ onOpenProfile }) {
  const [tab, setTab] = React.useState('incoming');
  const data = window.LIKED_ME;
  return (
    <div className="screen app-scroll" style={{ paddingBottom: 100 }}>
      <div style={{ padding: '54px 16px 14px' }}>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Лайки</div>
        <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>
          <span className="mono" style={{ color: 'var(--accent)' }}>{data.length}</span> человек хотят в твоё пати
        </div>
      </div>

      {/* segmented tabs */}
      <div style={{
        margin: '0 16px', padding: 4,
        background: 'var(--surface)', borderRadius: 12,
        border: '1px solid var(--border)',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4,
      }}>
        {['incoming', 'outgoing'].map(k => (
          <button key={k} onClick={() => setTab(k)} style={{
            padding: '9px 0', borderRadius: 8, border: 0, cursor: 'pointer',
            background: tab === k ? 'var(--surface-3)' : 'transparent',
            color: tab === k ? 'var(--text)' : 'var(--text-dim)',
            fontSize: 13, fontWeight: 700,
          }}>{k === 'incoming' ? 'Мне лайкнули' : 'Я лайкнул'}</button>
        ))}
      </div>

      {/* Sort/filter strip */}
      <div style={{ padding: '12px 16px 4px', display: 'flex', gap: 8, overflowX: 'auto' }}>
        {['Все', 'Онлайн', 'AWPer', 'IGL', 'Entry', 'Rifler', 'Support', 'Lurker'].map((f, i) => (
          <span key={f} style={{
            padding: '6px 12px', borderRadius: 8, whiteSpace: 'nowrap',
            background: i === 0 ? 'var(--accent-soft)' : 'var(--surface)',
            color: i === 0 ? 'var(--accent)' : 'var(--text-dim)',
            fontSize: 12, fontWeight: 600,
            border: '1px solid ' + (i === 0 ? 'transparent' : 'var(--border)'),
            cursor: 'pointer',
          }}>{f}</span>
        ))}
      </div>

      {/* Grid */}
      <div style={{
        padding: '14px 16px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {data.map(p => <LikeCard key={p.id} profile={p} onOpen={() => onOpenProfile && onOpenProfile(p)}/>)}
      </div>
    </div>
  );
}

function LikeCard({ profile, onOpen }) {
  return (
    <div onClick={onOpen} style={{
      borderRadius: 14, overflow: 'hidden', position: 'relative',
      aspectRatio: '0.78', cursor: 'pointer',
      background: `radial-gradient(circle at 30% 25%, hsl(${profile.hue} 65% 45%), hsl(${(profile.hue+40)%360} 60% 22%) 60%, hsl(${(profile.hue+80)%360} 55% 14%))`,
      border: '1px solid var(--border)',
    }}>
      {/* texture */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.06,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 14px, rgba(255,255,255,0.5) 14px 15px)',
      }}/>
      {/* big initial */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -55%)',
        fontSize: 110, fontWeight: 800, color: 'rgba(255,255,255,0.08)',
        letterSpacing: '-0.05em', lineHeight: 1,
      }}>{profile.name[0]}</div>
      {/* top right: role */}
      <div style={{ position: 'absolute', top: 8, right: 8 }}>
        <span className="mono" style={{
          fontSize: 9.5, fontWeight: 700,
          padding: '3px 6px', borderRadius: 5, letterSpacing: '0.04em',
          background: 'rgba(11,14,20,0.65)', color: '#fff',
          textTransform: 'uppercase',
        }}>{profile.role}</span>
      </div>
      {/* online */}
      {profile.online && (
        <div style={{
          position: 'absolute', top: 10, left: 10,
          width: 8, height: 8, borderRadius: '50%',
          background: 'var(--like)',
          boxShadow: '0 0 0 2px rgba(11,14,20,0.6)',
        }}/>
      )}
      {/* bottom gradient + info */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        padding: '24px 12px 10px',
        background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontSize: 14, fontWeight: 700 }}>{profile.name}</span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>{profile.age}</span>
        </div>
        <div className="mono" style={{ fontSize: 11, opacity: 0.85, marginTop: 2, fontWeight: 600 }}>
          {profile.elo.toLocaleString('ru')}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Chats screen
// ─────────────────────────────────────────────────────────────
function ChatsScreen({ onOpenChat }) {
  const matches = window.MATCHES;
  const newOnes = matches.filter(m => m.isNew);
  const chats = matches.filter(m => !m.isNew);
  return (
    <div className="screen app-scroll" style={{ paddingBottom: 100 }}>
      <div style={{ padding: '54px 16px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>Чаты</div>
          <div style={{ fontSize: 13, color: 'var(--text-dim)', marginTop: 4 }}>
            <span className="mono" style={{ color: 'var(--accent)' }}>{matches.length}</span> мэтчей · {chats.filter(c => c.unread > 0).length} непрочитано
          </div>
        </div>
        <button style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--text-dim)', display: 'inline-flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
        }}><Icon name="search" size={18}/></button>
      </div>

      {/* New matches row */}
      {newOnes.length > 0 && (
        <>
          <SectionTitle>Новые мэтчи</SectionTitle>
          <div style={{ padding: '0 16px 8px', display: 'flex', gap: 12, overflowX: 'auto' }}>
            {newOnes.concat(matches.slice(0, 3)).map((m, i) => (
              <div key={i} style={{ flexShrink: 0, textAlign: 'center', width: 64, cursor: 'pointer' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <div style={{
                    padding: 2, borderRadius: '50%',
                    background: i === 0 ? 'linear-gradient(135deg, var(--accent), var(--super))' : 'transparent',
                  }}>
                    <Avatar name={m.name} hue={m.hue} size={56}/>
                  </div>
                  {i === 0 && (
                    <div style={{
                      position: 'absolute', bottom: -2, right: -2,
                      background: 'var(--accent)', color: '#fff',
                      fontSize: 8.5, fontWeight: 700, padding: '2px 5px',
                      borderRadius: 4, border: '2px solid var(--bg)',
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}>new</div>
                  )}
                </div>
                <div style={{ fontSize: 11.5, marginTop: 6, fontWeight: 600,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
              </div>
            ))}
          </div>
        </>
      )}

      <SectionTitle>Сообщения</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {chats.map(c => <ChatRow key={c.id} chat={c} onClick={() => onOpenChat && onOpenChat(c)}/>)}
      </div>
    </div>
  );
}

function ChatRow({ chat, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 12px', borderRadius: 12,
      background: chat.unread > 0 ? 'rgba(42,171,238,0.05)' : 'transparent',
      cursor: 'pointer',
    }}>
      <div style={{ position: 'relative' }}>
        <Avatar name={chat.name} hue={chat.hue} size={48}/>
        {chat.online && (
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 12, height: 12, borderRadius: '50%',
            background: 'var(--like)',
            border: '2px solid var(--bg)',
          }}/>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700 }}>{chat.name}</span>
          <span className="mono" style={{
            fontSize: 9, fontWeight: 700, padding: '2px 5px', borderRadius: 4,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.06)', color: 'var(--text-dim)',
          }}>{chat.role}</span>
          <span className="mono" style={{
            fontSize: 10, fontWeight: 700, color: 'var(--text-muted)',
          }}>{chat.elo.toLocaleString('ru')}</span>
        </div>
        <div style={{
          fontSize: 13, color: chat.unread > 0 ? 'var(--text)' : 'var(--text-dim)',
          marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', fontWeight: chat.unread > 0 ? 600 : 400,
        }}>{chat.last}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{chat.time}</div>
        {chat.unread > 0 && (
          <div style={{
            marginTop: 4, display: 'inline-block',
            background: 'var(--accent)', color: '#fff',
            fontSize: 10, fontWeight: 700, fontFamily: 'var(--mono)',
            padding: '2px 6px', borderRadius: 8, minWidth: 18, textAlign: 'center',
          }}>{chat.unread}</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Filters modal
// ─────────────────────────────────────────────────────────────
function FiltersScreen({ filters, setFilters, onClose }) {
  const [local, setLocal] = React.useState(filters);
  const upd = (k, v) => setLocal(s => ({ ...s, [k]: v }));
  return (
    <div className="screen app-scroll" style={{ paddingBottom: 100, animation: 'match-fade 0.2s' }}>
      <div style={{ padding: '54px 16px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onClose} style={iconBtnS}><Icon name="close" size={18}/></button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Фильтры</div>
        <button onClick={() => setLocal({ role: 'all', region: 'EU+CIS', ageMin: 18, ageMax: 30, eloMin: 500, eloMax: 3000, maps: [], playTimes: [], onlyOnline: false, withMic: true })}
          style={{ background: 'transparent', border: 0, color: 'var(--accent)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Сброс</button>
      </div>

      <SectionTitle>Роль</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {['Все', ...window.ROLES].map(r => {
          const v = r === 'Все' ? 'all' : r;
          return (
            <button key={r} onClick={() => upd('role', v)} style={{
              padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
              border: '1px solid ' + (local.role === v ? 'var(--accent)' : 'var(--border)'),
              background: local.role === v ? 'var(--accent-soft)' : 'var(--surface)',
              color: local.role === v ? 'var(--accent)' : 'var(--text)',
              fontSize: 13, fontWeight: 600,
            }}>{r}</button>
          );
        })}
      </div>

      <SectionTitle>Premier rating</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <Surface>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Elo от — до</span>
            <span className="mono" style={{ fontSize: 14, fontWeight: 700 }}>
              {local.eloMin.toLocaleString('ru')}—{local.eloMax.toLocaleString('ru')}
            </span>
          </div>
          <RangeDual min={local.eloMin} max={local.eloMax}
            bound={[100, 3500]}
            onChange={(a, b) => setLocal(s => ({ ...s, eloMin: a, eloMax: b }))}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6,
            fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>
            <span>Lvl 1</span><span>Lvl 4</span><span>Lvl 7</span><span>Lvl 9</span><span>Lvl 10</span>
          </div>
        </Surface>
      </div>

      <SectionTitle>Маппул</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {window.ALL_MAPS.map(m => {
          const active = (local.maps || []).includes(m);
          return (
            <button key={m} onClick={() => {
              const cur = local.maps || [];
              upd('maps', active ? cur.filter(x => x !== m) : [...cur, m]);
            }} style={{
              padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
              border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border)'),
              background: active ? 'var(--accent-soft)' : 'var(--surface)',
              color: active ? 'var(--accent)' : 'var(--text)',
              fontSize: 13, fontWeight: 600,
            }}>{m}</button>
          );
        })}
      </div>

      <SectionTitle>Время игры</SectionTitle>
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
        {['Утром', 'Днём', 'Вечером', 'Ночью', 'Будни', 'Выходные'].map(s => {
          const cur = local.playTimes || [];
          const active = cur.includes(s);
          return (
            <button key={s} onClick={() => upd('playTimes', active ? cur.filter(x => x !== s) : [...cur, s])} style={{
              padding: '10px', borderRadius: 10, cursor: 'pointer',
              border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border)'),
              background: active ? 'var(--accent-soft)' : 'var(--surface)',
              color: active ? 'var(--accent)' : 'var(--text)',
              fontSize: 12.5, fontWeight: 600,
            }}>{s}</button>
          );
        })}
      </div>

      <SectionTitle>Регион</SectionTitle>
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {['EU West', 'EU East', 'CIS', 'RU', 'TR', 'EU+CIS'].map(r => (
          <button key={r} onClick={() => upd('region', r)} style={{
            padding: '10px', borderRadius: 10, cursor: 'pointer',
            border: '1px solid ' + (local.region === r ? 'var(--accent)' : 'var(--border)'),
            background: local.region === r ? 'var(--accent-soft)' : 'var(--surface)',
            color: local.region === r ? 'var(--accent)' : 'var(--text)',
            fontSize: 12.5, fontWeight: 600,
          }}>{r}</button>
        ))}
      </div>

      <SectionTitle>Возраст</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <Surface>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>Возраст</span>
            <span className="mono" style={{ fontSize: 14, fontWeight: 700 }}>{local.ageMin}—{local.ageMax}</span>
          </div>
          <RangeDual min={local.ageMin} max={local.ageMax}
            onChange={(a, b) => setLocal(s => ({ ...s, ageMin: a, ageMax: b }))}/>
        </Surface>
      </div>

      <SectionTitle>Дополнительно</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SwitchRow icon="bolt" label="Только онлайн" sub="Показывать активных сейчас"
          value={local.onlyOnline} onChange={v => upd('onlyOnline', v)}/>
        <SwitchRow icon="mic" label="С микрофоном" sub="Готовы голосом общаться"
          value={local.withMic} onChange={v => upd('withMic', v)}/>
        <SwitchRow icon="shield" label="Верифицированные" sub="Прошли проверку"
          value={local.verified} onChange={v => upd('verified', v)}/>
      </div>

      <div style={{ padding: '20px 16px 32px' }}>
        <button onClick={() => { setFilters(local); onClose(); }} className="btn-primary">
          Применить фильтры
        </button>
      </div>
    </div>
  );
}

function RangeDual({ min, max, onChange, bound = [18, 50] }) {
  const [bMin, bMax] = bound;
  const pctA = ((min - bMin) / (bMax - bMin)) * 100;
  const pctB = ((max - bMin) / (bMax - bMin)) * 100;
  return (
    <div style={{ position: 'relative', height: 28, padding: '0 4px' }}>
      <div style={{ position: 'absolute', top: 13, left: 0, right: 0, height: 3, borderRadius: 2,
        background: 'rgba(255,255,255,0.08)' }}/>
      <div style={{ position: 'absolute', top: 13, left: pctA + '%', right: (100 - pctB) + '%',
        height: 3, borderRadius: 2, background: 'var(--accent)' }}/>
      <input type="range" min={bMin} max={bMax} value={min}
        onChange={e => onChange(Math.min(+e.target.value, max - 1), max)}
        style={rangeStyle()}/>
      <input type="range" min={bMin} max={bMax} value={max}
        onChange={e => onChange(min, Math.max(+e.target.value, min + 1))}
        style={rangeStyle()}/>
    </div>
  );
}
const rangeStyle = () => ({
  position: 'absolute', top: 0, left: 0, right: 0,
  width: '100%', height: 28, margin: 0, padding: 0,
  background: 'transparent', appearance: 'none', WebkitAppearance: 'none',
  pointerEvents: 'none',
});

function SwitchRow({ icon, label, sub, value, onChange }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      background: 'var(--surface)', borderRadius: 12,
      border: '1px solid var(--border)', padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: value ? 'var(--accent-soft)' : 'var(--surface-3)',
        color: value ? 'var(--accent)' : 'var(--text-dim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name={icon} size={16} stroke={2}/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{label}</div>
        {sub && <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      <Switch value={value}/>
    </div>
  );
}

function Switch({ value }) {
  return (
    <div style={{
      width: 44, height: 26, borderRadius: 13,
      background: value ? 'var(--accent)' : 'var(--surface-3)',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: value ? 20 : 2,
        width: 22, height: 22, borderRadius: '50%',
        background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
      }}/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Settings screen
// ─────────────────────────────────────────────────────────────
function SettingsScreen({ onClose }) {
  return (
    <div className="screen app-scroll" style={{ paddingBottom: 100, animation: 'match-fade 0.2s' }}>
      <div style={{ padding: '54px 16px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onClose} style={iconBtnS}><Icon name="back" size={18}/></button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Настройки</div>
        <div style={{ width: 36 }}/>
      </div>

      <SectionTitle>Аккаунт</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SetRow icon="user" label="Telegram ID" value="@crowley" mono/>
        <SetRow icon="shield" label="Верификация" value="Не пройдена" highlight/>
        <SetRow icon="bell" label="Уведомления" value="Включены"/>
      </div>

      <SectionTitle>Приватность</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SetRow icon="eye_off" label="Невидимый режим" value="Выкл"/>
        <SetRow icon="globe" label="Регион по умолчанию" value="EU West"/>
        <SetRow icon="pin" label="Расстояние" value="до 50 км"/>
      </div>

      <SectionTitle>Поддержка</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SetRow icon="info" label="О приложении"/>
        <SetRow icon="flag" label="Правила сообщества"/>
        <SetRow icon="chat" label="Связаться с поддержкой"/>
      </div>

      <SectionTitle>Опасная зона</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SetRow icon="trash" label="Удалить аккаунт" danger/>
      </div>

      <div style={{ padding: '24px 16px', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>PARTY UP · v0.1.0</div>
      </div>
    </div>
  );
}

function SetRow({ icon, label, value, highlight, danger, mono }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 12,
      border: '1px solid var(--border)', padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: danger ? 'rgba(255,77,94,0.12)' : 'var(--surface-3)',
        color: danger ? 'var(--dislike)' : 'var(--text-dim)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name={icon} size={15} stroke={2}/></div>
      <div style={{ flex: 1, fontSize: 14, fontWeight: 600,
        color: danger ? 'var(--dislike)' : 'var(--text)' }}>{label}</div>
      {value && (
        <span className={mono ? 'mono' : ''} style={{
          fontSize: 13, color: highlight ? 'var(--warn)' : 'var(--text-dim)',
          fontWeight: 600,
        }}>{value}</span>
      )}
      <Icon name="chev_r" size={15} color="var(--text-muted)"/>
    </div>
  );
}

const iconBtnS = {
  width: 36, height: 36, borderRadius: 10,
  background: 'var(--surface)', border: '1px solid var(--border)',
  color: 'var(--text)', display: 'inline-flex',
  alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  padding: 0,
};

// ─────────────────────────────────────────────────────────────
// Moderation — admin-only queue
// ─────────────────────────────────────────────────────────────
function ModerationScreen({ onClose }) {
  const [queue, setQueue] = React.useState(window.MOD_QUEUE);
  const [filter, setFilter] = React.useState('all');
  const [openCard, setOpenCard] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const filtered = filter === 'all' ? queue : queue.filter(c => c.kind === filter);
  const counts = {
    new: queue.filter(c => c.kind === 'new').length,
    report: queue.filter(c => c.kind === 'report').length,
    photo: queue.filter(c => c.kind === 'photo').length,
    edit: queue.filter(c => c.kind === 'edit').length,
  };

  const handle = (id, verdict) => {
    setQueue(q => q.filter(c => c.id !== id));
    setOpenCard(null);
    setToast({ verdict, ts: Date.now() });
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="screen app-scroll" style={{ paddingBottom: 100, animation: 'match-fade 0.2s' }}>
      <div style={{ padding: '54px 16px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onClose} style={iconBtnS}><Icon name="back" size={18}/></button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Модерация</div>
        <span style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
          padding: '4px 8px', borderRadius: 6,
          background: 'rgba(255,177,61,0.14)', color: 'var(--warn)',
          fontFamily: 'var(--mono)', textTransform: 'uppercase',
        }}>admin</span>
      </div>

      {/* Stat strip */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <ModStat label="В очереди" value={queue.length} accent/>
        <ModStat label="Сегодня · ✓" value="142"/>
        <ModStat label="Сегодня · ✕" value="18"/>
      </div>

      {/* Filter chips */}
      <div style={{ padding: '14px 16px 4px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { k: 'all',    label: 'Все', count: queue.length },
          { k: 'new',    label: 'Новые', count: counts.new },
          { k: 'report', label: 'Жалобы', count: counts.report },
          { k: 'photo',  label: 'Фото', count: counts.photo },
          { k: 'edit',   label: 'Правки', count: counts.edit },
        ].map(f => (
          <button key={f.k} onClick={() => setFilter(f.k)} style={{
            padding: '7px 11px', borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap',
            background: filter === f.k ? 'var(--accent-soft)' : 'var(--surface)',
            color: filter === f.k ? 'var(--accent)' : 'var(--text-dim)',
            border: '1px solid ' + (filter === f.k ? 'transparent' : 'var(--border)'),
            fontSize: 12, fontWeight: 600,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {f.label}
            <span className="mono" style={{
              fontSize: 10, padding: '1px 5px', borderRadius: 4,
              background: filter === f.k ? 'rgba(42,171,238,0.18)' : 'rgba(255,255,255,0.05)',
            }}>{f.count}</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{
            padding: '32px 16px', textAlign: 'center', borderRadius: 12,
            background: 'var(--surface)', border: '1px dashed var(--border-strong)',
          }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>✓</div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>Очередь пуста</div>
          </div>
        )}
        {filtered.map(c => <ModCard key={c.id} item={c}
          onOpen={() => setOpenCard(c)}
          onApprove={() => handle(c.id, 'approve')}
          onReject={() => handle(c.id, 'reject')}/>)}
      </div>

      {/* Open card detail modal */}
      {openCard && (
        <ModDetailModal item={openCard}
          onClose={() => setOpenCard(null)}
          onApprove={() => handle(openCard.id, 'approve')}
          onReject={() => handle(openCard.id, 'reject')}
          onBan={() => handle(openCard.id, 'ban')}/>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', bottom: 96, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 16px', borderRadius: 10,
          background: toast.verdict === 'approve' ? 'var(--like)' : toast.verdict === 'ban' ? 'var(--super)' : 'var(--dislike)',
          color: '#fff', fontSize: 13, fontWeight: 700,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)', zIndex: 50,
          animation: 'match-fade 0.18s',
        }}>
          {toast.verdict === 'approve' ? '✓ Одобрено' : toast.verdict === 'ban' ? '⛔ Забанено' : '✕ Отклонено'}
        </div>
      )}
    </div>
  );
}

function ModStat({ label, value, accent }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 12,
      border: '1px solid var(--border)', padding: '10px 12px',
    }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div className="mono" style={{
        fontSize: 22, fontWeight: 800, marginTop: 4,
        color: accent ? 'var(--accent)' : 'var(--text)',
        letterSpacing: '-0.02em',
      }}>{value}</div>
    </div>
  );
}

const KIND_META = {
  new:    { label: 'Новая',   color: 'var(--accent)', icon: 'plus',  bg: 'rgba(42,171,238,0.12)' },
  report: { label: 'Жалоба',  color: 'var(--dislike)', icon: 'flag', bg: 'rgba(255,77,94,0.12)' },
  photo:  { label: 'Фото',    color: 'var(--warn)',   icon: 'eye',   bg: 'rgba(255,177,61,0.14)' },
  edit:   { label: 'Правка',  color: 'var(--super)',  icon: 'pencil', bg: 'rgba(181,127,255,0.14)' },
};

function ModCard({ item, onOpen, onApprove, onReject }) {
  const meta = KIND_META[item.kind];
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 14,
      border: '1px solid ' + (item.severity === 'high' ? 'rgba(255,77,94,0.3)' : 'var(--border)'),
      overflow: 'hidden',
    }}>
      {/* Top row */}
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
        cursor: 'pointer' }} onClick={onOpen}>
        <Avatar name={item.name} hue={item.hue} size={48}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 700 }}>{item.name}</span>
            <span style={{ fontSize: 13, color: 'var(--text-dim)' }}>{item.age}</span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>@{item.nick}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              padding: '2px 6px', borderRadius: 5,
              background: meta.bg, color: meta.color,
              fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em',
              textTransform: 'uppercase', fontFamily: 'var(--mono)',
            }}>
              <Icon name={meta.icon} size={10} stroke={2.2}/>{meta.label}
              {item.count && <span style={{ opacity: 0.7 }}>·{item.count}</span>}
            </span>
            <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.ts}</span>
          </div>
        </div>
        <Icon name="chev_r" size={16} color="var(--text-muted)"/>
      </div>

      <div style={{ padding: '0 14px 10px', display: 'flex', gap: 8 }}>
        <EloBadge elo={item.elo} size="sm"/>
        <RoleChip role={item.role}/>
      </div>

      <div style={{
        padding: '10px 14px',
        background: 'rgba(255,255,255,0.02)',
        borderTop: '1px solid var(--border)',
        fontSize: 12.5, color: 'var(--text-dim)',
      }}>
        <span style={{ color: 'var(--text-muted)' }}>Причина: </span>
        <span style={{ color: 'var(--text)', fontWeight: 600 }}>{item.reason}</span>
      </div>

      <div style={{ padding: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
        borderTop: '1px solid var(--border)' }}>
        <button onClick={onReject} style={modActionBtn('reject')}>
          <Icon name="x" size={15} stroke={2.4}/>Отклонить
        </button>
        <button onClick={onApprove} style={modActionBtn('approve')}>
          <Icon name="check" size={15} stroke={2.4}/>Одобрить
        </button>
      </div>
    </div>
  );
}

const modActionBtn = (kind) => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
  background: kind === 'approve' ? 'rgba(78,203,113,0.12)' : 'rgba(255,77,94,0.10)',
  border: '1px solid ' + (kind === 'approve' ? 'rgba(78,203,113,0.28)' : 'rgba(255,77,94,0.24)'),
  color: kind === 'approve' ? 'var(--like)' : 'var(--dislike)',
  fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em',
});

function ModDetailModal({ item, onClose, onApprove, onReject, onBan }) {
  const meta = KIND_META[item.kind];
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80,
      background: 'rgba(8,10,16,0.85)', backdropFilter: 'blur(10px)',
      animation: 'match-fade 0.2s',
      display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: 'var(--bg)',
        borderRadius: '20px 20px 0 0',
        border: '1px solid var(--border)',
        animation: 'slide-up 0.28s cubic-bezier(.2,.8,.2,1)',
        maxHeight: '85%', overflow: 'auto',
      }}>
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
          <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--surface-3)' }}/>
        </div>

        <div style={{ padding: '8px 18px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={item.name} hue={item.hue} size={56}/>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontSize: 18, fontWeight: 800 }}>{item.name}</span>
              <span style={{ fontSize: 16, color: 'var(--text-dim)' }}>{item.age}</span>
            </div>
            <div className="mono" style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              @{item.nick} · {item.faceitNick ? 'faceit ✓' : 'без faceit'}
            </div>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 6,
            background: meta.bg, color: meta.color,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
            textTransform: 'uppercase', fontFamily: 'var(--mono)',
          }}>
            <Icon name={meta.icon} size={11} stroke={2.2}/>{meta.label}
          </span>
        </div>

        <div style={{ padding: '0 18px 14px', display: 'flex', gap: 8 }}>
          <EloBadge elo={item.elo} size="md"/>
          <RoleChip role={item.role}/>
        </div>

        <div style={{ padding: '0 18px' }}>
          <Surface padding={14}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Причина</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{item.reason}</div>
            {item.count && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-dim)' }}>
                Повторов жалобы: <span className="mono" style={{ color: 'var(--dislike)' }}>{item.count}</span>
              </div>
            )}
          </Surface>
        </div>

        <div style={{ padding: '14px 18px 0' }}>
          <Surface padding={14}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Запись действий</div>
            {[
              { ts: 'сейчас', text: 'Открыто модератором' },
              { ts: item.ts, text: 'Поставлено в очередь · авто' },
              { ts: '2 дн', text: 'Регистрация в боте' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '6px 0' }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', minWidth: 50 }}>
                  {row.ts}
                </span>
                <span style={{ fontSize: 12.5 }}>{row.text}</span>
              </div>
            ))}
          </Surface>
        </div>

        <div style={{ padding: '20px 18px 24px', display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <button onClick={onReject} style={modActionBtn('reject')}>
            <Icon name="x" size={15} stroke={2.4}/>Откл.
          </button>
          <button onClick={onBan} style={{
            ...modActionBtn('reject'),
            background: 'rgba(181,127,255,0.10)',
            border: '1px solid rgba(181,127,255,0.32)',
            color: 'var(--super)',
          }}>
            <Icon name="shield" size={15} stroke={2.2}/>Бан
          </button>
          <button onClick={onApprove} style={modActionBtn('approve')}>
            <Icon name="check" size={15} stroke={2.4}/>Одобр.
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Analytics — admin only
// ─────────────────────────────────────────────────────────────
function AnalyticsScreen({ onClose }) {
  const series = [12, 18, 14, 26, 24, 32, 38, 30, 42, 48, 52, 60, 56, 68, 72];
  const max = Math.max(...series);
  const ranks = [
    { name: 'Lvl 10 (2001+)',    pct: 6,  color: '#FFD24D' },
    { name: 'Lvl 8–9 (1531–2000)', pct: 18, color: '#FF8FA0' },
    { name: 'Lvl 6–7 (1201–1530)', pct: 34, color: '#6EC6FF' },
    { name: 'Lvl 4–5 (901–1200)',  pct: 26, color: '#A8E6C5' },
    { name: 'Lvl 1–3 (<900)',      pct: 16, color: '#9AA3B5' },
  ];
  return (
    <div className="screen app-scroll" style={{ paddingBottom: 100, animation: 'match-fade 0.2s' }}>
      <div style={{ padding: '54px 16px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onClose} style={iconBtnS}><Icon name="back" size={18}/></button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Аналитика</div>
        <span style={{
          fontSize: 9.5, fontWeight: 700, letterSpacing: '0.08em',
          padding: '4px 8px', borderRadius: 6,
          background: 'rgba(255,177,61,0.14)', color: 'var(--warn)',
          fontFamily: 'var(--mono)', textTransform: 'uppercase',
        }}>admin</span>
      </div>

      {/* KPIs */}
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        <KPI label="Активных за 24ч" value="14 820" delta="+8.4%"/>
        <KPI label="Новые регистрации" value="486" delta="+12.1%"/>
        <KPI label="Мэтчей сегодня" value="3 211" delta="+4.7%"/>
        <KPI label="Сообщений" value="58 401" delta="-2.1%" down/>
      </div>

      <SectionTitle>DAU · последние 15 дней</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <Surface padding={16}>
          <div style={{
            display: 'flex', alignItems: 'flex-end', gap: 4, height: 110,
          }}>
            {series.map((v, i) => (
              <div key={i} style={{ flex: 1, position: 'relative', height: '100%', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{
                  width: '100%',
                  height: `${(v / max) * 100}px`,
                  background: i === series.length - 1
                    ? 'linear-gradient(to top, var(--accent), #6ec6ff)'
                    : 'rgba(42,171,238,0.22)',
                  borderRadius: 3,
                  border: '1px solid ' + (i === series.length - 1 ? 'transparent' : 'rgba(42,171,238,0.15)'),
                }}/>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8,
            fontFamily: 'var(--mono)', fontSize: 9.5, color: 'var(--text-muted)' }}>
            <span>3 май</span><span>10 май</span><span>сегодня</span>
          </div>
        </Surface>
      </div>

      <SectionTitle>Распределение по рейтингу</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <Surface padding={14}>
          {/* Stacked bar */}
          <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden',
            border: '1px solid var(--border)' }}>
            {ranks.map(g => (
              <div key={g.name} style={{ width: g.pct + '%', background: g.color, opacity: 0.7 }}/>
            ))}
          </div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ranks.map(g => (
              <div key={g.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{
                  width: 12, height: 12, borderRadius: 3, display: 'inline-block',
                  background: g.color, opacity: 0.8,
                }}/>
                <span style={{ flex: 1, fontSize: 13 }}>{g.name}</span>
                <span className="mono" style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-dim)' }}>{g.pct}%</span>
              </div>
            ))}
          </div>
        </Surface>
      </div>

      <SectionTitle>Воронка</SectionTitle>
      <div style={{ padding: '0 16px' }}>
        <Surface padding={14}>
          {[
            { label: 'Открыли бота', value: 24818, pct: 100 },
            { label: 'Создали анкету', value: 18402, pct: 74 },
            { label: 'Хотя бы 1 свайп', value: 16108, pct: 65 },
            { label: '≥1 мэтч', value: 9220, pct: 37 },
            { label: '≥1 сообщение', value: 6480, pct: 26 },
          ].map((row, i) => (
            <div key={row.label} style={{ marginBottom: i === 4 ? 0 : 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                fontSize: 12.5, marginBottom: 4 }}>
                <span style={{ color: 'var(--text)', fontWeight: 600 }}>{row.label}</span>
                <span className="mono" style={{ color: 'var(--text-dim)' }}>{row.value.toLocaleString('ru')} · {row.pct}%</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.05)' }}>
                <div style={{
                  height: '100%', width: row.pct + '%', borderRadius: 3,
                  background: 'linear-gradient(to right, var(--accent), var(--super))',
                }}/>
              </div>
            </div>
          ))}
        </Surface>
      </div>

      <SectionTitle>Модерация · очередь</SectionTitle>
      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <ModRow type="report" who="@spam_alex" reason="Спам в чате" count={4}/>
        <ModRow type="photo" who="@ghost_p" reason="Фото на проверке" />
        <ModRow type="report" who="@toxic_one" reason="Токсичность" count={2}/>
      </div>
    </div>
  );
}

function KPI({ label, value, delta, down }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 12,
      border: '1px solid var(--border)', padding: '12px 14px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600,
        textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
      <div className="mono" style={{ fontSize: 22, fontWeight: 700, marginTop: 6, letterSpacing: '-0.02em' }}>{value}</div>
      <div className="mono" style={{
        fontSize: 11, fontWeight: 700, marginTop: 2,
        color: down ? 'var(--dislike)' : 'var(--like)',
      }}>{delta}</div>
    </div>
  );
}

function ModRow({ type, who, reason, count }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 12,
      border: '1px solid var(--border)', padding: '12px 14px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 9,
        background: type === 'report' ? 'rgba(255,77,94,0.12)' : 'rgba(255,177,61,0.14)',
        color: type === 'report' ? 'var(--dislike)' : 'var(--warn)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}><Icon name={type === 'report' ? 'flag' : 'eye'} size={15} stroke={2}/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mono" style={{ fontSize: 13, fontWeight: 700 }}>{who}</div>
        <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginTop: 2 }}>{reason}</div>
      </div>
      {count && (
        <span className="mono" style={{
          background: 'var(--surface-3)', color: 'var(--text)',
          fontSize: 11, fontWeight: 700,
          padding: '3px 7px', borderRadius: 6,
        }}>×{count}</span>
      )}
      <button style={{
        background: 'var(--accent)', color: '#fff', border: 0,
        padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700,
        cursor: 'pointer',
      }}>Открыть</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Onboarding — 4 steps
// ─────────────────────────────────────────────────────────────
function OnboardingScreen({ onComplete }) {
  const [step, setStep] = React.useState(0);
  const [data, setData] = React.useState({
    name: '', age: 22, region: 'EU West',
    faceitNick: '', faceitUrl: '', elo: 1500, useManualElo: false,
    role: '', maps: [],
    tg: '', vk: '', steam: '', discord: '',
  });
  const TOTAL = 5;
  const upd = (k, v) => setData(s => ({ ...s, [k]: v }));
  const next = () => step < TOTAL - 1 ? setStep(step + 1) : onComplete(data);
  const back = () => step > 0 && setStep(step - 1);

  // step-by-step validation
  const canAdvance = (
    step === 0 ? (data.name.trim().length > 0) :
    step === 1 ? (data.faceitNick.trim().length > 0 && (data.faceitUrl.trim().length > 0 || data.elo > 0)) :
    step === 2 ? (data.role && data.maps.length > 0) :
    step === 3 ? (data.tg.trim().length > 0 || data.vk.trim().length > 0) :
    true
  );

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Progress */}
      <div style={{ padding: '54px 16px 14px',
        display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={back} disabled={step === 0} style={{
          ...iconBtnS, opacity: step === 0 ? 0 : 1,
        }}><Icon name="back" size={18}/></button>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.06)', display: 'flex', gap: 4 }}>
          {Array.from({ length: TOTAL }).map((_, i) => (
            <div key={i} style={{
              flex: 1, borderRadius: 2,
              background: i <= step ? 'var(--accent)' : 'transparent',
              transition: 'background 0.3s',
            }}/>
          ))}
        </div>
        <div className="mono" style={{ fontSize: 11, color: 'var(--text-dim)', minWidth: 28 }}>
          {step + 1}/{TOTAL}
        </div>
      </div>

      <div style={{ flex: 1, padding: '8px 16px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        {step === 0 && <OnbStep1 data={data} upd={upd}/>}
        {step === 1 && <OnbStepFaceit data={data} upd={upd}/>}
        {step === 2 && <OnbStep3 data={data} upd={upd}/>}
        {step === 3 && <OnbStepContacts data={data} upd={upd}/>}
        {step === 4 && <OnbStep4 data={data}/>}
      </div>

      <div style={{ padding: '12px 16px 32px' }}>
        <button className="btn-primary" onClick={next}
          disabled={!canAdvance}
          style={{ opacity: canAdvance ? 1 : 0.5 }}>
          {step === TOTAL - 1 ? 'Начать искать' : 'Продолжить'}
        </button>
      </div>
    </div>
  );
}

function OnbStep1({ data, upd }) {
  const regions = ['EU West', 'EU East', 'CIS', 'RU', 'TR'];
  return (
    <>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 12 }}>
        Немного о тебе
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.4 }}>
        Никнейм, возраст и регион. Из этого подбирается пинг и язык.
      </div>

      <div style={{ marginTop: 22 }}>
        <FieldLabel>Игровой ник</FieldLabel>
        <input value={data.name} onChange={e => upd('name', e.target.value)}
          placeholder="Например, shadowclap"
          style={inputStyle}/>
      </div>

      <div style={{ marginTop: 16 }}>
        <FieldLabel>Возраст <span className="mono" style={{ color: 'var(--accent)', fontWeight: 700 }}>{data.age}</span></FieldLabel>
        <input type="range" min={16} max={45} value={data.age}
          onChange={e => upd('age', +e.target.value)}
          style={{ width: '100%' }}/>
      </div>

      <div style={{ marginTop: 16 }}>
        <FieldLabel>Регион</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {regions.map(r => (
            <button key={r} onClick={() => upd('region', r)} style={{
              padding: '10px', borderRadius: 10, cursor: 'pointer',
              border: '1px solid ' + (data.region === r ? 'var(--accent)' : 'var(--border)'),
              background: data.region === r ? 'var(--accent-soft)' : 'var(--surface)',
              color: data.region === r ? 'var(--accent)' : 'var(--text)',
              fontSize: 13, fontWeight: 600,
            }}>{r}</button>
          ))}
        </div>
      </div>
    </>
  );
}

function OnbStepFaceit({ data, upd }) {
  return (
    <>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 12 }}>
        Подключи Faceit
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.4 }}>
        Для верификации и авто-elo. Если ссылка не работает — введи elo вручную.
      </div>

      <div style={{ marginTop: 22 }}>
        <FieldLabel required>Faceit никнейм</FieldLabel>
        <input value={data.faceitNick} onChange={e => upd('faceitNick', e.target.value)}
          placeholder="например, sh4dowclap" style={inputStyle}/>
      </div>

      <div style={{ marginTop: 16 }}>
        <FieldLabel>Ссылка на Faceit</FieldLabel>
        <div style={{ position: 'relative' }}>
          <span className="mono" style={{
            position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', fontSize: 13, pointerEvents: 'none',
          }}>faceit.com/</span>
          <input value={data.faceitUrl} onChange={e => upd('faceitUrl', e.target.value)}
            placeholder="en/players/…"
            style={{ ...inputStyle, paddingLeft: 95, fontFamily: 'var(--mono)', fontSize: 13 }}/>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
          {data.faceitUrl ? '· Подтянем elo автоматически' : '· Необязательно если укажешь elo ниже'}
        </div>
      </div>

      <div style={{
        marginTop: 16, padding: 14,
        background: 'var(--surface)', borderRadius: 12,
        border: '1px solid ' + (!data.faceitUrl ? 'var(--accent)' : 'var(--border)'),
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            ELO {!data.faceitUrl && <span style={{ color: 'var(--accent)' }}>· введи вручную</span>}
          </span>
          <span className="mono" style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)' }}>
            {data.elo}
          </span>
        </div>
        <input type="range" min={100} max={3500} step={10} value={data.elo}
          onChange={e => upd('elo', +e.target.value)} style={{ width: '100%' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6,
          fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-muted)' }}>
          <span>Lvl 1</span><span>Lvl 4</span><span>Lvl 7</span><span>Lvl 10</span>
        </div>
      </div>
    </>
  );
}

function FieldLabel({ children, required }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: 'var(--text-dim)',
      textTransform: 'uppercase', letterSpacing: '0.06em',
      marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4,
    }}>
      {children}
      {required && <span style={{ color: 'var(--dislike)' }}>∗</span>}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '13px 14px',
  background: 'var(--surface)', border: '1px solid var(--border)',
  borderRadius: 12, color: 'var(--text)', fontSize: 14, fontWeight: 600,
  outline: 'none', fontFamily: 'var(--font)',
};

function OnbStepContacts({ data, upd }) {
  return (
    <>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 12 }}>
        Как тебе написать
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.4 }}>
        Мэтчам нужен хотя бы один канал связи. Steam/Discord — опционально.
      </div>

      <div style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <ContactInput label="Telegram" icon="chat" color="#2AABEE" required
          placeholder="@username" value={data.tg} onChange={v => upd('tg', v)}/>
        <ContactInput label="ВКонтакте" icon="globe" color="#5181B8" required
          placeholder="vk.com/id…" value={data.vk} onChange={v => upd('vk', v)}/>
        <ContactInput label="Steam" icon="crosshair" color="#A8C7E0"
          placeholder="steamcommunity.com/id/…" value={data.steam} onChange={v => upd('steam', v)}/>
        <ContactInput label="Discord" icon="mic" color="#7289DA"
          placeholder="username#0000" value={data.discord} onChange={v => upd('discord', v)}/>
      </div>

      <div style={{
        marginTop: 16, padding: '10px 12px', borderRadius: 10,
        background: 'rgba(255,177,61,0.08)', border: '1px solid rgba(255,177,61,0.18)',
        fontSize: 12, color: 'var(--warn)', display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <Icon name="info" size={14} stroke={2}/>
        <span style={{ color: 'var(--text-dim)' }}>
          Telegram <b>или</b> ВКонтакте — обязательны. Остальные видны только после мэтча.
        </span>
      </div>
    </>
  );
}

function ContactInput({ label, icon, color, required, placeholder, value, onChange }) {
  return (
    <div style={{
      background: 'var(--surface)', borderRadius: 12,
      border: '1px solid ' + (value ? color + '55' : 'var(--border)'),
      padding: '10px 12px',
      display: 'flex', alignItems: 'center', gap: 10,
      transition: 'border 0.15s',
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: color + '22', color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}><Icon name={icon} size={14} stroke={2}/></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4 }}>
          {label} {required && <span style={{ color: 'var(--dislike)' }}>∗</span>}
        </div>
        <input value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="mono"
          style={{
            width: '100%', background: 'transparent', border: 0,
            color: 'var(--text)', fontSize: 13, fontWeight: 600,
            outline: 'none', padding: '2px 0',
          }}/>
      </div>
      {value && <Icon name="check" size={14} stroke={2.4} color={color}/>}
    </div>
  );
}

function OnbStep3({ data, upd }) {
  const toggleMap = (m) => {
    const has = data.maps.includes(m);
    upd('maps', has ? data.maps.filter(x => x !== m) : [...data.maps, m]);
  };
  return (
    <>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginTop: 12 }}>
        Как ты играешь
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.4 }}>
        Роль и маппул. Нужно выбрать хотя бы 1 карту.
      </div>

      <div style={{ marginTop: 22 }}>
        <FieldLabel required>Основная роль</FieldLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
          {window.ROLES.map(r => {
            const active = data.role === r;
            return (
              <button key={r} onClick={() => upd('role', r)} style={{
                padding: '12px 12px', borderRadius: 12, cursor: 'pointer',
                border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border)'),
                background: active ? 'var(--accent-soft)' : 'var(--surface)',
                color: 'var(--text)', textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <Icon name="crosshair" size={14} stroke={2.2}
                  color={active ? 'var(--accent)' : 'var(--text-dim)'}/>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{r}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <FieldLabel required>Маппул · {data.maps.length}/9</FieldLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {window.ALL_MAPS.map(m => {
            const active = data.maps.includes(m);
            return (
              <button key={m} onClick={() => toggleMap(m)} style={{
                padding: '8px 12px', borderRadius: 10, cursor: 'pointer',
                border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border)'),
                background: active ? 'var(--accent-soft)' : 'var(--surface)',
                color: active ? 'var(--accent)' : 'var(--text)',
                fontSize: 13, fontWeight: 600,
              }}>{m}</button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function OnbStep4({ data }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 30 }}>
      <div style={{
        width: 92, height: 92, borderRadius: 24,
        background: 'linear-gradient(135deg, var(--accent), var(--super))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 20px 60px rgba(42,171,238,0.4)',
        marginBottom: 24,
      }}>
        <Icon name="crosshair" size={48} color="#fff" stroke={2.2}/>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em' }}>
        Готово, {data.name || 'тиммейт'}
      </div>
      <div style={{ fontSize: 14, color: 'var(--text-dim)', marginTop: 12, lineHeight: 1.5, maxWidth: 280 }}>
        Подобрали анкеты по твоему региону и ближайшему брекету. Свайпай вправо, кто понравился — мы соединим в чат.
      </div>
      <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
        {data.role && <Tag accent icon="crosshair">{data.role}</Tag>}
        <Tag icon="chart">{data.elo.toLocaleString('ru')} elo</Tag>
        {data.maps.slice(0, 4).map(m => <Tag key={m}>{m}</Tag>)}
        {data.maps.length > 4 && <Tag>+{data.maps.length - 4}</Tag>}
      </div>
    </div>
  );
}

Object.assign(window, {
  LikesScreen, ChatsScreen, FiltersScreen, SettingsScreen, AnalyticsScreen, OnboardingScreen, ModerationScreen,
});
