import { useState } from 'react'

interface Child {
  id: number
  name: string
  age: number
  wish: string
  details: string
  reserved: boolean
}

const children: Child[] = [
  { id: 1, name: 'Болдарева Любовь', age: 4, wish: 'Магнитный танграм (игра)', details: 'https://l.kaspi.kz/shop/GkpuoQ9VjZ99etv', reserved: false },
  { id: 2, name: 'Болдарева Людмила', age: 7, wish: 'Кроссовки', details: 'Размер 31', reserved: false },
  { id: 3, name: 'Болдарева Вероника', age: 10, wish: 'Спортивный костюм', details: 'Размер 40, рост 146-150', reserved: false },
  { id: 4, name: 'Болдарева Александра', age: 15, wish: 'Косметика', details: '', reserved: false },
  { id: 5, name: 'Есбаев Пётр', age: 9, wish: 'Спортивная форма или футбольный мяч', details: 'Рост 135 см', reserved: false },
  { id: 6, name: 'Есбаев Даниил', age: 8, wish: 'Спортивная форма или волейбольный мяч', details: 'Рост 121 см', reserved: false },
  { id: 7, name: 'Есбаева Серафима', age: 11, wish: 'Кроссовки', details: 'Размер 38', reserved: false },
  { id: 8, name: 'Есбаева Аннисия', age: 12, wish: 'Чёрный худи', details: 'Размер 44', reserved: false },
  { id: 9, name: 'Ргайбек Мерей', age: 12, wish: 'Нарядное платье', details: 'Размер 40, рост 146-150', reserved: false },
  { id: 10, name: 'Жусупов Артур', age: 14, wish: 'Спортивный костюм', details: 'Рост 150, размер 40', reserved: false },
  { id: 11, name: 'Алимжанов Мансур', age: 10, wish: 'Футбольная форма Реал Мадрид (Беллингем #5) или кроссовки-сороконожки', details: 'Рост 130 см, размер 35/36', reserved: false },
  { id: 12, name: 'Алимжанов Санжар', age: 8, wish: 'Футбольная форма Реал Мадрид (Роналду #7) или кроссовки-сороконожки', details: 'Рост 121 см, размер 33', reserved: false },
  { id: 13, name: 'Ратай Элеонора', age: 15, wish: 'Наушники Phone Planet Max (чёрные)', details: '', reserved: false },
  { id: 14, name: 'Сансызбай Амира', age: 3, wish: 'Танцевальный коврик', details: 'https://l.kaspi.kz/shop/9ZxBKKBb7QD7vTg', reserved: false },
  { id: 15, name: 'Балтабай Акбота', age: 15, wish: 'Кроссовки ASICS нежно-розового цвета', details: 'Размер 39', reserved: false },
  { id: 16, name: 'Волочай Илья', age: 10, wish: 'Большая машинка на пульту управления', details: '', reserved: false },
  { id: 17, name: 'Ланг Кира', age: 3, wish: 'Коврик для рисования водой', details: 'https://l.kaspi.kz/shop/Gih3m8HPRrLwsf2', reserved: false },
  { id: 18, name: 'Мустафина Аделина', age: 8, wish: 'Джинсы или осенняя куртка', details: 'На 9-10 лет', reserved: false },
  { id: 19, name: 'Ланг Зарина', age: 9, wish: 'Нарядное платье', details: 'Размер 40, рост 150', reserved: false },
  { id: 20, name: 'Ланг Тимур', age: 8, wish: 'Брючный костюм (тройка)', details: 'Размер 36, рост 130', reserved: false },
  { id: 21, name: 'Мельничук Алина', age: 14, wish: 'Косметика', details: '', reserved: false },
  { id: 22, name: 'Рахимбекова Айзере', age: 7, wish: 'Сумочка Hello Kitty и блокнот с мишкой', details: '', reserved: false },
  { id: 23, name: 'Изтлеу Болат', age: 14, wish: 'Фитнес-резинки и гантели', details: '5-9 кг', reserved: false },
  { id: 24, name: 'Ильмуратова Анель', age: 13, wish: 'Уход для волос и лица, ресницы пучковые OMG', details: 'Individual Cluster Lashes', reserved: false },
  { id: 25, name: 'Джекижан Алина', age: 14, wish: 'Уход для волос и ресницы Lucky Honey с клеем', details: '', reserved: false },
  { id: 26, name: 'Халиева Адия', age: 10, wish: '3D-ручка', details: '', reserved: false },
  { id: 27, name: 'Сардирдинова Хуснида', age: 15, wish: 'Плойка-выпрямитель или ресницы + тоналка Gabrin 103', details: '', reserved: false },
  { id: 28, name: 'Сардирдинова Хайдига', age: 8, wish: 'Джазовый спортивный костюм хип-хоп + белые кроссовки', details: 'Костюм чёрный 134; кроссовки 34-35', reserved: false },
  { id: 29, name: 'Сардирдинова Мадина', age: 11, wish: 'Широкие серые штаны', details: 'Размер 40', reserved: false },
  { id: 30, name: 'Сардирдинов Мухамадислам', age: 13, wish: 'Широкие серые штаны или белые кроссовки', details: 'Штаны р.42; кроссовки 37-38', reserved: false },
]

function getAgeEmoji(age: number): string {
  if (age <= 5) return '👶'
  if (age <= 10) return '🧒'
  if (age <= 13) return '👦'
  return '🧑'
}

interface DonorForm { name: string; phone: string; message: string }

export default function WishTreePage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Child | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<DonorForm>({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [localReserved, setLocalReserved] = useState<number[]>([])

  const filtered = children.filter(c =>
    c.wish.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleReserve = (child: Child) => {
    setSelected(child); setShowForm(true); setSubmitted(false)
    setForm({ name: '', phone: '', message: '' })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const botToken = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN
    const chatId = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID
    if (botToken && chatId && selected) {
      const msg = `🌳 *ДЕРЕВО ЖЕЛАНИЙ*\n\n👤 ${selected.name}, ${selected.age} лет\n🎁 ${selected.wish}\n📋 ${selected.details || '—'}\n\n💝 Благотворитель: ${form.name}\n📞 ${form.phone}\n💬 ${form.message || '—'}`
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' })
      }).catch(console.error)
    }
    setLocalReserved(prev => [...prev, selected!.id])
    setSubmitted(true)
  }

  const isReserved = (id: number) => localReserved.includes(id) || children.find(c => c.id === id)?.reserved

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="bg-gradient-to-r from-green-700 to-green-500 text-white py-16 px-4 text-center">
        <div className="text-6xl mb-4">🌳</div>
        <h1 className="text-4xl font-bold mb-3">Дерево желаний</h1>
        <p className="text-lg text-green-100 max-w-2xl mx-auto">
          Центр поддержки детей акимата города Астана.<br/>
          Каждый ребёнок загадал своё желание — помогите его исполнить!
        </p>
        <div className="mt-6 flex justify-center gap-6 text-green-100 text-sm">
          <span>🎁 {children.length} желаний</span>
          <span>💝 {localReserved.length} уже исполняется</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="mb-8">
          <input type="text" placeholder="🔍 Поиск по имени или желанию..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-5 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 shadow-sm" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(child => {
            const reserved = isReserved(child.id)
            return (
              <div key={child.id} className={`rounded-2xl border-2 p-5 shadow-sm transition-all ${reserved ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-green-200 bg-white hover:shadow-md hover:border-green-400'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-2xl mb-1">{getAgeEmoji(child.age)}</div>
                    <div className="font-semibold text-gray-800 text-sm">{child.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{child.age} лет</div>
                  </div>
                  {reserved && <span className="text-xs bg-gray-200 text-gray-500 px-2 py-1 rounded-full">занято</span>}
                </div>
                <div className="bg-green-50 rounded-xl p-3 mb-3">
                  <div className="text-xs text-green-600 font-semibold mb-1">🎁 Желание:</div>
                  <div className="text-sm text-gray-700">{child.wish}</div>
                  {child.details && (child.details.startsWith('http')
                    ? <a href={child.details} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 underline mt-1 block">Ссылка на Kaspi</a>
                    : <div className="text-xs text-gray-400 mt-1">{child.details}</div>)}
                </div>
                <button onClick={() => !reserved && handleReserve(child)} disabled={reserved}
                  className={`w-full py-2 rounded-xl text-sm font-semibold transition-all ${reserved ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'}`}>
                  {reserved ? '✓ Уже берут' : '💝 Исполнить желание'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {showForm && selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            {!submitted ? (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-1">💝 Исполнить желание</h2>
                <p className="text-sm text-gray-500 mb-4">{selected.name}, {selected.age} лет — {selected.wish}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input required type="text" placeholder="Ваше имя *" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  <input required type="tel" placeholder="Телефон *" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400" />
                  <textarea placeholder="Сообщение (по желанию)" value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })} rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 resize-none" />
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowForm(false)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Отмена</button>
                    <button type="submit"
                      className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700">Подтвердить</button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🌟</div>
                <h2 className="text-xl font-bold mb-2">Спасибо!</h2>
                <p className="text-gray-500 text-sm mb-6">С вами свяжутся для передачи подарка. Вы делаете этот мир добрее!</p>
                <button onClick={() => { setShowForm(false); setSelected(null) }}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700">Закрыть</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
