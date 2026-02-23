import { Metadata } from 'next'
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Contact Us | Panora Travels',
    description: 'Get in touch with Panora Travels to plan your dream Sri Lankan holiday. We are available 24/7 via phone, email, or WhatsApp.',
}

export default function ContactPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-slate-900 text-white py-16 md:py-24 text-center">
                <div className="container max-w-7xl px-4 md:px-8">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Contact Us</h1>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">We'd love to hear from you. Let's start planning your adventure.</p>
                </div>
            </div>

            <div className="container max-w-7xl px-4 md:px-8 py-12 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Info Card */}
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100 h-fit">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif">Get in Touch</h2>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                                    <Phone className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Call Us (24/7)</p>
                                    <a href="tel:+94719276870" className="text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors">+94 71 927 6870</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Email Us</p>
                                    <a href="mailto:hello@panoratravels.com" className="text-xl font-bold text-slate-900 hover:text-emerald-600 transition-colors">hello@panoratravels.com</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
                                    <MapPin className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Visit Us</p>
                                    <p className="text-lg text-slate-800 leading-snug">No 123, Temple Road,<br />Colombo 03, Sri Lanka</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-100">
                            <a href="https://wa.me/94719276870" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full bg-emerald-500 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20">
                                <MessageCircle className="mr-2 h-5 w-5" /> Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif">Send Us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-slate-700">Full Name</label>
                                    <input type="text" id="name" className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 transition-all focus:bg-white text-slate-900" placeholder="John Doe" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-slate-700">Email Address</label>
                                    <input type="email" id="email" className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 transition-all focus:bg-white text-slate-900" placeholder="john@example.com" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="subject" className="text-sm font-medium text-slate-700">Subject</label>
                                <div className="relative">
                                    <select id="subject" className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 transition-all focus:bg-white appearance-none cursor-pointer text-slate-900">
                                        <option>General Inquiry</option>
                                        <option>Tour Booking</option>
                                        <option>Vehicle Rental</option>
                                        <option>Partnership</option>
                                    </select>
                                    {/* Custom arrow could go here */}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-slate-700">Message</label>
                                <textarea id="message" rows={5} className="w-full p-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-slate-50 transition-all focus:bg-white resize-none text-slate-900" placeholder="Tell us about your travel plans..."></textarea>
                            </div>

                            <button type="button" className="w-full h-12 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-[0.99]">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
