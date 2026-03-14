import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, isDemoMode } from '../services/supabase'

interface Child {
  id: number
  name: string
  age: number
  wish: string
  details: string
}

const children: Child[] = [
  { id: 1, name: 'Болдарева Любовь', age: 4, wish: 'Магнитный танграм (игра)', details: 'https://l.kaspi.kz/shop/GkpuoQ9VjZ99etv' },
  { id: 2, name: 'Болдарева Людмила', age: 7, wish: 'Кроссовки', details: 'Размер 31' },
  { id: 3, name: 'Болдарева Вероника', age: 10, wish: 'Спортивный костюм', details: 'Размер 40, рост 146-150' },
  { id: 4, name: 'Болдарева Александра', age: 15, wish: 'Косметика', details: '' },
  { id: 5, name: 'Есбаев Пётр', age: 9, wish: 'Спортивная форма или футбольный мяч', details: 'Рост 135 см' },
  { id: 6, name: 'Есбаев Даниил', age: 8, wish: 'Спортивная форма или волейбольный мяч', details: 'Рост 121 см' },
  { id: 7, name: 'Есбаева Серафима', age: 11, wish: 'Кроссовки', details: 'Размер 38' },
  { id: 8, name: 'Есбаева Аннисия', age: 12, wish: 'Чёрный худи', details: 'Размер 44' },
  { id: 9, name: 'Ргайбек Мерей', age: 12, wish: 'Нарядное платье', details: 'Размер 40, рост 146-150' },
  { id: 10, name: 'Жусупов Артур', age: 14, wish: 'Спортивный костюм', details: 'Рост 150, размер 40' },
  { id: 11, name: 'Алимжанов Мансур', age: 10, wish: 'Футбольная форма Реал Мадрид (Беллингем #5) или кроссовки-сороконожки', details: 'Рост 130 см, размер 35/36' },
  { id: 12, name: 'Алимжанов Санжар', age: 8, wish: 'Футбольная форма Реал Мадрид (Роналду #7) или кроссовки-сороконожки', details: 'Рост 121 см, размер 33' },
  { id: 13, name: 'Ратай Элеонора', age: 15, wish: 'Наушники Phone Planet Max (чёрные)', details: '' },
  { id: 14, name: 'Сансызбай Амира', age: 3, wish: 'Танцевальный коврик', details: 'https://l.kaspi.kz/shop/9ZxBKKBb7QD7vTg' },
  { id: 15, name: 'Балтабай Акбота', age: 15, wish: 'Кроссовки ASICS нежно-розового цвета', details: 'Размер 39' },
  { id: 16, name: 'Волочай Илья', age: 10, wish: 'Большая машинка на пульту управления', details: '' },
  { id: 17, name: 'Ланг Кира', age: 3, wish: 'Коврик для рисования водой', details: 'https://l.kaspi.kz/shop/Gih3m8HPRrLwsf2' },
  { id: 18, name: 'Мустафина Аделина', age: 8, wish: 'Джинсы или осенняя куртка', details: 'На 9-10 лет' },
  { id: 19, name: 'Ланг Зарина', age: 9, wish: 'Нарядное платье', details: 'Размер 40, рост 150' },
  { id: 20, name: 'Ланг Тимур', age: 8, wish: 'Брючный костюм (тройка)', details: 'Размер 36, рост 130' },
  { id: 21, name: 'Мельничук Алина', age: 14, wish: 'Косметика', details: '' },
  { id: 22, name: 'Рахимбекова Айзере', age: 7, wish: 'Сумочка Hello Kitty и блокнот с мишкой', details: '' },
  { id: 23, name: 'Изтлеу Болат', age: 14, wish: 'Фитнес-резинки и гантели', details: '5-9 кг' },
  { id: 24, name: 'Ильмуратова Анель', age: 13, wish: 'Уход для волос и лица, ресницы пучковые OMG', details: 'Individual Cluster Lashes' },
  { id: 25, name: 'Джекижан Алина', age: 14, wish: 'Уход для волос и ресницы Lucky Honey с клеем', details: '' },
  { id: 26, name: 'Халиева Адия', age: 10, wish: '3D-ручка', details: '' },
  { id: 27, name: 'Сардирдинова Хуснида', age: 15, wish: 'Плойка-выпрямитель или ресницы + тоналка Gabrin 103', details: '' },
  { id: 28, name: 'Сардирдинова Хайдига', age: 8, wish: 'Джазовый спортивный костюм хип-хоп + белые кроссовки', details: 'Костюм чёрный 134; кроссовки 34-35' },
  { id: 29, name: 'Сардирдинова Мадина', age: 11, wish: 'Широкие серые штаны', details: 'Размер 40' },
  { id: 30, name: 'Сардирдинов Мухамадислам', age: 13, wish: 'Широкие серые штаны или белые кроссовки', details: 'Штаны р.42; кроссовки 37-38' },
]

export default function WishTreePage() {
  const [reserved, setReserved] = useState<Set<number>>(new Set())
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Child | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isDemoMode) {
      supabase.from('wish_reservations').select('child_id').then(({ data }) => {
        if (data) setReserved(new Set(data.map((r: any) => r.child_id)))
      })
    }
  }, [])

  const filtered = children.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.wish.toLowerCase().includes(search.toLowerCase())
  )

  const handleReserve = (child: Child) => {
    setSelected(child)
    setSubmitted(false)
    setForm({ name: '', phone: '', message: '' })
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
      const details2 = selected.details ? `\n📋 ${selected.details}` : ''
      const msg = `🌳 *ДЕРЕВО ЖЕЛАНИЙ*\n\n👤 ${selected.name}, ${selected.age} лет\n🎁 ${selected.wish}${details2}\n\n💝 Благотворитель: ${form.name}\n📞 ${form.phone}${form.message ? '\n💬 ' + form.message : ''}`
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' })
      }).catch(console.error)
    }

    setReserved(prev => new Set([...prev, selected.id]))
    setLoading(false)
    setSubmitted(true)
  }

  const available = children.filter(c => !reserved.has(c.id)).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌳</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Дерево желаний</h1>
          <p className="text-gray-500 text-sm mb-1">Центр поддержки детей акимата города Астана</p>
          <p className="text-green-600 font-semibold">Каждый ребёнок заслуживает исполнения мечты</p>
          <div className="mt-3 flex justify-center gap-4 text-sm">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">✅ {available} доступно</span>
            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full">🎁 {30 - available} исполнено</span>
          </div>
        </div>

        {/* Search */}
        <input type="text" placeholder="🔍 Поиск по имени или желанию..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white shadow-sm" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map(child => {
            const isReserved = reserved.has(child.id)
            return (
              <div key={child.id} className={`bg-white rounded-2xl shadow-sm border-2 p-4 transition-all ${isReserved ? 'border-gray-200 opacity-60' : 'border-green-100 hover:border-green-300 hover:shadow-md'}`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">{child.name}</div>
                    <div className="text-xs text-gray-400">{child.age} лет</div>
                  </div>
                  {isReserved && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">занято</span>}
                </div>
                <div className="text-sm text-gray-600 mb-1">🎁 {child.wish}</div>
                {child.details && !child.details.startsWith('http') && (
                  <div className="text-xs text-gray-400 mb-2">{child.details}</div>
                )}
                {child.details && child.details.startsWith('http') && (
                  <a href={child.details} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-blue-500 underline block mb-2">Посмотреть на Kaspi →</a>
                )}
                <div className="flex gap-2 mt-3">
                  <Link to={`/wish-tree/${child.id}`}
                    className="flex-1 py-2 rounded-xl text-xs text-center text-green-600 border border-green-200 hover:bg-green-50 transition-all font-medium">
                    🔗 Карточка
                  </Link>
                  <button onClick={() => !isReserved && handleReserve(child)}
                    disabled={isReserved}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${isReserved ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'}`}>
                    {isReserved ? '✓ Занято' : '💝 Исполнить'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
          onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl">
            {!submitted ? (
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-1">{selected.name}</h2>
                <p className="text-sm text-gray-500 mb-4">🎁 {selected.wish}</p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <input required type="text" placeholder="Ваше имя *" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  <input required type="tel" placeholder="Телефон *" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  <textarea placeholder="Сообщение (по желанию)" value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })} rows={2}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setSelected(null)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600">Отмена</button>
                    <button type="submit" disabled={loading}
                      className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 disabled:opacity-50">
                      {loading ? '...' : 'Подтвердить'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-3">🌟</div>
                <h2 className="text-xl font-bold mb-2">Спасибо!</h2>
                <p className="text-gray-500 text-sm mb-4">С вами свяжутся для передачи подарка.</p>
                <button onClick={() => setSelected(null)}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-bold">Закрыть</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
