'use client'

import { useEffect } from 'react'

export function ServiceWorkerCleaner() {
    useEffect(() => {
        if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then((registrations) => {
                for (let registration of registrations) {
                    console.log('Unregistering stale service worker:', registration)
                    registration.unregister()
                }
            })
        }
    }, [])

    return null
}
