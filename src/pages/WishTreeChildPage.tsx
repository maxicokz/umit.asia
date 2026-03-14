import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, isDemoMode } from '../services/supabase'

interface Child { id: number; name: string; age: number; wish: string; details: string; emoji: string }

const CHILDREN: Child[] = [
  { id: 1, name: 'Болдарева Любовь', age: 4, wish: 'Магнитный танграм', details: 'https://l.kaspi.kz/shop/GkpuoQ9VjZ99etv', emoji: '🧸' },
  { id: 2, name: 'Болдарева Людмила', age: 7, wish: 'Кроссовки', details: 'Размер 31', emoji: '👟' },
  { id: 3, name: 'Болдарева Вероника', age: 10, wish: 'Спортивный костюм', details: 'Размер 40, рост 146-150', emoji: '🏃' },
  { id: 4, name: 'Болдарева Александра', age: 15, wish: 'Косметика', details: '', emoji: '💄' },
  { id: 5, name: 'Есбаев Пётр', age: 9, wish: 'Спортивная форма или мяч', details: 'Рост 135 см', emoji: '⚽' },
  { id: 6, name: 'Есбаев Даниил', age: 8, wish: 'Спортивная форма или мяч', details: 'Рост 121 см', emoji: '🏐' },
  { id: 7, name: 'Есбаева Серафима', age: 11, wish: 'Кроссовки', details: 'Размер 38', emoji: '👟' },
  { id: 8, name: 'Есбаева Аннисия', age: 12, wish: 'Чёрный худи', details: 'Размер 44', emoji: '🖤' },
  { id: 9, name: 'Ргайбек Мерей', age: 12, wish: 'Нарядное платье', details: 'Размер 40, рост 146-150', emoji: '👗' },
  { id: 10, name: 'Жусупов Артур', age: 14, wish: 'Спортивный костюм', details: 'Рост 150, размер 40', emoji: '🏋️' },
  { id: 11, name: 'Алимжанов Мансур', age: 10, wish: 'Форма Реал Мадрид или бутсы', details: 'Рост 130, размер 35/36', emoji: '⚽' },
  { id: 12, name: 'Алимжанов Санжар', age: 8, wish: 'Форма Реал Мадрид или бутсы', details: 'Рост 121, размер 33', emoji: '⚽' },
  { id: 13, name: 'Ратай Элеонора', age: 15, wish: 'Наушники Phone Planet Max', details: 'Чёрные', emoji: '🎧' },
  { id: 14, name: 'Сансызбай Амира', age: 3, wish: 'Танцевальный коврик', details: 'https://l.kaspi.kz/shop/9ZxBKKBb7QD7vTg', emoji: '💃' },
  { id: 15, name: 'Балтабай Акбота', age: 15, wish: 'Кроссовки ASICS', details: 'Нежно-розовые, размер 39', emoji: '👟' },
  { id: 16, name: 'Волочай Илья', age: 10, wish: 'Машинка на пульте', details: 'Большая', emoji: '🚗' },
  { id: 17, name: 'Ланг Кира', age: 3, wish: 'Коврик для рисования водой', details: 'https://l.kaspi.kz/shop/Gih3m8HPRrLwsf2', emoji: '🎨' },
  { id: 18, name: 'Мустафина Аделина', age: 8, wish: 'Джинсы или куртка', details: 'На 9-10 лет', emoji: '🧥' },
  { id: 19, name: 'Ланг Зарина', age: 9, wish: 'Нарядное платье', details: 'Размер 40, рост 150', emoji: '👗' },
  { id: 20, name: 'Ланг Тимур', age: 8, wish: 'Брючный костюм (тройка)', details: 'Размер 36, рост 130', emoji: '👔' },
  { id: 21, name: 'Мельничук Алина', age: 14, wish: 'Косметика', details: '', emoji: '💄' },
  { id: 22, name: 'Рахимбекова Айзере', age: 7, wish: 'Сумочка Hello Kitty и блокнот', details: 'С мишкой', emoji: '👜' },
  { id: 23, name: 'Изтлеу Болат', age: 14, wish: 'Фитнес-резинки и гантели', details: '5-9 кг', emoji: '💪' },
  { id: 24, name: 'Ильмуратова Анель', age: 13, wish: 'Уход для волос и ресницы', details: 'Individual Cluster Lashes', emoji: '✨' },
  { id: 25, name: 'Джекижан Алина', age: 14, wish: 'Уход для волос и ресницы', details: 'Lucky Honey с клеем', emoji: '✨' },
  { id: 26, name: 'Халиева Адия', age: 10, wish: '3D-ручка', details: '', emoji: '🖊️' },
  { id: 27, name: 'Сардирдинова Хуснида', age: 15, wish: 'Плойка или ресницы + тоналка', details: 'Gabrin 103', emoji: '💅' },
  { id: 28, name: 'Сардирдинова Хайдига', age: 8, wish: 'Костюм хип-хоп + кроссовки', details: 'Костюм 134; кроссовки 34-35', emoji: '🕺' },
  { id: 29, name: 'Сардирдинова Мадина', age: 11, wish: 'Широкие серые штаны', details: 'Размер 40', emoji: '👖' },
  { id: 30, name: 'Сардирдинов Мухамадислам', age: 13, wish: 'Штаны или белые кроссовки', details: 'Штаны р.42; кроссовки 37-38', emoji: '👟' },
]

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

export default function WishTreeChildPage() {
  const { id } = useParams<{ id: string }>()
  const child = CHILDREN.find(c => c.id === Number(id))
  const [isReserved, setIsReserved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (!isDemoMode && child) {
      supabase.from('wish_reservations').select('child_id').eq('child_id', child.id)
        .then(({ data }) => { if (data && data.length > 0) setIsReserved(true); setLoading(false) })
    } else { setLoading(false) }
  }, [child])

  const handleShare = () => {
    const url = window.location.href
    const title = `Помоги исполнить желание ${child?.name} — ${child?.wish}`
    if (navigator.share) {
      navigator.share({ url, title }).catch(() => {})
    } else {
      navigator.clipboard?.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!child) return
    setSubmitting(true)
    if (!isDemoMode) {
      await supabase.from('wish_reservations').upsert({ child_id: child.id, donor_name: form.name, donor_phone: form.phone })
    }
    const botToken = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN
    const chatId = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID
    if (botToken && chatId) {
      const det = child.details && !child.details.startsWith('http') ? `\n📋 ${child.details}` : ''
      const msg = `🌳 *ДЕРЕВО ЖЕЛАНИЙ — ЗАЯВКА*\n\n👤 ${child.name}, ${child.age} лет\n🎁 ${child.wish}${det}\n\n💝 Благотворитель: ${form.name}\n📞 ${form.phone}${form.message ? '\n💬 ' + form.message : ''}`
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }) }).catch(console.error)
    }
    setIsReserved(true); setSubmitting(false); setSubmitted(true)
    launchConfetti()
  }

  if (!child) return (
    <div className="min-h-screen flex items-center justify-center" style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)'}}>
      <div className="text-center p-8">
        <div style={{fontSize:64}} className="mb-4">🌳</div>
        <h1 className="text-xl font-bold text-gray-700 mb-3">Карточка не найдена</h1>
        <Link to="/wish-tree" className="text-green-600 underline text-sm">← Все желания</Link>
      </div>
    </div>
  )

  const prev = CHILDREN.find(c => c.id === child.id - 1)
  const next = CHILDREN.find(c => c.id === child.id + 1)

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(160deg,#f0fdf4 0%,#dcfce7 60%,#f0fdf4 100%)'}}>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}.fade-in{animation:fadeIn 0.4s ease both}`}</style>

      {/* Back */}
      <div className="max-w-lg mx-auto px-4 pt-5 pb-2">
        <Link to="/wish-tree" style={{color:'#16a34a'}} className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline">
          ← Все желания
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-10 fade-in">

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-green-100">

          {/* Hero */}
          <div style={{background:'linear-gradient(135deg,#14532d 0%,#166534 60%,#15803d 100%)',position:'relative',overflow:'hidden'}} className="text-white text-center py-10 px-6">
            {/* Decorative blobs */}
            <div style={{position:'absolute',top:-40,right:-40,width:140,height:140,borderRadius:'50%',background:'rgba(255,255,255,0.06)'}}/>
            <div style={{position:'absolute',bottom:-30,left:-30,width:100,height:100,borderRadius:'50%',background:'rgba(255,255,255,0.06)'}}/>
            <div style={{position:'absolute',top:20,left:20,width:60,height:60,borderRadius:'50%',background:'rgba(255,255,255,0.04)'}}/>

            {/* Status badge */}
            {!loading && isReserved && (
              <div style={{position:'absolute',top:16,right:16,background:'rgba(255,255,255,0.2)',backdropFilter:'blur(8px)',border:'1px solid rgba(255,255,255,0.3)'}} className="px-3 py-1 rounded-full text-xs font-bold">
                ✓ Исполнено
              </div>
            )}

            <div style={{fontSize:76,lineHeight:1,filter:'drop-shadow(0 4px 16px rgba(0,0,0,0.25))',position:'relative'}} className="mb-4">{child.emoji}</div>
            <h1 style={{position:'relative'}} className="text-2xl font-black mb-1">{child.name}</h1>
            <div style={{color:'rgba(255,255,255,0.65)',position:'relative'}} className="text-sm">{child.age} {ageWord(child.age)}</div>

            {/* Child number */}
            <div style={{position:'absolute',bottom:12,right:16,color:'rgba(255,255,255,0.3)',fontSize:11,fontWeight:'bold'}}>
              #{child.id} из 30
            </div>
          </div>

          {/* Content */}
          <div className="p-6">

            {/* Wish block */}
            <div style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)',border:'1px solid #bbf7d0'}} className="rounded-2xl p-5 mb-5 text-center">
              <div style={{fontSize:10,letterSpacing:'0.12em',color:'#16a34a'}} className="font-black uppercase mb-2">Желание ребёнка</div>
              <div className="text-xl font-black text-gray-800 leading-snug mb-3">{child.wish}</div>
              {child.details && !child.details.startsWith('http') && (
                <div style={{background:'white',border:'1px solid #dcfce7'}} className="text-sm text-gray-500 rounded-xl px-4 py-2 inline-block">{child.details}</div>
              )}
              {child.details && child.details.startsWith('http') && (
                <a href={child.details} target="_blank" rel="noopener noreferrer"
                  style={{background:'white',border:'1px solid #bfdbfe'}} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 rounded-xl px-4 py-2 hover:bg-blue-50 transition-colors">
                  🛒 Посмотреть на Kaspi →
                </a>
              )}
            </div>

            <div style={{fontSize:11,color:'#9ca3af',textAlign:'center'}} className="mb-5">Центр поддержки детей акимата города Астана</div>

            {/* CTA */}
            {loading ? (
              <div className="h-14 bg-gray-100 rounded-2xl animate-pulse"/>
            ) : !submitted ? (
              !showForm ? (
                <button onClick={() => !isReserved && setShowForm(true)} disabled={isReserved}
                  style={!isReserved?{background:'linear-gradient(135deg,#22c55e,#16a34a)',boxShadow:'0 6px 20px rgba(34,197,94,0.4)'}:{background:'#f3f4f6'}}
                  className={`w-full py-4 rounded-2xl text-base font-black transition-all ${isReserved?'text-gray-400 cursor-not-allowed':'text-white active:scale-95 hover:opacity-90'}`}>
                  {isReserved ? '✓ Желание уже исполнено' : '💝 Исполнить желание'}
                </button>
              ) : (
                <div style={{animation:'fadeIn 0.3s ease'}}>
                  <p className="text-sm text-gray-500 text-center mb-4">Оставьте контакты — с вами свяжутся</p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input required type="text" placeholder="Ваше имя *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"/>
                    <input required type="tel" placeholder="Номер телефона *" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"/>
                    <textarea placeholder="Сообщение (необязательно)" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={2}
                      className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 resize-none"/>
                    <div className="flex gap-3">
                      <button type="button" onClick={()=>setShowForm(false)} className="flex-1 py-3.5 border border-gray-200 rounded-2xl text-sm text-gray-600 font-semibold hover:bg-gray-50">Назад</button>
                      <button type="submit" disabled={submitting}
                        style={{background:'linear-gradient(135deg,#22c55e,#16a34a)',boxShadow:'0 4px 12px rgba(34,197,94,0.35)'}}
                        className="flex-1 py-3.5 text-white rounded-2xl text-sm font-black disabled:opacity-50">
                        {submitting?'Отправляем...':'Подтвердить ✓'}
                      </button>
                    </div>
                  </form>
                </div>
              )
            ) : (
              <div className="text-center py-4" style={{animation:'fadeIn 0.4s ease'}}>
                <div style={{background:'linear-gradient(135deg,#dcfce7,#bbf7d0)',fontSize:52,width:88,height:88,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',boxShadow:'0 8px 24px rgba(34,197,94,0.3)'}}>🌟</div>
                <h2 className="text-xl font-black text-gray-800 mb-2">Спасибо!</h2>
                <p className="text-sm text-gray-500 leading-relaxed">С вами свяжутся для передачи подарка.<br/>Вы делаете мир добрее! 💚</p>
              </div>
            )}
          </div>
        </div>

        {/* SHARE CARD */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div style={{fontSize:12,color:'#9ca3af',textAlign:'center',marginBottom:12}}>
            Поделитесь — пусть мечта ребёнка исполнится быстрее
          </div>
          <button onClick={handleShare}
            style={copied?{background:'#f0fdf4',border:'1px solid #bbf7d0',color:'#16a34a'}:{background:'#f9fafb',border:'1px solid #e5e7eb',color:'#374151'}}
            className="w-full py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95">
            {copied ? '✓ Ссылка скопирована!' : navigator.share ? '📤 Поделиться' : '📋 Скопировать ссылку'}
          </button>
        </div>

        {/* PREV / NEXT */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          {prev ? (
            <Link to={`/wish-tree/${prev.id}`} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-green-200 transition-all text-left">
              <div style={{fontSize:10,color:'#9ca3af',marginBottom:4}}>← Предыдущий</div>
              <div style={{fontSize:18}} className="mb-1">{prev.emoji}</div>
              <div className="text-xs font-bold text-gray-700 leading-tight">{prev.name.split(' ')[0]}</div>
            </Link>
          ) : <div/>}
          {next ? (
            <Link to={`/wish-tree/${next.id}`} className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm hover:shadow-md hover:border-green-200 transition-all text-right">
              <div style={{fontSize:10,color:'#9ca3af',marginBottom:4}}>Следующий →</div>
              <div style={{fontSize:18}} className="mb-1">{next.emoji}</div>
              <div className="text-xs font-bold text-gray-700 leading-tight">{next.name.split(' ')[0]}</div>
            </Link>
          ) : <div/>}
        </div>

      </div>
    </div>
  )
}
