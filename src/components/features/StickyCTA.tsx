'use client'

import { MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default function StickyCTA() {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-slate-200 p-3 shadow-lg">
            <div className="flex gap-3">
                <a
                    href="https://wa.me/94719276870"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
                >
                    <MessageSquare className="h-5 w-5" />
                    WhatsApp
                </a>
                <Link
                    href="/contact"
                    className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                >
                    Get Quote
                </Link>
            </div>
        </div>
    )
}
