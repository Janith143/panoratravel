import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react'
import { getSiteConfig } from '@/lib/content'

export default function Footer() {
    const siteConfig = getSiteConfig()

    return (
        <footer className="w-full bg-slate-950 text-slate-200 border-t border-slate-800">
            <div className="container max-w-7xl px-4 md:px-8 py-12 md:py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">

                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1 space-y-4">
                        <span className="text-2xl font-heading font-bold text-emerald-500 tracking-tight">Panora<span className="text-amber-500">Travels</span></span>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            {siteConfig.about.footerTagline}
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Link href={siteConfig.links.facebook} className="text-slate-400 hover:text-white transition-colors"><Facebook className="h-5 w-5" /></Link>
                            <Link href={siteConfig.links.instagram} className="text-slate-400 hover:text-white transition-colors"><Instagram className="h-5 w-5" /></Link>
                            <Link href={siteConfig.links.twitter} className="text-slate-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></Link>
                        </div>
                    </div>

                    {/* Explore */}
                    <div>
                        <h3 className="font-heading font-semibold text-white mb-4">Explore</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/destinations" className="hover:text-emerald-400 transition-colors">Destinations</Link></li>
                            <li><Link href="/national-parks" className="hover:text-emerald-400 transition-colors">National Parks</Link></li>
                            <li><Link href="/waterfalls" className="hover:text-emerald-400 transition-colors">Waterfalls</Link></li>
                            <li><Link href="/adventure" className="hover:text-emerald-400 transition-colors">Adventure</Link></li>
                            <li><Link href="/planner" className="hover:text-emerald-400 transition-colors">Trip Planner</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="font-heading font-semibold text-white mb-4">Services</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/tours" className="hover:text-emerald-400 transition-colors">Tour Packages</Link></li>
                            <li><Link href="/services/fleet" className="hover:text-emerald-400 transition-colors">Vehicle Fleet</Link></li>
                            <li><Link href="/safety" className="hover:text-emerald-400 transition-colors">Safety Hub</Link></li>
                            <li><Link href="/reviews" className="hover:text-emerald-400 transition-colors">Reviews</Link></li>
                            <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Travel Blog</Link></li>
                            <li><Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQ</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-heading font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                            <li><Link href="/team" className="hover:text-emerald-400 transition-colors">Our Team</Link></li>
                            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
                            <li><Link href="/portal" className="hover:text-emerald-400 transition-colors">Client Portal</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-heading font-semibold text-white mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="h-4 w-4 mt-1 text-emerald-500 shrink-0" />
                                <span>{siteConfig.contact.address}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span>{siteConfig.contact.phone}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span>{siteConfig.contact.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-900 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Panora Travels. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
