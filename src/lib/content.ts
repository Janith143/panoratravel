import content from '@/data/content.json'
import destinationsData from '@/data/destinations-data.json'

// Types based on the JSON structure
export type Tour = typeof content.tours[0]
export type Destination = typeof content.destinations[0]

// Extended types for new data
export type Province = typeof destinationsData.provinces[0]
export type District = typeof destinationsData.districts[0]
export type Category = typeof destinationsData.categories[0]
export type BaseAttraction = typeof destinationsData.attractions[0]
export interface Attraction extends Omit<BaseAttraction, 'map'> {
    map?: {
        x: number
        y: number
        lat: number
        lng: number
    }
}
export type Waterfall = typeof destinationsData.waterfalls[0]
export type NationalPark = typeof destinationsData.nationalParks[0]
export type AdventureHub = typeof destinationsData.adventureHubs[0]
export type BlogPost = typeof content.posts[0]
export type FAQCategory = typeof content.faq[0]
export type SiteConfig = typeof content.siteConfig

// Read functions for original content
export function getTours(): Tour[] {
    return content.tours
}

export function getTourBySlug(slug: string): Tour | undefined {
    return content.tours.find(t => t.slug === slug)
}

export function getDestinations(): Destination[] {
    return content.destinations
}

export function getDestinationBySlug(slug: string): Destination | undefined {
    return content.destinations.find(d => d.slug === slug)
}

// New functions for expanded destinations data
export function getProvinces(): Province[] {
    return destinationsData.provinces
}

export function getDistricts(): District[] {
    return destinationsData.districts
}

export function getDistrictsByProvince(provinceId: string): District[] {
    return destinationsData.districts.filter(d => d.province === provinceId)
}

export function getCategories(): Category[] {
    return destinationsData.categories
}

export function getAttractions(): Attraction[] {
    return destinationsData.attractions
}

export function getAttractionsByDistrict(districtId: string): Attraction[] {
    return destinationsData.attractions.filter(a => a.district === districtId)
}

export function getAttractionsByCategory(categoryId: string): Attraction[] {
    return destinationsData.attractions.filter(a => a.categories.includes(categoryId))
}

export function getAttractionById(id: string): Attraction | undefined {
    return destinationsData.attractions.find(a => a.id === id)
}

export function getWaterfalls(): Waterfall[] {
    return destinationsData.waterfalls
}

export function getNationalParks(): NationalPark[] {
    return destinationsData.nationalParks
}

export function getAdventureHubs(): AdventureHub[] {
    return destinationsData.adventureHubs
}

// New functions for Blog, FAQ, Site Config
export function getPosts(): BlogPost[] {
    return content.posts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    return content.posts.find(p => p.slug === slug)
}

export function getFAQ(): FAQCategory[] {
    return content.faq
}

export function getSiteConfig(): SiteConfig {
    return content.siteConfig
}

export function getGlobalCategories(): string[] {
    return destinationsData.categories.map((c: any) => c.name)
}

// Filter attractions by multiple criteria
export function filterAttractions(filters: {
    district?: string
    category?: string
    search?: string
}): Attraction[] {
    let results = destinationsData.attractions

    if (filters.district) {
        const districtId = filters.district
        results = results.filter(a => a.district === districtId)
    }

    if (filters.category) {
        const categoryId = filters.category
        results = results.filter(a => a.categories.includes(categoryId))
    }

    if (filters.search) {
        const query = filters.search.toLowerCase()
        results = results.filter(a =>
            a.name.toLowerCase().includes(query) ||
            a.description.toLowerCase().includes(query)
        )
    }

    return results
}

// Get district name by id
export function getDistrictName(districtId: string): string {
    const district = destinationsData.districts.find(d => d.id === districtId)
    return district?.name || districtId
}

// Get province name by id
export function getProvinceName(provinceId: string): string {
    const province = destinationsData.provinces.find(p => p.id === provinceId)
    return province?.name || provinceId
}

// Helper to get either a Destination (Region) or an Attraction by slug/id
export function getAnyDestination(slug: string): NextDestination | undefined {
    // 1. Try finding in content.json (Regions like Kandy, Galle)
    const region = content.destinations.find(d => d.slug === slug)
    if (region) return { type: 'region', data: region }

    // 2. Try finding in destinations-data.json (Attractions like Sigiriya Rock)
    const attraction = destinationsData.attractions.find(a => a.id === slug)
    if (attraction) return { type: 'attraction', data: attraction }

    return undefined
}

export type NextDestination =
    | { type: 'region', data: Destination }
    | { type: 'attraction', data: Attraction }

// Tourist Regions for Visual Map Filter
export type TouristRegion = {
    id: string
    name: string
    description: string
    districts: string[]
}

const touristRegions: TouristRegion[] = [
    {
        id: '1',
        name: 'North & East Region',
        description: 'Ancient temples, pristine beaches, and lagoons',
        districts: ['jaffna', 'kilinochchi', 'mullaitivu', 'mannar', 'vavuniya', 'trincomalee', 'batticaloa', 'ampara']
    },
    {
        id: '2',
        name: 'Cultural Triangle',
        description: 'Heritage sites, ancient kingdoms, and art',
        districts: ['anuradhapura', 'polonnaruwa', 'matale', 'kurunegala']
    },
    {
        id: '3',
        name: 'Hill Country',
        description: 'Tea plantations, misty mountains, and waterfalls',
        districts: ['kandy', 'nuwara-eliya', 'badulla', 'monaragala', 'kegalle', 'ratnapura']
    },
    {
        id: '4',
        name: 'West Coast',
        description: 'Commercial hubs, nightlife, and golden shores',
        districts: ['puttalam', 'gampaha', 'colombo', 'kalutara']
    },
    {
        id: '5',
        name: 'South Coast',
        description: 'Surfing, whale watching, and colonial forts',
        districts: ['galle', 'matara', 'hambantota']
    }
]

export function getTouristRegions(): TouristRegion[] {
    return touristRegions
}

export function getRegionByDistrict(districtId: string): TouristRegion | undefined {
    return touristRegions.find(r => r.districts.includes(districtId))
}

export function getAttractionsByRegion(regionId: string): Attraction[] {
    const region = touristRegions.find(r => r.id === regionId)
    if (!region) return []
    return destinationsData.attractions.filter(a => region.districts.includes(a.district))
}
