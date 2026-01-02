import { useState, useMemo, useEffect } from 'react'
import { supabase } from '../services/supabase'

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
  { id: 1, name: 'Мырзаева Аяулым', birthDate: '01.06.2012', note: 'Синдром Нунан', gift: 'Нарядное платье рост 164 и сладости', category: 'diagnosis' },
  { id: 2, name: 'Абдулхамит Аманбекулы', birthDate: '01.06.2016', note: 'ЗПРР, ЗРР', gift: 'Шлем для карате и перчатки, сладости', category: 'diagnosis' },
  { id: 3, name: 'Сағындық Мұхаммед', birthDate: '01.06.2017', note: 'Синдром Дауна', gift: 'Комбинезон зимний рост 134 и сладости', category: 'diagnosis' },
  { id: 4, name: 'Дархан Құралай', birthDate: '01.06.2017', note: 'Эпилепсия, ЗПРР', gift: 'Куртка зимняя рост 150, зимняя обувь 35, сладости', category: 'diagnosis' },
  { id: 5, name: 'Кенесбек Бесултан', birthDate: '01.06.2018', note: 'Аутизм', gift: 'Большую машинку и сладости', category: 'diagnosis' },
  { id: 6, name: 'Тунгышбек Досайулы', birthDate: '01.06.2018', note: 'Аутизм', gift: 'Зимняя куртка 140 и сладости', category: 'diagnosis' },
  { id: 7, name: 'Сайлау Мирас', birthDate: '01.06.2022', note: 'ДЦП, Гиперкинез тяжелой формы', gift: 'Слитный зимний комбинезон рост 130 и сладости', category: 'diagnosis' },
  { id: 8, name: 'Насыбуллин Эльдар', birthDate: '01.06.2019', note: 'Аутизм', gift: 'Драконы Дневная и Ночная фурия, Фотоаппарат Botaqan litr котик', category: 'diagnosis' },
  { id: 9, name: 'Айбол Игилик', birthDate: '01.06.2014', note: 'ДЦП, Эпилепсия', gift: 'Куртка и сапоги и сладости', category: 'diagnosis' },
  { id: 10, name: 'Омиртас Алишер Кайрулы', birthDate: '01.06.2010', note: 'Бронхиальная астма тяжелая степень', gift: 'Уточняется', category: 'diagnosis' },
  { id: 11, name: 'Оразбай Ақмаржан Нурлыбайқызы', birthDate: '01.06.2014', note: 'Атрезия ануса', gift: 'Спортивная одежда 150 рост', category: 'diagnosis' },
  { id: 12, name: 'Оспиенко Ярослав Витальевич', birthDate: '01.06.2011', note: 'ДЦП, спастический тетрапарез', gift: 'Спортивный костюм Барыс 44', category: 'diagnosis' },
  { id: 13, name: 'Жакишева Айдана', birthDate: '01.06.2015', note: 'Нуждается в помощи', gift: 'Кулек сладостей с фруктами, орехами, торт, мишка коричневый', category: 'diagnosis' },
]

const childrenFromFamilies: Child[] = [
  { id: 101, name: 'Омаров Альтаир', birthDate: '01.06.2020', note: 'Неполная семья', gift: 'Планшет', category: 'family' },
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

// Telegram notification
async function sendTelegramNotification(child: Child, donor: { name: string; phone: string; email: string; message: string }) {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID

  if (!botToken || !chatId) {
    console.warn('Telegram credentials not configured')
    return
  }

  const categoryEmoji = child.category === 'diagnosis' ? '💙' : '👨‍👩‍👧‍👦'
  const categoryText = child.category === 'diagnosis' ? 'Ребёнок с диагнозом' : 'Многодетная семья'

  const message = `
🎅 *НОВАЯ ЗАЯВКА - ТАЙНЫЙ САНТА*

${categoryEmoji} *${categoryText}*

👶 *Ребёнок:* ${child.name}
📅 *Возраст:* ${calculateAge(child.birthDate)} лет
📝 *Примечание:* ${child.note}
🎁 *Подарок:* ${child.gift}

━━━━━━━━━━━━━━━

👤 *Донор:* ${donor.name}
📱 *Телефон:* ${donor.phone}
📧 *Email:* ${donor.email || 'не указан'}
💬 *Сообщение:* ${donor.message || 'нет'}

━━━━━━━━━━━━━━━
🔗 https://umit.asia/secret-santa
  `.trim()

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    })
  } catch (error) {
    console.error('Failed to send Telegram notification:', error)
  }
}

export default function SecretSantaPage() {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Add child modal
  const [showAddChildModal, setShowAddChildModal] = useState(false)
  const [addChildForm, setAddChildForm] = useState({
    childName: '',
    birthDate: '',
    category: 'diagnosis' as 'diagnosis' | 'family',
    note: '',
    gift: '',
    parentName: '',
    parentPhone: '',
    parentEmail: '',
    organization: '',
  })
  const [addChildSubmitted, setAddChildSubmitted] = useState(false)
  const [addChildSubmitting, setAddChildSubmitting] = useState(false)
  const [addChildError, setAddChildError] = useState<string | null>(null)

  // Filters
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'diagnosis' | 'family'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [ageFilter, setAgeFilter] = useState<'all' | '0-3' | '4-6' | '7-10' | '11+'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // SEO - set document title
  useEffect(() => {
    document.title = 'Тайный Санта - Подари чудо детям | Úmit'

    // Add meta tags
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Станьте Тайным Сантой для особенных детей. 26 детей ждут новогодних подарков. Подарите чудо!')
    }

    return () => {
      document.title = 'Úmit - Социальный реестр адресной помощи'
    }
  }, [])

  const allChildren = [...childrenWithDiagnosis, ...childrenFromFamilies]

  // Apply all filters
  const filteredChildren = useMemo(() => {
    return allChildren.filter(child => {
      // Category filter
      if (categoryFilter !== 'all' && child.category !== categoryFilter) {
        return false
      }

      // Search filter (name or gift)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesName = child.name.toLowerCase().includes(query)
        const matchesGift = child.gift.toLowerCase().includes(query)
        if (!matchesName && !matchesGift) {
          return false
        }
      }

      // Age filter
      if (ageFilter !== 'all') {
        const age = calculateAge(child.birthDate)
        switch (ageFilter) {
          case '0-3':
            if (age > 3) return false
            break
          case '4-6':
            if (age < 4 || age > 6) return false
            break
          case '7-10':
            if (age < 7 || age > 10) return false
            break
          case '11+':
            if (age < 11) return false
            break
        }
      }

      return true
    })
  }, [allChildren, categoryFilter, searchQuery, ageFilter])

  const handleReserve = (child: Child) => {
    setSelectedChild(child)
    setShowModal(true)
    setSubmitted(false)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedChild) return

    setIsSubmitting(true)
    setError(null)

    try {
      // Save to Supabase
      if (supabase) {
        const { error: dbError } = await supabase
          .from('santa_reservations')
          .insert({
            child_id: selectedChild.id,
            child_name: selectedChild.name,
            child_gift: selectedChild.gift,
            child_category: selectedChild.category,
            donor_name: formData.name,
            donor_phone: formData.phone,
            donor_email: formData.email || null,
            message: formData.message || null,
            status: 'pending',
          })

        if (dbError) {
          console.error('Supabase error:', dbError)
        }
      }

      // Send Telegram notification
      await sendTelegramNotification(selectedChild, formData)

      setSubmitted(true)
      setTimeout(() => {
        setShowModal(false)
        setFormData({ name: '', phone: '', email: '', message: '' })
      }, 3000)
    } catch (err) {
      console.error('Submit error:', err)
      setError('Произошла ошибка. Попробуйте ещё раз.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearFilters = () => {
    setCategoryFilter('all')
    setSearchQuery('')
    setAgeFilter('all')
  }

  const hasActiveFilters = categoryFilter !== 'all' || searchQuery !== '' || ageFilter !== 'all'

  // Random child selection
  const handleRandomChild = () => {
    const availableChildren = filteredChildren.filter(child => !child.reserved)
    if (availableChildren.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableChildren.length)
      const randomChild = availableChildren[randomIndex]
      handleReserve(randomChild)
    }
  }

  // Handle add child form submission
  const handleAddChildSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAddChildSubmitting(true)
    setAddChildError(null)

    try {
      // Format date from YYYY-MM-DD to DD.MM.YYYY for storage
      const formattedBirthDate = addChildForm.birthDate.split('-').reverse().join('.')

      // Save to Supabase
      if (supabase) {
        const { error: dbError } = await supabase
          .from('santa_child_requests')
          .insert({
            child_name: addChildForm.childName,
            birth_date: formattedBirthDate,
            category: addChildForm.category,
            note: addChildForm.note,
            gift: addChildForm.gift,
            parent_name: addChildForm.parentName,
            parent_phone: addChildForm.parentPhone,
            parent_email: addChildForm.parentEmail || null,
            organization: addChildForm.organization || null,
            status: 'pending',
          })

        if (dbError) {
          console.error('Supabase error:', dbError)
        }
      }

      // Send Telegram notification
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN
      const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID

      if (botToken && chatId) {
        const categoryText = addChildForm.category === 'diagnosis' ? 'Ребёнок с диагнозом' : 'Многодетная семья'
        // Format date from YYYY-MM-DD to DD.MM.YYYY
        const formattedDate = addChildForm.birthDate.split('-').reverse().join('.')
        const message = `
📝 *НОВАЯ ЗАЯВКА НА ДОБАВЛЕНИЕ РЕБЁНКА*

👶 *Ребёнок:* ${addChildForm.childName}
📅 *Дата рождения:* ${formattedDate}
📂 *Категория:* ${categoryText}
📝 *Примечание:* ${addChildForm.note}
🎁 *Желаемый подарок:* ${addChildForm.gift}

━━━━━━━━━━━━━━━

👤 *Контакт:* ${addChildForm.parentName}
📱 *Телефон:* ${addChildForm.parentPhone}
📧 *Email:* ${addChildForm.parentEmail || 'не указан'}
🏢 *Организация:* ${addChildForm.organization || 'не указана'}

━━━━━━━━━━━━━━━
🔗 https://umit.asia/secret-santa
        `.trim()

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        })
      }

      setAddChildSubmitted(true)
      setTimeout(() => {
        setShowAddChildModal(false)
        setAddChildForm({
          childName: '',
          birthDate: '',
          category: 'diagnosis',
          note: '',
          gift: '',
          parentName: '',
          parentPhone: '',
          parentEmail: '',
          organization: '',
        })
        setAddChildSubmitted(false)
      }, 3000)
    } catch (err) {
      console.error('Submit error:', err)
      setAddChildError('Произошла ошибка. Попробуйте ещё раз.')
    } finally {
      setAddChildSubmitting(false)
    }
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
          ❄
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

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleRandomChild}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg"
            >
              <span>🎲</span>
              <span>Случайный подарок</span>
            </button>
            <button
              onClick={() => setShowAddChildModal(true)}
              className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-5 py-2.5 rounded-full font-semibold transition-all border border-white/30"
            >
              <span>➕</span>
              <span>Добавить ребёнка</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="relative z-10 container mx-auto px-4 mb-8">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="🔍 Поиск по имени или подарку..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-blue-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex justify-center gap-1.5 sm:gap-2 flex-wrap mb-4">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all ${
              categoryFilter === 'all'
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            Все ({allChildren.length})
          </button>
          <button
            onClick={() => setCategoryFilter('diagnosis')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all ${
              categoryFilter === 'diagnosis'
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            💙 <span className="hidden sm:inline">С диагнозами</span><span className="sm:hidden">Диагноз</span> ({childrenWithDiagnosis.length})
          </button>
          <button
            onClick={() => setCategoryFilter('family')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-sm sm:text-base font-semibold transition-all ${
              categoryFilter === 'family'
                ? 'bg-yellow-400 text-yellow-900'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            👨‍👩‍👧‍👦 <span className="hidden sm:inline">Многодетные</span><span className="sm:hidden">Семьи</span> ({childrenFromFamilies.length})
          </button>
        </div>

        {/* Age Filters */}
        <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
          <span className="text-blue-200 text-xs sm:text-sm self-center mr-1 sm:mr-2">Возраст:</span>
          {(['all', '0-3', '4-6', '7-10', '11+'] as const).map((age) => (
            <button
              key={age}
              onClick={() => setAgeFilter(age)}
              className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
                ageFilter === age
                  ? 'bg-green-400 text-green-900'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {age === 'all' ? 'Все' : age === '11+' ? '11+' : age}
            </button>
          ))}
        </div>

        {/* View Toggle & Clear filters */}
        <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-900'
                  : 'text-white hover:bg-white/20'
              }`}
              title="Карточки"
            >
              <span className="hidden sm:inline">▦</span> Карточки
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-blue-900'
                  : 'text-white hover:bg-white/20'
              }`}
              title="Список"
            >
              <span className="hidden sm:inline">☰</span> Список
            </button>
          </div>

          {hasActiveFilters && (
            <>
              <span className="text-blue-200 text-sm">
                Найдено: {filteredChildren.length} из {allChildren.length}
              </span>
              <button
                onClick={clearFilters}
                className="text-yellow-400 hover:text-yellow-300 text-sm underline"
              >
                Сбросить фильтры
              </button>
            </>
          )}
        </div>
      </div>

      {/* Children Grid/List */}
      <div className="relative z-10 container mx-auto px-4 pb-16">
        {filteredChildren.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white text-xl mb-2">Ничего не найдено</p>
            <p className="text-blue-200">Попробуйте изменить параметры поиска</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-yellow-400 text-yellow-900 rounded-full font-semibold hover:bg-yellow-300 transition-all"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
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
        ) : (
          /* List View */
          <div className="space-y-3 md:space-y-0 md:bg-white md:rounded-2xl md:shadow-xl md:overflow-hidden">
            {/* List Header - Desktop only */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-gray-100 text-sm font-semibold text-gray-600">
              <div className="col-span-3">Имя</div>
              <div className="col-span-1 text-center">Возраст</div>
              <div className="col-span-3">Примечание</div>
              <div className="col-span-3">Подарок</div>
              <div className="col-span-2"></div>
            </div>
            {/* List Items */}
            {filteredChildren.map((child, index) => (
              <div
                key={child.id}
                className={`
                  bg-white rounded-xl shadow-md p-4
                  md:rounded-none md:shadow-none md:p-0
                  md:grid md:grid-cols-12 md:gap-4 md:px-6 md:py-4 md:items-center
                  hover:bg-gray-50 transition-colors
                  ${index !== filteredChildren.length - 1 ? 'md:border-b md:border-gray-100' : ''}
                `}
              >
                {/* Mobile Card Layout */}
                <div className="md:hidden space-y-3">
                  {/* Header with name and age */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {child.category === 'diagnosis' ? '💙' : '👨‍👩‍👧‍👦'}
                      </span>
                      <span className="font-semibold text-gray-800">{child.name}</span>
                    </div>
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                      {calculateAge(child.birthDate)}
                    </span>
                  </div>
                  {/* Note */}
                  <p className="text-xs text-gray-500 line-clamp-2">{child.note}</p>
                  {/* Gift and Button row */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-1.5 bg-gradient-to-r from-red-50 to-green-50 rounded-lg px-2.5 py-1.5">
                      <span className="text-sm">🎁</span>
                      <span className="font-medium text-gray-800 text-xs truncate">{child.gift}</span>
                    </div>
                    <button
                      onClick={() => handleReserve(child)}
                      className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 whitespace-nowrap"
                    >
                      🎅 Выбрать
                    </button>
                  </div>
                </div>

                {/* Desktop Row Layout */}
                <div className="hidden md:contents">
                  <div className="col-span-3 flex items-center gap-3">
                    <span className="text-2xl">
                      {child.category === 'diagnosis' ? '💙' : '👨‍👩‍👧‍👦'}
                    </span>
                    <div className="font-semibold text-gray-800">{child.name}</div>
                  </div>

                  <div className="col-span-1 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                      {calculateAge(child.birthDate)}
                    </span>
                  </div>

                  <div className="col-span-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{child.note}</p>
                  </div>

                  <div className="col-span-3">
                    <div className="flex items-center gap-2 bg-gradient-to-r from-red-50 to-green-50 rounded-lg px-3 py-2">
                      <span>🎁</span>
                      <span className="font-medium text-gray-800 text-sm">{child.gift}</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <button
                      onClick={() => handleReserve(child)}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-2 px-3 rounded-lg transition-all text-sm flex items-center justify-center gap-1"
                    >
                      <span>🎅</span>
                      <span className="hidden lg:inline">Стать Сантой</span>
                      <span className="lg:hidden">Выбрать</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                <div className="text-center py-6">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Спасибо!</h3>
                  <p className="text-gray-600 mb-4">
                    Ваша заявка принята. Мы свяжемся с вами в ближайшее время!
                  </p>
                  <div className="bg-blue-50 rounded-xl p-4 text-left">
                    <p className="text-sm text-gray-600 mb-3">
                      Если с вами не связались для уточнения деталей, вы можете связаться напрямую с волонтёром:
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://wa.me/77014058207"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        <span>💬</span>
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href="tel:+77014058207"
                        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                      >
                        <span>📞</span>
                        <span>Позвонить</span>
                      </a>
                    </div>
                  </div>
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

                  {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                      {error}
                    </div>
                  )}

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
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Отправка...' : 'Отправить заявку 🎅'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Child Modal */}
      {showAddChildModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">Добавить ребёнка</h3>
                  <p className="text-white/80">Заполните анкету</p>
                </div>
                <button
                  onClick={() => setShowAddChildModal(false)}
                  className="text-white/80 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6">
              {addChildSubmitted ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Заявка отправлена!</h3>
                  <p className="text-gray-600">
                    Мы рассмотрим вашу заявку и свяжемся с вами.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">
                    Если ваш ребёнок нуждается в новогоднем подарке, заполните форму ниже.
                  </p>

                  {addChildError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                      {addChildError}
                    </div>
                  )}

                  <form onSubmit={handleAddChildSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ФИО ребёнка *
                      </label>
                      <input
                        type="text"
                        required
                        value={addChildForm.childName}
                        onChange={(e) => setAddChildForm({ ...addChildForm, childName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Иванов Иван Иванович"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата рождения *
                      </label>
                      <input
                        type="date"
                        required
                        value={addChildForm.birthDate}
                        onChange={(e) => setAddChildForm({ ...addChildForm, birthDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Категория *
                      </label>
                      <select
                        value={addChildForm.category}
                        onChange={(e) => setAddChildForm({ ...addChildForm, category: e.target.value as 'diagnosis' | 'family' })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="diagnosis">Ребёнок с диагнозом</option>
                        <option value="family">Многодетная семья</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Диагноз / Примечание *
                      </label>
                      <textarea
                        required
                        value={addChildForm.note}
                        onChange={(e) => setAddChildForm({ ...addChildForm, note: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={2}
                        placeholder="Укажите диагноз или информацию о семье"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Желаемый подарок *
                      </label>
                      <input
                        type="text"
                        required
                        value={addChildForm.gift}
                        onChange={(e) => setAddChildForm({ ...addChildForm, gift: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="О чём мечтает ребёнок?"
                      />
                    </div>

                    <hr className="my-4" />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ФИО родителя *
                      </label>
                      <input
                        type="text"
                        required
                        value={addChildForm.parentName}
                        onChange={(e) => setAddChildForm({ ...addChildForm, parentName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        value={addChildForm.parentPhone}
                        onChange={(e) => setAddChildForm({ ...addChildForm, parentPhone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={addChildForm.parentEmail}
                        onChange={(e) => setAddChildForm({ ...addChildForm, parentEmail: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="example@mail.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Организация / Фонд
                      </label>
                      <input
                        type="text"
                        value={addChildForm.organization}
                        onChange={(e) => setAddChildForm({ ...addChildForm, organization: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Название организации (если есть)"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={addChildSubmitting}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addChildSubmitting ? 'Отправка...' : 'Отправить заявку ➕'}
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
