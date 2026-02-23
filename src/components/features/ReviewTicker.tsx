'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, User } from 'lucide-react'
import Image from 'next/image'

export default function ReviewTicker() {
    const [reviews, setReviews] = useState<any[]>([])

    useEffect(() => {
        // Fetch all reviews, then take top 5 recent or featured
        fetch('/api/reviews')
            .then(res => res.json())
            .then(data => {
                const allReviews = data.reviews || []
                // Take up to 10 latest reviews to keep ticker fresh
                setReviews(allReviews.slice(0, 10))
            })
            .catch(err => console.error(err))
    }, [])

    if (reviews.length === 0) return null

    // Ensure we have enough copies for smooth infinite scroll
    const duplicationFactor = Math.ceil(20 / reviews.length) + 2
    const displayReviews = Array(duplicationFactor).fill(reviews).flat()

    return (
        <div className="w-full bg-black/40 backdrop-blur-md border-t border-white/10 py-4 overflow-hidden absolute bottom-0 z-40">
            <motion.div
                className="flex gap-8 items-center"
                animate={{ x: ['0%', '-50%'] }}
                transition={{
                    repeat: Infinity,
                    ease: 'linear',
                    duration: Math.max(20, reviews.length * 5)
                }}
                style={{ width: 'fit-content' }}
            >
                {displayReviews.map((review, idx) => (
                    <Link
                        href="/reviews"
                        key={`${review.id}-${idx}`}
                        className="flex items-center gap-3 md:gap-4 bg-white/10 rounded-full px-4 md:px-5 py-1.5 md:py-2 border border-white/5 min-w-[260px] md:min-w-[300px] hover:bg-white/20 transition-colors cursor-pointer"
                    >
                        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border border-white/20">
                            {review.userImage ? (
                                <Image src={review.userImage} alt={review.userName} width={40} height={40} className="object-cover w-full h-full" />
                            ) : (
                                <User className="h-4 w-4 md:h-5 md:w-5 text-slate-400" />
                            )}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-white font-bold text-xs md:text-sm shadow-black drop-shadow-md">{review.userName || 'Guest'}</span>
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-2.5 h-2.5 md:w-3 md:h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-slate-200 text-[10px] md:text-xs truncate max-w-[200px] md:max-w-[250px] leading-tight opacity-90">
                                {review.text}
                            </p>
                        </div>
                    </Link>
                ))}
            </motion.div>
        </div>
    )
}
