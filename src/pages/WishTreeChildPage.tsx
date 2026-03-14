import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'

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

export default function WishTreeChildPage() {
  const { id } = useParams<{ id: string }>()
  const child = children.find(c => c.id === Number(id))

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<DonorForm>({ name: '', phone: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  if (!child) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🌳</div>
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Карточка не найдена</h1>
          <Link to="/wish-tree" className="text-green-600 underline">← Все желания</Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const botToken = (import.meta as any).env?.VITE_TELEGRAM_BOT_TOKEN
    const chatId = (import.meta as any).env?.VITE_TELEGRAM_CHAT_ID
    if (botToken && chatId) {
      const msg = `🌳 *ДЕРЕВО ЖЕЛАНИЙ — ЗАЯВКА*\n\n👤 ${child.name}, ${child.age} лет\n🎁 ${child.wish}\n📋 ${child.details || '—'}\n\n💝 ${form.name}\n📞 ${form.phone}\n💬 ${form.message || '—'}`
      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' })
      }).catch(console.error)
    }
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Back */}
      <div className="max-w-lg mx-auto px-4 pt-6">
        <Link to="/wish-tree" className="text-green-600 text-sm flex items-center gap-1 hover:underline">
          ← Все желания
        </Link>
      </div>

      {/* Card */}
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl border-2 border-green-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-400 text-white p-8 text-center">
            <div className="text-7xl mb-3">{getAgeEmoji(child.age)}</div>
            <h1 className="text-2xl font-bold">{child.name}</h1>
            <p className="text-green-100 mt-1">{child.age} лет</p>
          </div>

          {/* Wish */}
          <div className="p-6">
            <div className="bg-green-50 rounded-2xl p-5 mb-5 text-center">
              <div className="text-3xl mb-2">🎁</div>
              <div className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-2">Желание ребёнка</div>
              <div className="text-lg font-semibold text-gray-800">{child.wish}</div>
              {child.details && (
                child.details.startsWith('http')
                  ? <a href={child.details} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-block text-sm text-blue-500 underline">Посмотреть на Kaspi →</a>
                  : <div className="text-sm text-gray-500 mt-2">{child.details}</div>
              )}
            </div>

            {/* Organization */}
            <div className="text-center text-xs text-gray-400 mb-6">
              Центр поддержки детей акимата города Астана
            </div>

            {/* CTA */}
            {!submitted ? (
              !showForm ? (
                <button onClick={() => setShowForm(true)}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl text-lg font-bold hover:bg-green-700 active:scale-95 transition-all shadow-lg">
                  💝 Исполнить желание
                </button>
              ) : (
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
                    <button type="button" onClick={() => setShowForm(false)}
                      className="flex-1 py-3 border border-gray-200 rounded-xl text-sm text-gray-600">Назад</button>
                    <button type="submit"
                      className="flex-1 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700">Подтвердить</button>
                  </div>
                </form>
              )
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-3">🌟</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Спасибо!</h2>
                <p className="text-gray-500 text-sm">С вами свяжутся для передачи подарка.<br/>Вы делаете этот мир добрее!</p>
              </div>
            )}
          </div>
        </div>

        {/* Share */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-400 mb-2">Поделитесь этой карточкой</p>
          <button onClick={() => navigator.share?.({ url: window.location.href, title: `Желание ${child.name}` }) || navigator.clipboard.writeText(window.location.href)}
            className="text-sm text-green-600 underline">📋 Скопировать ссылку</button>
        </div>
      </div>
    </div>
  )
}
