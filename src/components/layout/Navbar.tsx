'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Phone, X, ChevronDown, MapPin, Droplets, PawPrint, Mountain, Shield, Trees, Landmark, Waves } from 'lucide-react'

import { getGlobalCategories } from '@/lib/content'

const getExploreLinks = () => {
    const categories = getGlobalCategories()
    const iconMap: any = {
        'Nature & Ecology': Trees,
        'Culture & Heritage': Landmark,
        'Adventure & Sports': Mountain,
        'Wildlife & Safari': PawPrint,
        'Relax & Wellness': Droplets,
        'Beach & Coastal': Waves,
        'Heritage': Landmark,
        'Hiking & Trekking': MapPin,
        'Travel Tips': Shield,
        'Transport': ChevronDown
    }

    return categories.map(cat => ({
        href: `/destinations?category=${cat}`, // Assuming filtering by category works this way
        label: cat,
        icon: iconMap[cat] || MapPin,
        description: `Explore ${cat}`
    }))
}

export default function Navbar() {
    const exploreLinks = getExploreLinks()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isExploreOpen, setIsExploreOpen] = useState(false)

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background shadow-sm">
            <div className="container flex h-20 max-w-7xl items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="text-2xl font-heading font-bold text-primary tracking-tight">Panora<span className="text-secondary">Travels</span></span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/tours" className="hover:text-primary transition-colors">Packages</Link>

                    {/* Explore Dropdown */}
                    <div className="relative group"
                        onMouseEnter={() => setIsExploreOpen(true)}
                        onMouseLeave={() => setIsExploreOpen(false)}
                    >
                        <Link href="/destinations" className="flex items-center gap-1 hover:text-primary transition-colors">
                            Explore
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExploreOpen ? 'rotate-180' : ''}`} />
                        </Link>

                        {/* Dropdown Menu */}
                        <div className={`absolute top-full left-0 pt-2 ${isExploreOpen ? 'block' : 'hidden'}`}>
                            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2 min-w-[240px]">
                                {exploreLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                            <link.icon className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900">{link.label}</div>
                                            <div className="text-xs text-slate-500">{link.description}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <Link href="/planner" className="hover:text-primary transition-colors">Planner</Link>
                    <Link href="/services/fleet" className="hover:text-primary transition-colors">Fleet</Link>
                    <Link href="/reviews" className="hover:text-primary transition-colors">Reviews</Link>
                    <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                    <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <a href="tel:+94719276870" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                        <Phone className="h-4 w-4" />
                        <span>+94 71 927 6870</span>
                    </a>
                    <Link href="/contact" className="hidden sm:inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                        Plan Your Trip
                    </Link>

                    {/* Mobile Menu Trigger */}
                    <button
                        type="button"
                        className="md:hidden p-2 text-foreground cursor-pointer z-50 relative active:scale-95 transition-transform touch-manipulation"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-20 z-50 bg-background border-t border-border/40 p-4 animate-in slide-in-from-top-5 overflow-y-auto">
                    <nav className="flex flex-col gap-2 text-lg font-medium p-4">
                        <Link href="/" className="hover:text-primary py-3 border-b border-border/50" onClick={toggleMenu}>Home</Link>
                        <Link href="/tours" className="hover:text-primary py-3 border-b border-border/50" onClick={toggleMenu}>Packages</Link>

                        {/* Explore Section - Mobile */}
                        <div className="py-2 border-b border-border/50">
                            <div className="text-xs uppercase text-muted-foreground mb-2">Explore</div>
                            {exploreLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center gap-3 py-2 hover:text-primary"
                                    onClick={toggleMenu}
                                >
                                    <link.icon className="w-5 h-5 text-emerald-600" />
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <Link href="/planner" className="hover:text-primary py-3 border-b border-border/50" onClick={toggleMenu}>Trip Planner</Link>
                        <Link href="/services/fleet" className="hover:text-primary py-3 border-b border-border/50" onClick={toggleMenu}>Our Fleet</Link>
                        <Link href="/reviews" className="hover:text-primary py-3 border-b border-border/50" onClick={toggleMenu}>Reviews</Link>
                        <Link href="/blog" className="hover:text-primary py-3 border-b border-border/50" onClick={toggleMenu}>Blog</Link>
                        <Link href="/gallery" className="hover:text-primary py-3 border-b border-border/50" onClick={toggleMenu}>Gallery</Link>
                        <Link href="/contact" className="hover:text-primary py-3 border-b border-border/50" onClick={toggleMenu}>Contact Us</Link>

                        <div className="mt-4 flex flex-col gap-3">
                            <a href="tel:+94719276870" className="flex items-center gap-2 text-muted-foreground hover:text-foreground py-2">
                                <Phone className="h-4 w-4" />
                                <span>+94 71 927 6870</span>
                            </a>
                            <Link href="/contact" className="flex h-12 w-full items-center justify-center rounded-md bg-primary text-white font-bold shadow" onClick={toggleMenu}>
                                Plan Your Trip Now
                            </Link>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}
