const fs = require('fs');
const path = require('path');

async function testSave() {
    try {
        const filePath = path.join(process.cwd(), 'src', 'data', 'content.json');
        console.log("File path:", filePath);

        const fileBuffer = fs.readFileSync(filePath, 'utf-8');
        const fileData = JSON.parse(fileBuffer);

        console.log("Current tours count:", fileData.tours ? fileData.tours.length : 0);

        // Mock a new tour
        const newTour = {
            id: 'test-tour-' + Date.now(),
            title: 'Test Tour Node Script',
            duration: '1 Day',
            price: '$10',
            image: '/images/test.webp',
            category: 'Testing',
            rating: 5,
            reviews: 0,
            description: 'Test save description',
            slug: 'test-tour',
            highlights: [],
            itinerary: []
        };

        // Simulate what the frontend sends (the whole tours array)
        const updatedTours = [...(fileData.tours || []), newTour];

        // Simulate API write logic
        fileData.tours = updatedTours;
        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 4));

        console.log("Successfully wrote to content.json!");
        console.log("New tours count:", fileData.tours.length);

        // Cleanup test tour
        fileData.tours = fileData.tours.filter(t => t.id !== newTour.id);
        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 4));
        console.log("Cleaned up test tour.");

    } catch (err) {
        console.error("Test failed:", err);
    }
}

testSave();
