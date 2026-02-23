import { getFAQ } from '@/lib/content'
import { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
    title: 'FAQ | Frequently Asked Questions',
    description: 'Find answers to common questions about traveling to Sri Lanka, visas, currency, safety, and booking with Panora Travels.',
}

export default function FAQPage() {
    const faqs = getFAQ()

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-slate-900 text-white py-16 md:py-24 text-center">
                <div className="container max-w-4xl px-4">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-slate-300 text-lg">Everything you need to know about traveling in Sri Lanka with Panora Travels.</p>
                </div>
            </div>

            {/* FAQ Content */}
            <div className="container max-w-4xl px-4 py-12 md:py-16">
                {faqs.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-12">
                        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">
                            {section.category}
                        </h2>
                        <div className="space-y-4">
                            {section.questions.map((item, itemIndex) => (
                                <details key={itemIndex} className="group bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                    <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                                        <span className="font-medium text-slate-900 pr-4">{item.q}</span>
                                        <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0 group-open:rotate-180 transition-transform" />
                                    </summary>
                                    <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                        {item.a}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                ))}

                {/* CTA */}
                <div className="mt-16 bg-emerald-50 rounded-2xl p-8 text-center border border-emerald-100">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">Still have questions?</h3>
                    <p className="text-slate-600 mb-6">Our team is happy to help with any queries about your Sri Lanka adventure.</p>
                    <a href="/contact" className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 text-white font-bold hover:bg-emerald-700 transition-colors">
                        Contact Us
                    </a>
                </div>
            </div>
        </div>
    )
}
