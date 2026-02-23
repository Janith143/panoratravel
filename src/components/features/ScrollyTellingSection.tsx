'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { IMAGES } from '@/lib/images'

const features = [
    {
        title: "Ancient Miracles",
        description: "Walk in the footsteps of kings atop Sigiriya and explore the sacred ruins of Polonnaruwa.",
        image: IMAGES.hero.scroll_1
    },
    {
        title: "Wild Encounters",
        description: "Witness the majestic gathering of elephants and the elusive leopard in their natural habitat.",
        image: IMAGES.hero.scroll_2
    },
    {
        title: "Pristine Coasts",
        description: "Unwind on golden sands and watch whales breach in the azure waters of the Indian Ocean.",
        image: IMAGES.hero.scroll_3
    }
]

export default function ScrollyTellingSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    })

    return (
        <div ref={containerRef} className="py-20 bg-slate-50 relative">
            <div className="container max-w-6xl px-4 space-y-32">
                {features.map((feature, i) => (
                    <FeatureItem key={i} feature={feature} index={i} />
                ))}
            </div>
        </div>
    )
}

function FeatureItem({ feature, index }: { feature: typeof features[0], index: number }) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    })

    // Zoom out effect as it enters view
    const scale = useTransform(scrollYProgress, [0, 1], [1.2, 1])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
    const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? 50 : -50, 0])

    return (
        <div ref={ref} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-16 items-center`}>
            <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-2xl bg-slate-200 aspect-[4/3]">
                <motion.div style={{ scale, opacity }} className="w-full h-full relative">
                    <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url('${feature.image}')` }}
                    />
                </motion.div>
            </div>

            <motion.div
                style={{ opacity, x }}
                className="w-full md:w-1/2 space-y-4"
            >
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">{feature.title}</h2>
                <p className="text-lg text-slate-600 leading-relaxed font-light">
                    {feature.description}
                </p>
            </motion.div>
        </div>
    )
}
