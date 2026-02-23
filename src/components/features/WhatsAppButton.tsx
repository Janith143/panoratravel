'use client'

import { MessageCircle } from 'lucide-react'
import { useState } from 'react'

export default function WhatsAppButton() {
    const [isHovered, setIsHovered] = useState(false)
    const phoneNumber = '94719276870' // Sri Lanka WhatsApp number
    const message = encodeURIComponent('Hello! I am interested in planning a trip to Sri Lanka.')

    return (
        <a
            href={`https://wa.me/${phoneNumber}?text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Tooltip */}
            <div className={`absolute bottom-full right-0 mb-2 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                Chat with us on WhatsApp
                <div className="absolute top-full right-4 border-8 border-transparent border-t-slate-900" />
            </div>

            {/* Button */}
            <div className="relative">
                {/* Pulse Animation */}
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25" />

                {/* Main Button */}
                <div className="relative h-14 w-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 cursor-pointer">
                    <MessageCircle className="h-7 w-7 text-white" />
                </div>
            </div>
        </a>
    )
}
