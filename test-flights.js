// Test script for get-flights function
//this works
const Amadeus = require("amadeus");

const amadeus = new Amadeus({
    clientId: "34I5uNgLLLsHkuNTF27R1knTcTQGZ1Td",
    clientSecret: "Ky4NJP1yQswXeFKE",
});

async function testGetFlights() {
    try {
        console.log("Testing flight search...");
        
        const testParams = {
            originLocationCode: "NYC", // New York
            destinationLocationCode: "LAX", // Los Angeles
            departureDate: "2025-07-15", // Future date
            adults: 1,
            max: 5, // Limit results for testing
            currencyCode: "USD"
        };

        console.log("Search parameters:", testParams);
        
        const response = await amadeus.shopping.flightOffersSearch.get(testParams);
        
        console.log("✅ Success! Found flights:");
        console.log("Number of offers:", response.data.length);
        
        // Display first flight offer details
        if (response.data.length > 0) {
            const firstFlight = response.data[0];
            console.log("\n📋 First flight details:");
            console.log("Price:", firstFlight.price.total, firstFlight.price.currency);
            console.log("Segments:", firstFlight.itineraries[0].segments.length);
            
            firstFlight.itineraries[0].segments.forEach((segment, index) => {
                console.log(`  Segment ${index + 1}:`, 
                    segment.departure.iataCode, "→", segment.arrival.iataCode,
                    `(${segment.carrierCode}${segment.number})`
                );
            });
        }
        
        return response.data;
        
    } catch (error) {
        console.error("❌ Error testing flights:", error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            console.log("💡 Check your AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET in .env file");
        }
    }
}

// Run the test
testGetFlights();
