import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isDemoMode } from '../services/supabase'

interface Child { id: number; name: string; age: number; wish: string; details: string; emoji: string }

const CHILDREN: Child[] = [
  { id: 1, name: 'Болдарева Любовь', age: 4, wish: 'Магнитный танграм (игра)', details: 'https://l.kaspi.kz/shop/GkpuoQ9VjZ99etv', emoji: '🧸' },
  { id: 2, name: 'Болдарева Людмила', age: 7, wish: 'Кроссовки', details: 'Размер 31', emoji: '👟' },
  { id: 3, name: 'Болдарева Вераника', age: 10, wish: 'Спортивный костюм', details: 'Размер 40, рост 146-150', emoji: '🏃' },
  { id: 4, name: 'Болдарева Александра', age: 15, wish: 'Косметика', details: '', emoji: '💄' },
  { id: 5, name: 'Есбаев Пётр', age: 9, wish: 'Спортивная форма или футбольный мяч', details: 'Рост 135 см', emoji: '⚽' },
  { id: 6, name: 'Есбаев Даниил', age: 8, wish: 'Спортивная форма или волейбольный мяч', details: 'Рост 121 см', emoji: '🏐' },
  { id: 7, name: 'Есбаева Серафима', age: 11, wish: 'Кроссовки', details: 'Размер 38', emoji: '👟' },
  { id: 8, name: 'Есбаева Аннисия', age: 12, wish: 'Чёрный худи', details: 'Размер 44', emoji: '🖤' },
  { id: 9, name: 'Ргайбек Мерей', age: 12, wish: 'Нарядное платье', details: 'Размер 40, рост 146-150', emoji: '👗' },
  { id: 10, name: 'Жусупов Артур', age: 14, wish: 'Спортивный костюм', details: 'Рост 150, размер 40', emoji: '🏋️' },
  { id: 11, name: 'Алимжанов Мансур', age: 10, wish: 'Футбольная форма Реал Мадрид (Беллингем #5) или кроссовки-сороконожки', details: 'Рост 130 см, размер 35/36', emoji: '⚽' },
  { id: 12, name: 'Алимжанов Санжар', age: 8, wish: 'Футбольная форма Реал Мадрид (Роналду #7) или кроссовки-сороконожки', details: 'Рост 121 см, размер 33', emoji: '⚽' },
  { id: 13, name: 'Ратай Элеонора', age: 15, wish: 'Наушники Phone Planet Max', details: 'Чёрные', emoji: '🎧' },
  { id: 14, name: 'Сансызбай Амира', age: 3, wish: 'Танцевальный коврик', details: 'https://l.kaspi.kz/shop/9ZxBKKBb7QD7vTg', emoji: '💃' },
  { id: 15, name: 'Балтабай Акбота', age: 15, wish: 'Кроссовки ASICS', details: 'Нежно-розовые, размер 39', emoji: '👟' },
  { id: 16, name: 'Волочай Илья', age: 10, wish: 'Большая машинка на пульте управления', details: '', emoji: '🚗' },
  { id: 17, name: 'Ланг Кира', age: 3, wish: 'Коврик для рисования водой', details: 'https://l.kaspi.kz/shop/Gih3m8HPRrLwsf2', emoji: '🎨' },
  { id: 18, name: 'Мустафина Аделина', age: 8, wish: 'Джинсы или осенняя куртка', details: 'На 9-10 лет', emoji: '🧥' },
  { id: 19, name: 'Ланг Зарина', age: 9, wish: 'Нарядное платье', details: 'Размер 40, рост 150', emoji: '👗' },
  { id: 20, name: 'Ланг Тимур', age: 8, wish: 'Брючный костюм (тройка)', details: 'Размер 36, рост 130', emoji: '👔' },
  { id: 21, name: 'Мельничук Алина', age: 14, wish: 'Косметика', details: '', emoji: '💄' },
  { id: 22, name: 'Рахимбекова Айзере', age: 7, wish: 'Сумочка Hello Kitty и блокнот с мишкой', details: '', emoji: '👜' },
  { id: 23, name: 'Изтлеу Болат', age: 14, wish: 'Фитнес-резинки и гантели', details: '5-9 кг', emoji: '💪' },
  { id: 24, name: 'Ильмуратова Анель', age: 13, wish: 'Уход для волос и лица, ресницы OMG Individual Cluster Lashes', details: '', emoji: '✨' },
  { id: 25, name: 'Джекижан Алина', age: 14, wish: 'Уход для волос и ресницы Lucky Honey с клеем', details: '', emoji: '✨' },
  { id: 26, name: 'Халиева Адия', age: 10, wish: '3D-ручка', details: '', emoji: '🖊️' },
  { id: 27, name: 'Сардирдинова Хуснида', age: 15, wish: 'Плойка-выпрямитель или ресницы, тоналка Gabrin 103', details: '', emoji: '💅' },
  { id: 28, name: 'Сардирдинова Хайдига', age: 8, wish: 'Джазовый спортивный костюм хип-хоп + белые кроссовки', details: 'Костюм чёрный 134; кроссовки 34-35', emoji: '🕺' },
  { id: 29, name: 'Сардирдинова Мадина', age: 11, wish: 'Широкие серые штаны', details: 'Размер 40', emoji: '👖' },
  { id: 30, name: 'Сардирдинов Мухамадислам', age: 13, wish: 'Широкие серые штаны или белые кроссовки', details: 'Штаны р.42; кроссовки 37-38', emoji: '👟' },
]

// Confetti
function launchConfetti() {
  const canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999'
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')!
  canvas.width = window.innerWidth; canvas.height = window.innerHeight
  const pieces = Array.from({length: 120}, () => ({
    x: Math.random() * canvas.width, y: -20,
    w: 8 + Math.random() * 8, h: 4 + Math.random() * 4,
    color: ['#4ade80','#22c55e','#fbbf24','#f472b6','#60a5fa','#a78bfa'][Math.floor(Math.random()*6)],
    speed: 3 + Math.random() * 4, angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.3, wobble: Math.random() * 0.1,
  }))
  let frame = 0
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    pieces.forEach(p => {
      p.y += p.speed; p.angle += p.spin; p.x += Math.sin(p.wobble * frame) * 1.5
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle)
      ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height)
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h); ctx.restore()
    })
    frame++
    if (frame < 120) requestAnimationFrame(animate)
    else canvas.remove()
  }
  animate()
}

const ageWord = (n: number) => n === 1 ? 'год' : n < 5 ? 'года' : 'лет'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
      <div className="h-1 bg-gray-100"/>
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl"/>
          <div className="w-20 h-6 bg-gray-100 rounded-full"/>
        </div>
        <div className="h-4 bg-gray-100 rounded mb-2 w-3/4"/>
        <div className="h-3 bg-gray-100 rounded mb-4 w-1/4"/>
        <div className="h-16 bg-gray-100 rounded-xl mb-4"/>
        <div className="h-10 bg-gray-100 rounded-xl"/>
      </div>
    </div>
  )
}

export default function WishTreePage() {
  const [reserved, setReserved] = useState<Set<number>>(new Set())
  const [loadingDB, setLoadingDB] = useState(false) // cards show immediately, reserved status loads in background
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Child | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<'all'|'available'|'done'>('all')
  const [ageFilter, setAgeFilter] = useState<'all'|'3-6'|'7-11'|'12-15'>('all')
  const [sort, setSort] = useState<'default'|'age-asc'|'age-desc'>('default')
  const [scrolled, setScrolled] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!isDemoMode && supabase) {
      // 5s timeout — cards already visible, this just updates reserved status
      const timer = setTimeout(() => setLoadingDB(false), 5000)
      supabase.from('wish_reservations').select('child_id')
        .then(({ data }) => {
          clearTimeout(timer)
          if (data) setReserved(new Set(data.map((r: any) => r.child_id)))
          setLoadingDB(false)
        })
        .catch(() => { clearTimeout(timer); setLoadingDB(false) })
    } else { setLoadingDB(false) }
  }, [])

  // Swipe to close modal
  const touchStart = useRef(0)
  const onTouchStart = useCallback((e: React.TouchEvent) => { touchStart.current = e.touches[0].clientY }, [])
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (e.changedTouches[0].clientY - touchStart.current > 80) setSelected(null)
  }, [])

  let filtered = CHILDREN.filter(c => {
    const ms = c.name.toLowerCase().includes(search.toLowerCase()) || c.wish.toLowerCase().includes(search.toLowerCase())
    const mf = filter === 'all' || (filter === 'available' && !reserved.has(c.id)) || (filter === 'done' && reserved.has(c.id))
    const ma = ageFilter === 'all' || (ageFilter === '3-6' && c.age >= 3 && c.age <= 6) || (ageFilter === '7-11' && c.age >= 7 && c.age <= 11) || (ageFilter === '12-15' && c.age >= 12 && c.age <= 15)
    return ms && mf && ma
  })
  if (sort === 'age-asc') filtered = [...filtered].sort((a, b) => a.age - b.age)
  if (sort === 'age-desc') filtered = [...filtered].sort((a, b) => b.age - a.age)

  const openModal = (child: Child) => {
    setSelected(child); setSubmitted(false); setForm({ name: '', phone: '', message: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    // 1. Telegram FIRST — guaranteed delivery regardless of DB status
    const botToken = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN
    const chatId = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID
    if (botToken && chatId) {
      const det = selected.details && !selected.details.startsWith('http') ? `\n📋 ${selected.details}` : ''
      const msg = `🌳 *ДЕРЕВО ЖЕЛАНИЙ*\n\n👤 ${selected.name}, ${selected.age} лет\n🎁 ${selected.wish}${det}\n\n💝 Благотворитель: ${form.name}\n📞 ${form.phone}${form.message ? '\n💬 ' + form.message : ''}`
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }) }).catch(console.error)
    }
    // 2. Supabase AFTER — save to DB (non-blocking)
    if (!isDemoMode && supabase) {
      try {
        await supabase.from('wish_reservations').insert({ child_id: selected.id, donor_name: form.name, donor_phone: form.phone })
      } catch (e) { console.warn('DB save failed:', e) }
    }
    setReserved(prev => new Set([...prev, selected.id]))
    setSubmitting(false); setSubmitted(true)
    launchConfetti()
  }

  const available = CHILDREN.filter(c => !reserved.has(c.id)).length
  const done = 30 - available
  const pct = Math.round((done / 30) * 100)

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(160deg,#f0fdf4 0%,#dcfce7 60%,#f0fdf4 100%)'}}>
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
        @keyframes pulse-green { 0%,100% { box-shadow:0 0 0 0 rgba(34,197,94,0.4) } 50% { box-shadow:0 0 0 8px rgba(34,197,94,0) } }
        .card-enter { animation: fadeInUp 0.4s ease both }
        .sheet-enter { animation: slideUp 0.3s cubic-bezier(0.32,0.72,0,1) both }
      `}</style>

      {/* STICKY PROGRESS HEADER */}
      <div style={{
        position:'fixed',top:0,left:0,right:0,zIndex:100,
        transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
        transition:'transform 0.3s ease',
        background:'rgba(255,255,255,0.95)',backdropFilter:'blur(12px)',
        borderBottom:'1px solid rgba(34,197,94,0.15)',
        padding:'10px 16px',
      }}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{fontSize:20}}>🌳</span>
            <span className="font-bold text-gray-800 text-sm">Дерево желаний</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{background:'#dcfce7',height:6,width:100,borderRadius:99,overflow:'hidden'}}>
              <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#4ade80,#22c55e)',transition:'width 0.6s ease',borderRadius:99}}/>
            </div>
            <span className="text-xs font-bold text-green-600">{done}/30</span>
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#14532d 0%,#166534 50%,#15803d 100%)',paddingTop:60}} className="text-white">
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-8 text-center">
          <div style={{fontSize:64,lineHeight:1,filter:'drop-shadow(0 4px 12px rgba(0,0,0,0.3))'}} className="mb-4">🌳</div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Дерево желаний</h1>
          <p style={{color:'rgba(255,255,255,0.65)'}} className="text-sm mb-7">Центр поддержки детей акимата города Астана</p>

          <div className="flex justify-center gap-3 flex-wrap mb-6">
            {[{n:available,label:'ждут дарителя',icon:'💚'},{n:done,label:'мечты исполнены',icon:'⭐'},{n:30,label:'детей всего',icon:'👦'}].map(({n,label,icon})=>(
              <div key={label} style={{background:'rgba(255,255,255,0.12)',backdropFilter:'blur(12px)',border:'1px solid rgba(255,255,255,0.2)'}} className="rounded-2xl px-5 py-3 min-w-[90px]">
                <div style={{fontSize:20}} className="mb-0.5">{icon}</div>
                <div className="text-2xl font-black">{n}</div>
                <div style={{color:'rgba(255,255,255,0.65)',fontSize:11}} className="mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{color:'rgba(255,255,255,0.6)'}}>Прогресс</span>
              <span style={{color:'rgba(255,255,255,0.9)'}} className="font-bold">{pct}%</span>
            </div>
            <div style={{background:'rgba(255,255,255,0.15)',height:8,borderRadius:99,overflow:'hidden'}}>
              <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#4ade80,#22c55e)',transition:'width 0.8s ease',borderRadius:99,boxShadow:'0 0 8px rgba(74,222,128,0.6)'}}/>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* SEARCH + FILTERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-6">
          <div className="relative mb-3">
            <span style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',fontSize:16}}>🔍</span>
            <input type="text" placeholder="Поиск по имени или желанию..."
              value={search} onChange={e=>setSearch(e.target.value)}
              style={{paddingLeft:40}}
              className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"/>
          </div>

          <div className="flex gap-1.5 mb-2 overflow-x-auto pb-0.5" style={{scrollbarWidth:'none'}}>
            {([['all',`Все (${CHILDREN.length})`],['available',`✅ Свободные (${available})`],['done',`🎁 Исполненные (${done})`]] as const).map(([f,label])=>(
              <button key={f} onClick={()=>setFilter(f)} style={{whiteSpace:'nowrap'}}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter===f?'bg-green-600 text-white shadow-sm':'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-0.5" style={{scrollbarWidth:'none'}}>
            {([['all','👶 Все возрасты'],['3-6','3–6 лет'],['7-11','7–11 лет'],['12-15','12–15 лет']] as const).map(([f,label])=>(
              <button key={f} onClick={()=>setAgeFilter(f)} style={{whiteSpace:'nowrap'}}
                className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${ageFilter===f?'bg-emerald-500 text-white shadow-sm':'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                {label}
              </button>
            ))}
            <div style={{marginLeft:'auto',flexShrink:0}}>
              <select value={sort} onChange={e=>setSort(e.target.value as any)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-gray-50 text-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-green-400">
                <option value="default">↕ По умолчанию</option>
                <option value="age-asc">↑ Младшие первые</option>
                <option value="age-desc">↓ Старшие первые</option>
              </select>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loadingDB
            ? Array.from({length:6}).map((_,i)=><SkeletonCard key={i}/>)
            : filtered.map((child, idx) => {
              const isReserved = reserved.has(child.id)
              return (
                <div key={child.id} className="card-enter" style={{animationDelay:`${idx*40}ms`}}>
                  <div className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 ${isReserved?'border-gray-100':'border-green-100 hover:shadow-xl hover:-translate-y-1 hover:border-green-300'}`}
                    style={{position:'relative'}}>

                    {/* Reserved overlay */}
                    {isReserved && (
                      <div style={{position:'absolute',top:12,right:12,zIndex:2,background:'linear-gradient(135deg,#22c55e,#16a34a)',borderRadius:99,width:28,height:28,display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,boxShadow:'0 2px 8px rgba(34,197,94,0.4)'}}>
                        ✓
                      </div>
                    )}

                    <div className={`h-1.5 ${isReserved?'bg-gradient-to-r from-gray-200 to-gray-300':'bg-gradient-to-r from-green-400 to-emerald-500'}`}/>

                    <Link to={`/wish-tree/${child.id}`} className="block p-5 pb-3" style={{opacity: isReserved ? 0.7 : 1}}>
                      <div className="flex items-center justify-between mb-4">
                        <div style={{background:isReserved?'#f9fafb':'linear-gradient(135deg,#dcfce7,#bbf7d0)',fontSize:28,width:52,height:52,transition:'transform 0.2s'}} className="rounded-2xl flex items-center justify-center flex-shrink-0 hover:scale-110">
                          {child.emoji}
                        </div>
                        <span style={{fontSize:11}} className={`font-bold px-3 py-1 rounded-full ${isReserved?'bg-green-50 text-green-600 border border-green-100':'bg-gray-50 text-gray-500 border border-gray-100'}`}>
                          {isReserved?'✓ Исполнено':'Свободно'}
                        </span>
                      </div>
                      <div className="font-bold text-gray-800 text-base leading-tight">{child.name}</div>
                      <div className="text-xs text-gray-400 mb-3">{child.age} {ageWord(child.age)}</div>
                      <div style={{background:'linear-gradient(135deg,#f8fffe,#f0fdf4)',border:'1px solid #dcfce7'}} className="rounded-xl p-3">
                        <div style={{fontSize:10,letterSpacing:'0.08em'}} className="text-green-600 uppercase font-black mb-1">Мечта</div>
                        <div className="text-sm text-gray-700 font-semibold leading-snug">{child.wish}</div>
                        {child.details && !child.details.startsWith('http') && <div className="text-xs text-gray-400 mt-1">{child.details}</div>}
                        {child.details && child.details.startsWith('http') && <div className="text-xs text-blue-500 mt-1">🛒 Посмотреть на Kaspi</div>}
                      </div>
                    </Link>

                    <div className="px-5 pb-5 pt-2">
                      <button onClick={()=>!isReserved&&openModal(child)} disabled={isReserved}
                        style={!isReserved?{background:'linear-gradient(135deg,#22c55e,#16a34a)',boxShadow:'0 4px 12px rgba(34,197,94,0.35)'}:{background:'#f3f4f6'}}
                        className={`w-full py-3 rounded-xl text-sm font-black transition-all ${isReserved?'text-gray-400 cursor-not-allowed':'text-white active:scale-95 hover:opacity-90'}`}>
                        {isReserved?'Желание исполнено ✓':'💝 Исполнить желание'}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>

        {!loadingDB && filtered.length===0 && (
          <div className="text-center py-20">
            <div style={{fontSize:56}} className="mb-4">🔍</div>
            <div className="text-gray-400 text-sm">Ничего не найдено</div>
            <button onClick={()=>{setSearch('');setFilter('all');setAgeFilter('all')}} className="mt-4 px-5 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-semibold">Сбросить фильтры</button>
          </div>
        )}
      </div>

      {/* BOTTOM SHEET MODAL */}
      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.55)',backdropFilter:'blur(6px)',zIndex:200,display:'flex',alignItems:'flex-end',justifyContent:'center'}}
          onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div ref={sheetRef} className="sheet-enter bg-white w-full max-w-lg overflow-hidden"
            style={{borderRadius:'24px 24px 0 0',maxHeight:'92vh',overflowY:'auto'}}
            onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

            {/* Drag handle */}
            <div style={{display:'flex',justifyContent:'center',paddingTop:12,paddingBottom:4}}>
              <div style={{width:40,height:4,background:'#e5e7eb',borderRadius:99}}/>
            </div>

            {!submitted ? (
              <>
                <div style={{background:'linear-gradient(135deg,#14532d,#16a34a)'}} className="text-white mx-4 rounded-2xl p-5 mb-5">
                  <div style={{fontSize:40}} className="mb-2">{selected.emoji}</div>
                  <div className="font-black text-xl">{selected.name}</div>
                  <div style={{color:'rgba(255,255,255,0.75)'}} className="text-sm mt-1">🎁 {selected.wish}</div>
                  {selected.details && !selected.details.startsWith('http') && (
                    <div style={{background:'rgba(255,255,255,0.15)',borderRadius:10}} className="text-xs px-3 py-1.5 mt-2 inline-block">{selected.details}</div>
                  )}
                </div>
                <div className="px-4 pb-8">
                  <p className="text-sm text-gray-500 mb-4 text-center">Оставьте контакты — с вами свяжутся для передачи подарка</p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input required type="text" placeholder="Ваше имя *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"/>
                    <input required type="tel" placeholder="Номер телефона *" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"/>
                    <textarea placeholder="Сообщение (необязательно)" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 resize-none"/>
                    <div className="flex gap-3 pt-1">
                      <button type="button" onClick={()=>setSelected(null)} className="flex-1 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-semibold">Отмена</button>
                      <button type="submit" disabled={submitting}
                        style={{background:'linear-gradient(135deg,#22c55e,#16a34a)',boxShadow:'0 4px 12px rgba(34,197,94,0.4)'}}
                        className="flex-1 py-3.5 text-white rounded-xl text-sm font-black disabled:opacity-50">
                        {submitting?'Отправляем...':'💝 Подтвердить'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center px-6 py-10">
                <div style={{background:'linear-gradient(135deg,#dcfce7,#bbf7d0)',fontSize:52,width:88,height:88,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}} className="shadow-lg">🌟</div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">Спасибо!</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">Вы исполняете мечту ребёнка.<br/>С вами свяжутся для передачи подарка. 💚</p>
                <button onClick={()=>setSelected(null)} style={{background:'linear-gradient(135deg,#22c55e,#16a34a)',boxShadow:'0 4px 16px rgba(34,197,94,0.4)'}}
                  className="px-10 py-3.5 text-white rounded-xl font-black text-sm">Закрыть</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
