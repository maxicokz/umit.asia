import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Child {
  id: number
  name: string
  birthDate: string
  note: string
  gift: string
  category: 'diagnosis' | 'family'
  reserved?: boolean
}

const childrenWithDiagnosis: Child[] = [
  { id: 3, name: 'Амантай Бекарыс', birthDate: '13.10.2018', note: 'Выраженная умственная отсталость', gift: 'Пианино игрушечное', category: 'diagnosis' },
  { id: 4, name: 'Думанұлы Хамитжан', birthDate: '03.02.2016', note: 'Смешанные специфические расстройства психологического характера', gift: 'Аэроплан, масса для лепки', category: 'diagnosis' },
  { id: 6, name: 'Иімұхамбет Ерасыл', birthDate: '09.06.2015', note: 'Смешанные специфические расстройства психологического характера', gift: 'Пуховик, рост 146', category: 'diagnosis' },
  { id: 9, name: 'Серік Сержан Сағадатұлы', birthDate: '22.12.2017', note: 'НОДА (нарушение опорно-двигательного аппарата)', gift: 'Планшет', category: 'diagnosis' },
  { id: 12, name: 'Серікбай Асылым', birthDate: '03.05.2021', note: 'РАС (Расстройства аутистического спектра)', gift: 'Робот Собака', category: 'diagnosis' },
  { id: 14, name: 'Ташимова Самира', birthDate: '20.10.2016', note: 'Умственная отсталость (тяжелая форма)', gift: 'Осенняя курточка. Рост 134', category: 'diagnosis' },
  { id: 17, name: 'Күлбаринова Ислана', birthDate: '10.09.2020', note: 'НОДА (нарушение опорно-двигательного аппарата)', gift: 'Кукла Реборн', category: 'diagnosis' },
  { id: 19, name: 'Қалдарбек Абдулмәлит', birthDate: '25.12.2020', note: 'Общие расстройства психологического характера', gift: 'Большая машинка', category: 'diagnosis' },
  { id: 21, name: 'Нұрлыбек Даулан', birthDate: '21.10.2021', note: 'ЗПРР, РАС', gift: 'Ватут', category: 'diagnosis' },
  { id: 23, name: 'Мұхамбедіяр Айнакмоз', birthDate: '10.10.2018', note: 'Умственная отсталость', gift: 'Ватут', category: 'diagnosis' },
  { id: 24, name: 'Жігер Ануар', birthDate: '17.05.2016', note: 'Умственная отсталость', gift: 'Робот Собака', category: 'diagnosis' },
  { id: 25, name: 'Қалдарбек Абдурахим', birthDate: '24.05.2018', note: 'Выраженная умственная отсталость', gift: 'Машинка', category: 'diagnosis' },
  { id: 26, name: 'Айтым Арсен', birthDate: '20.08.2016', note: 'Выраженная умственная отсталость. Заболевания суставов', gift: 'Домбра', category: 'diagnosis' },
  { id: 28, name: 'Берік Осман', birthDate: '20.04.2021', note: 'ЗПРР, РАС. Общие расстройства психологического характера', gift: 'Велосипед', category: 'diagnosis' },
  { id: 30, name: 'Мантай Ағұлым', birthDate: '29.12.2019', note: 'Смешанные специфические расстройства психологического характера', gift: 'Ватут', category: 'diagnosis' },
  { id: 31, name: 'Қайролла Арслан', birthDate: '06.07.2021', note: 'Смешанные специфические расстройства психологического характера', gift: 'Зимняя обувь', category: 'diagnosis' },
  { id: 32, name: 'Талғатқызы Аруна', birthDate: '25.11.2021', note: 'Синдром Ретта', gift: 'Домик', category: 'diagnosis' },
  { id: 33, name: 'Айғали Абдурахман', birthDate: '23.07.2020', note: 'Выраженное ЗПМ и РР. НОДА', gift: 'Домик', category: 'diagnosis' },
  { id: 34, name: 'Асетжанов Асылжан', birthDate: '08.05.2015', note: 'Смешанные специфические расстройства психологического характера', gift: 'Джип', category: 'diagnosis' },
  { id: 35, name: 'Алписбаев Нұрислам', birthDate: '11.11.2012', note: 'Смешанные специфические расстройства психологического характера', gift: 'Самолет', category: 'diagnosis' },
]

const childrenFromFamilies: Child[] = [
  { id: 104, name: 'Камза Темір Саятұлы', birthDate: '03.03.2020', note: 'Многодетная семья (6 детей)', gift: 'Электронная Машина', category: 'family' },
  { id: 107, name: 'Ермағамбетова Эльмира Нұрымқызы', birthDate: '12.03.2013', note: 'Многодетная семья (8 детей)', gift: 'Планшет', category: 'family' },
  { id: 108, name: 'Тұрғанбай Нұрайым Бекнұрқызы', birthDate: '23.04.2015', note: 'Многодетная семья (8 детей)', gift: 'Планшет', category: 'family' },
  { id: 109, name: 'Тұрғанбай Нұрбақыт Бекнұрқызы', birthDate: '22.11.2017', note: 'Многодетная семья (8 детей)', gift: 'Планшет', category: 'family' },
  { id: 110, name: 'Тұрғанбай Айсауле Бекнұрқызы', birthDate: '05.07.2019', note: 'Многодетная семья (8 детей)', gift: 'Планшет', category: 'family' },
  { id: 117, name: 'Маенов Рахман Бауыржанұлы', birthDate: '25.05.2013', note: 'Многодетная семья (6 детей)', gift: 'Спортивный костюм на 14 лет', category: 'family' },
]

function calculateAge(birthDate: string): number {
  const [day, month, year] = birthDate.split('.').map(Number)
  const birth = new Date(year, month - 1, day)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return age
}

export default function SecretSantaPage() {
  const { t } = useTranslation()
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [filter, setFilter] = useState<'all' | 'diagnosis' | 'family'>('all')

  const allChildren = [...childrenWithDiagnosis, ...childrenFromFamilies]
  const filteredChildren = filter === 'all'
    ? allChildren
    : allChildren.filter(c => c.category === filter)

  const handleReserve = (child: Child) => {
    setSelectedChild(child)
    setShowModal(true)
    setSubmitted(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would send to Supabase or email
    console.log('Reservation:', { child: selectedChild, donor: formData })
    setSubmitted(true)
    setTimeout(() => {
      setShowModal(false)
      setFormData({ name: '', phone: '', email: '', message: '' })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900">
      {/* Snowflakes CSS */}
      <style>{`
        @keyframes snowfall {
          0% { transform: translateY(-10vh) translateX(0); opacity: 1; }
          100% { transform: translateY(100vh) translateX(100px); opacity: 0.3; }
        }
        .snowflake {
          position: fixed;
          color: white;
          font-size: 1.5rem;
          animation: snowfall linear infinite;
          opacity: 0.7;
          z-index: 1;
          pointer-events: none;
        }
      `}</style>

      {/* Snowflakes */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="snowflake"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${5 + Math.random() * 10}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          *
        </div>
      ))}

      {/* Hero Section */}
      <div className="relative z-10 pt-8 pb-12 text-center text-white">
        <div className="container mx-auto px-4">
          <div className="text-6xl mb-4">🎄</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            Тайный Санта
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-2">
            Подари чудо особенным детям!
          </p>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Выберите ребёнка и станьте его Тайным Сантой.
            Каждый подарок — это маленькое чудо в жизни ребёнка.
          </p>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold">{allChildren.length}</div>
              <div className="text-blue-200 text-sm">Детей ждут чуда</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold">{childrenWithDiagnosis.length}</div>
              <div className="text-blue-200 text-sm">Детей с диагнозами</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
              <div className="text-3xl font-bold">{childrenFromFamilies.length}</div>
              <div className="text-blue-200 text-sm">Из многодетных семей</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="relative z-10 container mx-auto px-4 mb-8">
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'all'
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Все дети ({allChildren.length})
          </button>
          <button
            onClick={() => setFilter('diagnosis')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'diagnosis'
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            С диагнозами ({childrenWithDiagnosis.length})
          </button>
          <button
            onClick={() => setFilter('family')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              filter === 'family'
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Многодетные семьи ({childrenFromFamilies.length})
          </button>
        </div>
      </div>

      {/* Children Grid */}
      <div className="relative z-10 container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChildren.map((child) => (
            <div
              key={child.id}
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              <div className={`h-2 ${child.category === 'diagnosis' ? 'bg-red-400' : 'bg-green-400'}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{child.name}</h3>
                    <p className="text-sm text-gray-500">
                      {calculateAge(child.birthDate)} лет • {child.birthDate}
                    </p>
                  </div>
                  <span className="text-3xl">
                    {child.category === 'diagnosis' ? '💙' : '👨‍👩‍👧‍👦'}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">
                    {child.note}
                  </p>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-4 mb-4">
                  <div className="text-xs text-gray-500 mb-1">Мечтает о подарке:</div>
                  <div className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="mr-2">🎁</span>
                    {child.gift}
                  </div>
                </div>

                <button
                  onClick={() => handleReserve(child)}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>🎅</span>
                  Стать Тайным Сантой
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 bg-white/10 backdrop-blur-sm py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Как это работает?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center text-white">
              <div className="text-4xl mb-3">1️⃣</div>
              <h3 className="font-bold mb-2">Выберите ребёнка</h3>
              <p className="text-blue-200 text-sm">Посмотрите список детей и их желания</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl mb-3">2️⃣</div>
              <h3 className="font-bold mb-2">Оставьте заявку</h3>
              <p className="text-blue-200 text-sm">Нажмите кнопку и заполните форму</p>
            </div>
            <div className="text-center text-white">
              <div className="text-4xl mb-3">3️⃣</div>
              <h3 className="font-bold mb-2">Подарите чудо</h3>
              <p className="text-blue-200 text-sm">Мы свяжемся с вами для передачи подарка</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="relative z-10 py-8 text-center text-white">
        <p className="text-blue-200">Вопросы? Свяжитесь с нами:</p>
        <p className="font-semibold">Telegram: @marchenkokz | Email: umit@maxico.kz</p>
      </div>

      {/* Modal */}
      {showModal && selectedChild && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-500 to-green-500 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Стать Тайным Сантой</h3>
                  <p className="text-white/80">для {selectedChild.name}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Спасибо!</h3>
                  <p className="text-gray-600">
                    Ваша заявка принята. Мы свяжемся с вами в ближайшее время!
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="text-sm text-gray-500 mb-1">Подарок:</div>
                    <div className="font-bold text-gray-800 flex items-center">
                      <span className="mr-2">🎁</span>
                      {selectedChild.gift}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ваше имя *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="Как к вам обращаться?"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="example@mail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Сообщение
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        rows={3}
                        placeholder="Дополнительная информация..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all"
                    >
                      Отправить заявку 🎅
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
