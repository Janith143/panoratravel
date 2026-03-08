'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type TripPlannerContextType = {
    destinations: string[]
    addDestination: (id: string) => void
    removeDestination: (id: string) => void
    reorderDestinations: (newIds: string[]) => void
    clearPlanner: () => void
    isInPlanner: (id: string) => boolean
}

const TripPlannerContext = createContext<TripPlannerContextType | undefined>(undefined)

export function TripPlannerProvider({ children }: { children: React.ReactNode }) {
    const [destinations, setDestinations] = useState<string[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('tripPlannerDestinations')
        if (saved) {
            try {
                setDestinations(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse saved destinations', e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to local storage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('tripPlannerDestinations', JSON.stringify(destinations))
        }
    }, [destinations, isLoaded])

    const addDestination = (id: string) => {
        setDestinations(prev => {
            if (prev.includes(id)) return prev
            return [...prev, id]
        })
    }

    const removeDestination = (id: string) => {
        setDestinations(prev => prev.filter(d => d !== id))
    }

    const reorderDestinations = (newIds: string[]) => {
        setDestinations(newIds)
    }

    const clearPlanner = () => {
        setDestinations([])
    }

    const isInPlanner = (id: string) => destinations.includes(id)

    return (
        <TripPlannerContext.Provider value={{ destinations, addDestination, removeDestination, reorderDestinations, clearPlanner, isInPlanner }}>
            {children}
        </TripPlannerContext.Provider>
    )
}

export function useTripPlanner() {
    const context = useContext(TripPlannerContext)
    if (context === undefined) {
        throw new Error('useTripPlanner must be used within a TripPlannerProvider')
    }
    return context
}
