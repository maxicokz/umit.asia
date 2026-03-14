import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase, isDemoMode } from '../services/supabase'

interface Child { id: number; name: string; age: number; wish: string; details: string; emoji: string }

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

interface DonorForm { name: string; phone: string; message: string }

export default function WishTreeChildPage() {
  const { id } = useParams<{ id: string }>()
  const child = children.find(c => c.id === Number(id))
  const [isReserved, setIsReserved] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<DonorForm>({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isDemoMode && child) {
      supabase.from('wish_reservations').select('child_id').eq('child_id', child.id).then(({ data }) => {
        if (data && data.length > 0) setIsReserved(true)
      })
    }
  }, [child])

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!child) return
    setLoading(true)
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
    setIsReserved(true); setLoading(false); setSubmitted(true)
  }

  if (!child) return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center p-8">
        <div style={{fontSize:64}} className="mb-4">🌳</div>
        <h1 className="text-xl font-bold text-gray-700 mb-3">Карточка не найдена</h1>
        <Link to="/wish-tree" className="text-green-600 underline text-sm">← Все желания</Link>
      </div>
    </div>
  )

  const ageWord = (n: number) => n === 1 ? 'год' : n < 5 ? 'года' : 'лет'

  return (
    <div className="min-h-screen" style={{background:'linear-gradient(160deg,#f0fdf4 0%,#dcfce7 60%,#f0fdf4 100%)'}}>

      {/* Back nav */}
      <div className="max-w-lg mx-auto px-4 pt-5 pb-2">
        <Link to="/wish-tree" style={{color:'#16a34a'}} className="flex items-center gap-1.5 text-sm font-medium hover:underline">
          <span>←</span><span>Все желания</span>
        </Link>
      </div>

      <div className="max-w-lg mx-auto px-4 pb-10">
        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-green-100">

          {/* Hero section */}
          <div style={{background:'linear-gradient(135deg,#14532d 0%,#166534 50%,#15803d 100%)'}} className="text-white text-center py-10 px-6 relative">
            {/* Decorative circles */}
            <div style={{position:'absolute',top:-30,right:-30,width:120,height:120,borderRadius:'50%',background:'rgba(255,255,255,0.05)'}}/>
            <div style={{position:'absolute',bottom:-20,left:-20,width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.05)'}}/>

            <div style={{fontSize:72,lineHeight:1,position:'relative'}} className="mb-4">{child.emoji}</div>
            <h1 className="text-2xl font-black mb-1 relative">{child.name}</h1>
            <div style={{color:'rgba(255,255,255,0.7)'}} className="text-sm relative">{child.age} {ageWord(child.age)}</div>

            {isReserved && (
              <div style={{background:'rgba(255,255,255,0.2)',backdropFilter:'blur(8px)'}} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold mt-3">
                ✓ Желание исполнено
              </div>
            )}
          </div>

          {/* Wish block */}
          <div className="p-6">
            <div style={{background:'linear-gradient(135deg,#f0fdf4,#dcfce7)'}} className="rounded-2xl p-5 mb-5 text-center border border-green-100">
              <div style={{fontSize:11,color:'#16a34a'}} className="font-black uppercase tracking-widest mb-2">Желание ребёнка</div>
              <div className="text-lg font-bold text-gray-800 leading-snug mb-2">{child.wish}</div>
              {child.details && !child.details.startsWith('http') && (
                <div className="text-sm text-gray-500 bg-white rounded-xl px-3 py-2 inline-block">{child.details}</div>
              )}
              {child.details && child.details.startsWith('http') && (
                <a href={child.details} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2 hover:bg-blue-100 transition-colors">
                  🛒 Посмотреть на Kaspi →
                </a>
              )}
            </div>

            <div style={{fontSize:11,color:'#9ca3af'}} className="text-center mb-5">Центр поддержки детей акимата города Астана</div>

            {/* CTA */}
            {!submitted ? (
              !showForm ? (
                <button onClick={() => !isReserved && setShowForm(true)} disabled={isReserved}
                  className={`w-full py-4 rounded-2xl text-base font-black transition-all ${isReserved?'bg-gray-100 text-gray-400 cursor-not-allowed':'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-200 active:scale-95'}`}>
                  {isReserved ? '✓ Желание уже исполнено' : '💝 Исполнить желание'}
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div style={{fontSize:13,color:'#6b7280'}} className="text-center mb-1">Оставьте контакты — с вами свяжутся</div>
                  <input required type="text" placeholder="Ваше имя *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"/>
                  <input required type="tel" placeholder="Номер телефона *" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"/>
                  <textarea placeholder="Сообщение (по желанию)" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows={2}
                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 resize-none"/>
                  <div className="flex gap-3">
                    <button type="button" onClick={()=>setShowForm(false)} className="flex-1 py-3.5 border border-gray-200 rounded-2xl text-sm text-gray-600 font-semibold hover:bg-gray-50">Назад</button>
                    <button type="submit" disabled={loading} className="flex-1 py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl text-sm font-black disabled:opacity-50 shadow-sm">
                      {loading?'...':'Подтвердить ✓'}
                    </button>
                  </div>
                </form>
              )
            ) : (
              <div className="text-center py-6">
                <div style={{background:'linear-gradient(135deg,#dcfce7,#bbf7d0)',fontSize:48,width:80,height:80}} className="rounded-full flex items-center justify-center mx-auto mb-4">🌟</div>
                <h2 className="text-xl font-black text-gray-800 mb-2">Спасибо!</h2>
                <p className="text-sm text-gray-500">С вами свяжутся для передачи подарка.<br/>Вы делаете этот мир добрее!</p>
              </div>
            )}
          </div>
        </div>

        {/* Share block */}
        <div className="mt-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
          <div style={{fontSize:12,color:'#9ca3af'}} className="mb-3">Поделитесь — возможно кто-то из ваших друзей исполнит это желание</div>
          <button onClick={handleCopy}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all border ${copied?'bg-green-50 text-green-600 border-green-200':'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}>
            {copied ? '✓ Ссылка скопирована!' : '📋 Скопировать ссылку'}
          </button>
        </div>

        {/* Nav prev/next */}
        <div className="mt-4 flex gap-3">
          {child.id > 1 && (
            <Link to={`/wish-tree/${child.id-1}`} className="flex-1 py-3 bg-white border border-gray-100 rounded-xl text-sm text-gray-500 text-center hover:bg-gray-50 shadow-sm">
              ← {children[child.id-2].name.split(' ')[0]}
            </Link>
          )}
          {child.id < 30 && (
            <Link to={`/wish-tree/${child.id+1}`} className="flex-1 py-3 bg-white border border-gray-100 rounded-xl text-sm text-gray-500 text-center hover:bg-gray-50 shadow-sm">
              {children[child.id].name.split(' ')[0]} →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
