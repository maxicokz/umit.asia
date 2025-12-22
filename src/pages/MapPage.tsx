import { useTranslation } from 'react-i18next'

export default function MapPage() {
  const { t } = useTranslation()

  // Google Maps embed URL
  const googleMapsEmbedUrl = "https://www.google.com/maps/d/embed?mid=1D6ObTqHgvHbSjoIgEsBL5HylG8ovAldY&ehbc=2E312F"

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Minimal Header */}
      <div className="bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">{t('map.title')}</h1>
        <a
          href="https://www.google.com/maps/d/viewer?mid=1D6ObTqHgvHbSjoIgEsBL5HylG8ovAldY"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {t('map.openInGoogleMaps', 'Открыть в Google Maps')}
        </a>
      </div>

      {/* Google Maps iframe - full height */}
      <div className="flex-1">
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
      </div>
    </div>
  )
}
