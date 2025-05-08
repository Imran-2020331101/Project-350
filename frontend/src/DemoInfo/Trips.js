export const Trips = [
    {
      "id": "trip_001",
      "owner": "user_01",
      "destination": "Kyoto, Japan",
      "tripTypes": ["Cultural", "Historic", "Scenic"],
      "transportOptions": {
        "flights": [
          {
            "airline": "ANA",
            "flightNumber": "NH812",
            "departure": "2025-06-14T22:00:00",
            "arrival": "2025-06-15T07:30:00",
            "from": "Bangkok (BKK)",
            "to": "Tokyo Haneda (HND)"
          }
        ],
        "trains": [
          {
            "trainName": "Shinkansen Hikari",
            "departure": "2025-06-15T10:00:00",
            "arrival": "2025-06-15T12:30:00",
            "from": "Tokyo",
            "to": "Kyoto"
          }
        ]
      },
      "estimatedBudget": 1200,
      "numberOfTravelers": 2,
      "tags": {
        "days": 6,
        "budget": "mid-range",
        "numberOfTravelers": 2
      },
      "weatherForecast": "Sunny with occasional clouds, avg 26°C",
      "description": "A traditional journey to explore temples, gardens, and the cultural heart of Japan.",
      "placesToVisit": {
        "Day 1": [
          { "time": "10:00", "place": "Fushimi Inari Shrine" },
          { "time": "14:00", "place": "Gion District walk" }
        ],
        "Day 2": [
          { "time": "09:00", "place": "Arashiyama Bamboo Grove" },
          { "time": "12:00", "place": "Tenryu-ji Temple" },
          { "time": "16:00", "place": "Togetsukyo Bridge" }
        ],
        "Day 3": [
          { "time": "10:00", "place": "Kiyomizu-dera" },
          { "time": "14:00", "place": "Philosopher’s Path" }
        ],
        "Day 4": [
          { "time": "11:00", "place": "Nijo Castle" },
          { "time": "15:00", "place": "Kyoto Imperial Palace" }
        ]
      },
      "hotelsToStay": [
        {
          "name": "Kyoto Granbell Hotel",
          "location": "Gion",
          "pricePerNight": 120
        },
        {
          "name": "Hotel The Celestine Kyoto Gion",
          "location": "Higashiyama",
          "pricePerNight": 150
        }
      ]
    },
    {
      "id": "trip_002",
      "owner": "user_02",
      "destination": "Cape Town, South Africa",
      "tripTypes": ["Adventure", "Nature", "Wildlife"],
      "transportOptions": {
        "flights": [
          {
            "airline": "British Airways",
            "flightNumber": "BA005",
            "departure": "2025-07-09T23:00:00",
            "arrival": "2025-07-10T09:00:00",
            "from": "London Heathrow (LHR)",
            "to": "Cape Town (CPT)"
          }
        ],
        "trains": []
      },
      "estimatedBudget": 1600,
      "numberOfTravelers": 4,
      "tags": {
        "days": 8,
        "budget": "upper-mid",
        "numberOfTravelers": 4
      },
      "weatherForecast": "Cool and breezy, avg 18°C with possible showers",
      "description": "An adventurous trip to explore mountains, beaches, and wildlife safaris.",
      "placesToVisit": {
        "Day 1": [
          { "time": "13:00", "place": "V&A Waterfront" }
        ],
        "Day 2": [
          { "time": "09:00", "place": "Table Mountain Cableway" },
          { "time": "14:00", "place": "Bo-Kaap" }
        ],
        "Day 3": [
          { "time": "08:00", "place": "Cape Point" },
          { "time": "13:00", "place": "Chapman’s Peak Drive" }
        ],
        "Day 4": [
          { "time": "10:00", "place": "Robben Island" },
          { "time": "16:00", "place": "Sunset Cruise" }
        ],
        "Day 5": [
          { "time": "11:00", "place": "Boulders Beach Penguin Colony" }
        ]
      },
      "hotelsToStay": [
        {
          "name": "Taj Cape Town",
          "location": "City Bowl",
          "pricePerNight": 170
        },
        {
          "name": "The Twelve Apostles Hotel",
          "location": "Camps Bay",
          "pricePerNight": 230
        }
      ]
    },
    {
      "id": "trip_003",
      "owner": "user_03",
      "destination": "Istanbul, Turkey",
      "tripTypes": ["Historic", "Cultural", "City Tour"],
      "transportOptions": {
        "flights": [
          {
            "airline": "Turkish Airlines",
            "flightNumber": "TK197",
            "departure": "2025-09-04T23:50:00",
            "arrival": "2025-09-05T07:00:00",
            "from": "New York (JFK)",
            "to": "Istanbul (IST)"
          }
        ],
        "trains": []
      },
      "estimatedBudget": 1000,
      "numberOfTravelers": 3,
      "tags": {
        "days": 7,
        "budget": "budget",
        "numberOfTravelers": 3
      },
      "weatherForecast": "Warm and dry, avg 28°C",
      "description": "A historical escape exploring Byzantine and Ottoman landmarks.",
      "placesToVisit": {
        "Day 1": [
          { "time": "12:00", "place": "Sultanahmet Square" }
        ],
        "Day 2": [
          { "time": "09:00", "place": "Hagia Sophia" },
          { "time": "12:00", "place": "Blue Mosque" }
        ],
        "Day 3": [
          { "time": "10:00", "place": "Topkapi Palace" },
          { "time": "15:00", "place": "Basilica Cistern" }
        ],
        "Day 4": [
          { "time": "11:00", "place": "Grand Bazaar" },
          { "time": "14:00", "place": "Spice Bazaar" }
        ]
      },
      "hotelsToStay": [
        {
          "name": "Sirkeci Mansion",
          "location": "Fatih",
          "pricePerNight": 110
        },
        {
          "name": "Hotel Amira Istanbul",
          "location": "Sultanahmet",
          "pricePerNight": 130
        }
      ]
    },
    {
      "id": "trip_004",
      "owner": "user_04",
      "destination": "Reykjavik, Iceland",
      "tripTypes": ["Nature", "Adventure", "Winter"],
      "transportOptions": {
        "flights": [
          {
            "airline": "Icelandair",
            "flightNumber": "FI333",
            "departure": "2025-11-19T20:00:00",
            "arrival": "2025-11-20T06:30:00",
            "from": "New York (JFK)",
            "to": "Reykjavik (KEF)"
          }
        ],
        "trains": []
      },
      "estimatedBudget": 2000,
      "numberOfTravelers": 2,
      "tags": {
        "days": 7,
        "budget": "high",
        "numberOfTravelers": 2
      },
      "weatherForecast": "Cold with snow flurries, avg -2°C",
      "description": "A nature-focused trip to chase the Northern Lights and explore glaciers.",
      "placesToVisit": {
        "Day 1": [
          { "time": "12:00", "place": "Blue Lagoon" }
        ],
        "Day 2": [
          { "time": "10:00", "place": "Golden Circle Tour" }
        ],
        "Day 3": [
          { "time": "20:00", "place": "Northern Lights Tour" }
        ],
        "Day 4": [
          { "time": "11:00", "place": "Reykjavik city walk" }
        ]
      },
      "hotelsToStay": [
        {
          "name": "CenterHotel Midgardur",
          "location": "City Center",
          "pricePerNight": 180
        },
        {
          "name": "ION Adventure Hotel",
          "location": "Nesjavellir",
          "pricePerNight": 250
        }
      ]
    },
    {
      "id": "trip_005",
      "owner": "user_05",
      "destination": "Barcelona, Spain",
      "tripTypes": ["City", "Beach", "Cultural"],
      "transportOptions": {
        "flights": [
          {
            "airline": "Vueling",
            "flightNumber": "VY8812",
            "departure": "2025-08-02T18:00:00",
            "arrival": "2025-08-03T08:30:00",
            "from": "London Heathrow (LHR)",
            "to": "Barcelona (BCN)"
          }
        ],
        "trains": []
      },
      "estimatedBudget": 1100,
      "numberOfTravelers": 5,
      "tags": {
        "days": 6,
        "budget": "mid-range",
        "numberOfTravelers": 5
      },
      "weatherForecast": "Hot and sunny, avg 31°C",
      "description": "An exciting Mediterranean getaway combining city exploration and beach relaxation.",
      "placesToVisit": {
        "Day 1": [
          { "time": "16:00", "place": "Barceloneta Beach" }
        ],
        "Day 2": [
          { "time": "09:00", "place": "Sagrada Familia" },
          { "time": "13:00", "place": "La Rambla walk" }
        ],
        "Day 3": [
          { "time": "10:00", "place": "Park Güell" },
          { "time": "15:00", "place": "Gothic Quarter" }
        ]
      },
      "hotelsToStay": [
        {
          "name": "Hotel 1898",
          "location": "La Rambla",
          "pricePerNight": 160
        },
        {
          "name": "W Barcelona",
          "location": "Beachfront",
          "pricePerNight": 300
        }
      ]
    }
  ]
  