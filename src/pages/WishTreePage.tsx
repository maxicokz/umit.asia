import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isDemoMode } from '../services/supabase'

interface Child {
  id: number; name: string; age: number; wish: string; details: string; emoji: string
}

const children: Child[] = [
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

export default function WishTreePage() {
  const [reserved, setReserved] = useState<Set<number>>(new Set())
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Child | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'all'|'available'|'done'>('all')

  useEffect(() => {
    if (!isDemoMode) {
      supabase.from('wish_reservations').select('child_id').then(({ data }) => {
        if (data) setReserved(new Set(data.map((r: any) => r.child_id)))
      })
    }
  }, [])

  const filtered = children.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.wish.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'available' && !reserved.has(c.id)) || (filter === 'done' && reserved.has(c.id))
    return matchSearch && matchFilter
  })

  const handleReserveClick = (e: React.MouseEvent, child: Child) => {
    e.preventDefault(); e.stopPropagation()
    if (reserved.has(child.id)) return
    setSelected(child); setSubmitted(false); setForm({ name: '', phone: '', message: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setLoading(true)
    if (!isDemoMode) {
      await supabase.from('wish_reservations').upsert({ child_id: selected.id, donor_name: form.name, donor_phone: form.phone })
    }
    const botToken = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN
    const chatId = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID
    if (botToken && chatId) {
      const det = selected.details && !selected.details.startsWith('http') ? `\n📋 ${selected.details}` : ''
      const msg = `🌳 *ДЕРЕВО ЖЕЛАНИЙ*\n\n👤 ${selected.name}, ${selected.age} лет\n🎁 ${selected.wish}${det}\n\n💝 Благотворитель: ${form.name}\n📞 ${form.phone}${form.message ? '\n💬 ' + form.message : ''}`
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }) }).catch(console.error)
    }
    setReserved(prev => new Set([...prev, selected.id]))
    setLoading(false); setSubmitted(true)
  }

  const available = children.filter(c => !reserved.has(c.id)).length
  const done = 30 - available
  const ageWord = (n: number) => n === 1 ? 'год' : n < 5 ? 'года' : 'лет'

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(160deg,#f0fdf4 0%,#dcfce7 60%,#f0fdf4 100%)'}}>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#14532d 0%,#166534 50%,#15803d 100%)'}} className="text-white">
        <div className="max-w-3xl mx-auto px-4 pt-10 pb-8 text-center">
          <div style={{fontSize:64,lineHeight:1}} className="mb-4">🌳</div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Дерево желаний</h1>
          <p style={{color:'rgba(255,255,255,0.7)'}} className="text-sm mb-7">Центр поддержки детей акимата города Астана</p>

          <div className="flex justify-center gap-3 flex-wrap mb-6">
            {[{n:available,label:'ждут дарителя'},{n:done,label:'мечты исполнены'},{n:30,label:'детей всего'}].map(({n,label})=>(
              <div key={label} style={{background:'rgba(255,255,255,0.15)',backdropFilter:'blur(8px)'}} className="rounded-2xl px-6 py-3 min-w-[90px]">
                <div className="text-2xl font-black">{n}</div>
                <div style={{color:'rgba(255,255,255,0.7)'}} className="text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-sm mx-auto">
            <div style={{background:'rgba(255,255,255,0.2)'}} className="rounded-full h-2 overflow-hidden">
              <div style={{width:`${(done/30)*100}%`,background:'linear-gradient(90deg,#4ade80,#22c55e)',transition:'width 0.6s ease'}} className="h-full rounded-full"/>
            </div>
            <div style={{color:'rgba(255,255,255,0.6)'}} className="text-xs mt-1.5">{Math.round((done/30)*100)}% желаний исполнено</div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* SEARCH + FILTERS */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-6">
          <input type="text" placeholder="🔍 Поиск по имени или желанию..."
            value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 mb-3"/>
          <div className="flex gap-2">
            {(['all','available','done'] as const).map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${filter===f?'bg-green-600 text-white':'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                {f==='all'?`Все (${children.length})`:f==='available'?`✅ Свободные (${available})`:`🎁 Исполненные (${done})`}
              </button>
            ))}
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(child => {
            const isReserved = reserved.has(child.id)
            return (
              <Link key={child.id} to={`/wish-tree/${child.id}`}
                className={`group block bg-white rounded-2xl overflow-hidden shadow-sm border transition-all duration-200 ${isReserved?'border-gray-100 opacity-65':'border-green-100 hover:shadow-xl hover:-translate-y-1 hover:border-green-300 cursor-pointer'}`}>

                {/* Top color bar */}
                <div className={`h-1 ${isReserved?'bg-gray-200':'bg-gradient-to-r from-green-400 to-emerald-500'}`}/>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div style={{background:isReserved?'#f3f4f6':'linear-gradient(135deg,#dcfce7,#bbf7d0)',fontSize:28,width:52,height:52}} className="rounded-2xl flex items-center justify-center flex-shrink-0">
                      {child.emoji}
                    </div>
                    <span style={{fontSize:11}} className={`font-semibold px-3 py-1 rounded-full ${isReserved?'bg-gray-100 text-gray-400':'bg-green-50 text-green-600 border border-green-100'}`}>
                      {isReserved?'✓ Исполнено':'Свободно'}
                    </span>
                  </div>

                  <div className="font-bold text-gray-800 text-base leading-tight">{child.name}</div>
                  <div className="text-xs text-gray-400 mb-3">{child.age} {ageWord(child.age)}</div>

                  <div className="bg-gray-50 rounded-xl p-3 mb-4">
                    <div style={{fontSize:11}} className="text-gray-400 uppercase tracking-wide font-semibold mb-1">Мечта</div>
                    <div className="text-sm text-gray-700 font-medium leading-snug">{child.wish}</div>
                    {child.details && !child.details.startsWith('http') && (
                      <div className="text-xs text-gray-400 mt-1">{child.details}</div>
                    )}
                    {child.details && child.details.startsWith('http') && (
                      <div className="text-xs text-blue-500 mt-1">🛒 Посмотреть на Kaspi</div>
                    )}
                  </div>

                  <button onClick={e=>handleReserveClick(e,child)} disabled={isReserved}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${isReserved?'bg-gray-100 text-gray-400 cursor-not-allowed':'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-sm active:scale-95'}`}>
                    {isReserved?'Желание уже исполнено':'💝 Исполнить желание'}
                  </button>
                </div>
              </Link>
            )
          })}
        </div>

        {filtered.length===0&&(
          <div className="text-center py-20 text-gray-400">
            <div style={{fontSize:48}} className="mb-3">🔍</div>
            <div>Ничего не найдено</div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selected&&(
        <div style={{background:'rgba(0,0,0,0.6)',backdropFilter:'blur(4px)'}} className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {!submitted?(
              <>
                <div style={{background:'linear-gradient(135deg,#14532d,#16a34a)'}} className="text-white p-6">
                  <div style={{fontSize:36}} className="mb-2">{selected.emoji}</div>
                  <div className="font-black text-xl leading-tight">{selected.name}</div>
                  <div style={{color:'rgba(255,255,255,0.75)'}} className="text-sm mt-1">🎁 {selected.wish}</div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-4">Оставьте контакты — с вами свяжутся для передачи подарка</p>
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input required type="text" placeholder="Ваше имя *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>
                    <input required type="tel" placeholder="Номер телефона *" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"/>
                    <textarea placeholder="Сообщение (необязательно)" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={2}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"/>
                    <div className="flex gap-3 pt-1">
                      <button type="button" onClick={()=>setSelected(null)} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium">Отмена</button>
                      <button type="submit" disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 shadow-sm">
                        {loading?'...':'💝 Подтвердить'}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ):(
              <div className="text-center p-10">
                <div style={{background:'linear-gradient(135deg,#dcfce7,#bbf7d0)',fontSize:48,width:80,height:80}} className="rounded-full flex items-center justify-center mx-auto mb-5">🌟</div>
                <h2 className="text-xl font-black text-gray-800 mb-2">Спасибо!</h2>
                <p className="text-gray-500 text-sm mb-6">Вы делаете этот мир добрее.<br/>С вами свяжутся для передачи подарка.</p>
                <button onClick={()=>setSelected(null)} className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-sm">Закрыть</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
