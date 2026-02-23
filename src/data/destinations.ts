import { IMAGES } from '@/lib/images'

export const destinations = [
    {
        id: 'sigiriya',
        name: 'Sigiriya',
        description: 'The ancient rock fortress and palace ruin, Sigiriya is a UNESCO World Heritage site and the most visited historic site in Sri Lanka. Known as the Lion Rock, it stands 200 meters high over the surrounding plains.',
        image: IMAGES.destinations.sigiriya,
        slug: 'sigiriya',
        highlights: ['Lion Gate', 'Mirror Wall', 'Frescoes', 'Water Gardens'],
        attractions: [
            { name: 'Pidurangala Rock', description: 'Offers the best view of Sigiriya Rock.' },
            { name: 'Sigiriya Museum', description: 'Describes the history and architecture.' }
        ]
    },
    {
        id: 'galle',
        name: 'Galle',
        description: 'A historic Dutch Fort and UNESCO World Heritage site. Galle is the best example of a fortified city built by Europeans in South and South East Asia.',
        image: IMAGES.destinations.galle,
        slug: 'galle',
        highlights: ['Dutch Fort', 'Lighthouse', 'Maritime Museum', 'Dutch Reformed Church'],
        attractions: [
            { name: 'Unawatuna Beach', description: 'A popular beach just minutes away.' },
            { name: 'Jungle Beach', description: 'A secluded bay perfect for snorkeling.' }
        ]
    },
    {
        id: 'kandy',
        name: 'Kandy',
        description: 'The cultural capital and home to the Temple of the Tooth. Kandy is a major city in Sri Lanka located in the Central Province.',
        image: IMAGES.destinations.kandy,
        slug: 'kandy',
        highlights: ['Temple of the Tooth Relic', 'Kandy Lake', 'Peradeniya Botanical Gardens', 'Cultural Dance Show'],
        attractions: [
            { name: 'Udawatta Kele Sanctuary', description: 'A historic forest reserve.' },
            { name: 'Ceylon Tea Museum', description: 'Learn about the history of tea.' }
        ]
    },
    {
        id: 'ella',
        name: 'Ella',
        description: 'A mountain village famous for its hiking trails and scenic views. Ella offers breathtaking views and a cool climate.',
        image: IMAGES.destinations.ella,
        slug: 'ella',
        highlights: ['Nine Arch Bridge', 'Little Adams Peak', 'Ella Rock', 'Ravana Falls'],
        attractions: [
            { name: 'Lipton Seat', description: 'Where Sir Thomas Lipton surveyed his tea empire.' },
            { name: 'Diyaluma Falls', description: 'The second highest waterfall in Sri Lanka.' }
        ]
    }
]
