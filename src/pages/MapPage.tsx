import { useTranslation } from 'react-i18next'

export default function MapPage() {
  const { t } = useTranslation()

  // Google Maps embed URL
  const googleMapsEmbedUrl = "https://www.google.com/maps/d/embed?mid=1D6ObTqHgvHbSjoIgEsBL5HylG8ovAldY&ehbc=2E312F"

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-4">{t('map.title')}</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold">
              {t('map.all')}
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300">
              {t('map.helpRequests')}
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300">
              {t('map.shelters')}
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300">
              {t('map.volunteers')}
            </button>
          </div>
        </div>
      </div>

      {/* Google Maps iframe */}
      <div className="flex-1 relative">
        <iframe
          src={googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Maps"
          className="w-full h-full"
        />

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="font-bold mb-2 text-sm">{t('map.legend')}</h3>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
              <span>{t('map.helpRequests')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>{t('map.shelters')}</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
              <span>{t('map.volunteers')}</span>
            </div>
          </div>

          {/* Link to open in Google Maps */}
          <a
            href="https://goo.gl/maps/Su2h8i2GKBLwcjfJ8"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block text-center text-xs text-primary-600 hover:text-primary-800 font-medium"
          >
            {t('map.openInGoogleMaps', 'Открыть в Google Maps')} →
          </a>
        </div>
      </div>
    </div>
  )
}
