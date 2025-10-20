import { useState } from "react";
import { MapPin, Star, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";

export default function Explore() {
  const [expanded, setExpanded] = useState<{ id: number | null; day: number | null }>({
    id: null,
    day: null,
  });
  const [variantIndex, setVariantIndex] = useState<{ [key: number]: number }>({});

  const fixImg = (url: string) =>
    `${url}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80`;
  const Fallback =
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=70";

  const handleShuffle = (id: number, total: number) =>
    setVariantIndex((prev) => ({ ...prev, [id]: ((prev[id] ?? 0) + 1) % total }));

  const destinations = [
    {
      id: 1,
      name: "Santorini, Greece",
      category: "Beach Paradise",
      rating: 4.9,
      cost: ["$1,400", "$1,600"],
      image: fixImg("https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff"),
      variants: [
        [
          {
            day: 1,
            title: "Arrival & Sunset Views",
            desc: "Check into your villa, wander Oia, and enjoy the sunset from Amoudi Bay.",
            image: fixImg("https://images.unsplash.com/photo-1502602898657-3e91760cbb34"),
            packingList: ["Camera", "Light jacket", "Walking shoes"],
          },
          {
            day: 2,
            title: "Beach Hopping & Wine",
            desc: "Relax at Red Beach and Perissa, then enjoy wine tasting in Pyrgos.",
            image: fixImg("https://images.unsplash.com/photo-1507525428034-b723cf961d3e"),
            packingList: ["Swimsuit", "Sunscreen", "Hat"],
          },
          {
            day: 3,
            title: "Caldera Cruise",
            desc: "Sail the caldera, swim in volcanic springs, and enjoy dinner on deck.",
            image: fixImg("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"),
            packingList: ["Sneakers", "Windbreaker", "Sunglasses"],
          },
        ],
        [
          {
            day: 1,
            title: "Fira–Oia Hike",
            desc: "Take the scenic Fira–Oia hike for sweeping island views.",
            image: fixImg("https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba"),
            packingList: ["Hiking shoes", "Water bottle", "Hat"],
          },
          {
            day: 2,
            title: "Volcano & Springs",
            desc: "Boat to Nea Kameni volcano and bathe in hot springs.",
            image: fixImg("https://images.unsplash.com/photo-1519821172141-b5d8d7f4fbb3"),
            packingList: ["Swimwear", "Towel", "Flip-flops"],
          },
          {
            day: 3,
            title: "Village Tour",
            desc: "Visit Akrotiri ruins and local tavernas in Imerovigli.",
            image: fixImg("https://images.unsplash.com/photo-1520786839651-6c8e98a4a84a"),
            packingList: ["Notebook", "Local cash", "Comfortable shoes"],
          },
        ],
      ],
    },
    {
      id: 2,
      name: "Kyoto, Japan",
      category: "Cultural Heritage",
      rating: 4.8,
      cost: ["$1,500", "$1,650"],
      image: fixImg("https://images.unsplash.com/photo-1492571350019-22de08371fd3"),
      variants: [
        [
          {
            day: 1,
            title: "Fushimi Inari & Gion",
            desc: "Walk through thousands of torii gates and visit Gion’s old streets.",
            image: fixImg("https://images.unsplash.com/photo-1551767747-3f0e2e52c301"),
            packingList: ["Respectful clothing", "Yen", "Camera"],
          },
          {
            day: 2,
            title: "Bamboo Grove & Markets",
            desc: "Explore Arashiyama Bamboo Forest and Nishiki Market.",
            image: fixImg("https://images.unsplash.com/photo-1504198458649-3128b932f49b"),
            packingList: ["Water bottle", "Shopping bag", "Notebook"],
          },
          {
            day: 3,
            title: "Philosopher’s Path",
            desc: "Walk Kyoto’s zen gardens and ancient temples.",
            image: fixImg("https://images.unsplash.com/photo-1566302592773-baa3f4b5e3ab"),
            packingList: ["Walking shoes", "Umbrella", "Sunscreen"],
          },
        ],
        [
          {
            day: 1,
            title: "Manga Museum & Street Food",
            desc: "Visit Kyoto’s manga museum and try local street food.",
            image: fixImg("https://images.unsplash.com/photo-1596484556873-5f7d6f5efb54"),
            packingList: ["Cash", "Powerbank", "Reusable chopsticks"],
          },
          {
            day: 2,
            title: "Nara Deer Park",
            desc: "Feed friendly deer and explore Todai-ji Temple.",
            image: fixImg("https://images.unsplash.com/photo-1551762749-3e8b8e67b83a"),
            packingList: ["Snacks", "Map", "Shoes"],
          },
          {
            day: 3,
            title: "Modern Kyoto & Tower",
            desc: "Shop and dine at Kyoto Tower and Kyoto Station.",
            image: fixImg("https://images.unsplash.com/photo-1531968451736-4c2d3b1a1a77"),
            packingList: ["Transit card", "Light jacket"],
          },
        ],
      ],
    },
    {
      id: 3,
      name: "Bali, Indonesia",
      category: "Tropical Escape",
      rating: 4.7,
      cost: ["$1,400", "$1,550"],
      image: fixImg("https://images.unsplash.com/photo-1537996194471-e657df975ab4"),
      variants: [
        [
          {
            day: 1,
            title: "Seminyak Beach Club",
            desc: "Chill by the beach, sunset cocktails, and music.",
            image: fixImg("https://images.unsplash.com/photo-1506744038136-46273834b3fb"),
            packingList: ["Beachwear", "Sunglasses", "Hat"],
          },
          {
            day: 2,
            title: "Ubud Rice Terraces",
            desc: "Visit Tegalalang and local craft shops.",
            image: fixImg("https://images.unsplash.com/photo-1548013146-72479768bada"),
            packingList: ["Camera", "Shoes", "Bug spray"],
          },
          {
            day: 3,
            title: "Temple & Spa",
            desc: "Visit Tanah Lot and enjoy a Balinese spa.",
            image: fixImg("https://images.unsplash.com/photo-1528773836916-d7e1abbd0a5e"),
            packingList: ["Sarong", "Spa outfit", "Flip-flops"],
          },
        ],
        [
          {
            day: 1,
            title: "Waterfalls & Jungle Trek",
            desc: "Trek Ubud’s jungle and chase hidden waterfalls.",
            image: fixImg("https://images.unsplash.com/photo-1508057198894-247b23fe5ade"),
            packingList: ["Hiking shoes", "Raincoat", "Water bottle"],
          },
          {
            day: 2,
            title: "Mount Batur Sunrise",
            desc: "Early climb for sunrise above the clouds.",
            image: fixImg("https://images.unsplash.com/photo-1531983412531-1f49a365ffed"),
            packingList: ["Jacket", "Flashlight", "Snacks"],
          },
          {
            day: 3,
            title: "Snorkel & Chill",
            desc: "Snorkel at Blue Lagoon and relax before departure.",
            image: fixImg("https://images.unsplash.com/photo-1517836357463-d25dfeac3438"),
            packingList: ["Swimsuit", "Towel", "Waterproof bag"],
          },
        ],
      ],
    },
    {
      id: 4,
      name: "Paris, France",
      category: "Romantic Getaway",
      rating: 4.8,
      cost: ["$1,700", "$1,850"],
      image: fixImg("https://images.unsplash.com/photo-1499856871958-5b9627545d1a"),
      variants: [
        [
          {
            day: 1,
            title: "Seine Cruise & Dinner",
            desc: "Evening cruise and dinner by the Eiffel Tower.",
            image: fixImg("https://images.unsplash.com/photo-1522098543979-ffc7f79d6f1d"),
            packingList: ["Evening outfit", "Camera", "Coat"],
          },
          {
            day: 2,
            title: "Louvre & Cafés",
            desc: "Spend the day between the Louvre and local cafés.",
            image: fixImg("https://images.unsplash.com/photo-1491553895911-0055eca6402d"),
            packingList: ["Tickets", "Guidebook", "Powerbank"],
          },
          {
            day: 3,
            title: "Montmartre Walk",
            desc: "Explore Montmartre’s art district and Sacré-Cœur.",
            image: fixImg("https://images.unsplash.com/photo-1524413840807-0c3cb6fa8081"),
            packingList: ["Scarf", "Map", "Shoes"],
          },
        ],
        [
          {
            day: 1,
            title: "Saint-Germain Bookstores",
            desc: "Wander through bookshops and cafés in Saint-Germain.",
            image: fixImg("https://images.unsplash.com/photo-1502602898657-3e91760cbb34"),
            packingList: ["Notebook", "Umbrella", "Reusable bag"],
          },
          {
            day: 2,
            title: "Le Marais Markets",
            desc: "Explore vintage shops and food markets.",
            image: fixImg("https://images.unsplash.com/photo-1508057198894-247b23fe5ade"),
            packingList: ["Camera", "Cash", "Water bottle"],
          },
          {
            day: 3,
            title: "Versailles Day Trip",
            desc: "Tour the Palace of Versailles and gardens.",
            image: fixImg("https://images.unsplash.com/photo-1504805572947-34fad45aed93"),
            packingList: ["Tickets", "Snacks", "Sunscreen"],
          },
        ],
      ],
    },
    {
      id: 5,
      name: "Machu Picchu, Peru",
      category: "Adventure & History",
      rating: 4.9,
      cost: ["$1,800", "$1,950"],
      image: fixImg("https://images.unsplash.com/photo-1526392060635-9d6019884377"),
      variants: [
        [
          {
            day: 1,
            title: "Arrival in Cusco",
            desc: "Acclimate and explore Plaza de Armas and markets.",
            image: fixImg("https://images.unsplash.com/photo-1526318472351-bc6d0b6c52ce"),
            packingList: ["Altitude pills", "Warm layers", "Hat"],
          },
          {
            day: 2,
            title: "Sacred Valley",
            desc: "Tour Pisac, Ollantaytambo, and local artisans.",
            image: fixImg("https://images.unsplash.com/photo-1532444371952-5e8a96c52f43"),
            packingList: ["Snacks", "Passport", "Camera"],
          },
          {
            day: 3,
            title: "Machu Picchu Sunrise",
            desc: "Morning visit and guided tour of the citadel.",
            image: fixImg("https://images.unsplash.com/photo-1529974019031-b49d8f1c3c54"),
            packingList: ["Hiking boots", "Poncho", "Water bottle"],
          },
        ],
        [
          {
            day: 1,
            title: "Cusco Culture",
            desc: "Explore museums and dine at local restaurants.",
            image: fixImg("https://images.unsplash.com/photo-1591068258794-1c7c30d06f2a"),
            packingList: ["Shoes", "Cash", "Reusable bag"],
          },
          {
            day: 2,
            title: "Vistadome Train",
            desc: "Scenic train ride through the Andes.",
            image: fixImg("https://images.unsplash.com/photo-1591068258794-1c7c30d06f2a"),
            packingList: ["Travel pillow", "Snacks", "Headphones"],
          },
          {
            day: 3,
            title: "Citadel & Return",
            desc: "Explore Machu Picchu and return to Cusco.",
            image: fixImg("https://images.unsplash.com/photo-1532444371952-5e8a96c52f43"),
            packingList: ["Sunscreen", "Camera", "Jacket"],
          },
        ],
      ],
    },
    {
      id: 6,
      name: "Banff, Canada",
      category: "Mountain Adventure",
      rating: 4.9,
      cost: ["$1,600", "$1,800"],
      image: fixImg("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"),
      variants: [
        [
          {
            day: 1,
            title: "Lake Louise Arrival",
            desc: "Arrive, relax, and canoe at Lake Louise.",
            image: fixImg("https://images.unsplash.com/photo-1501785888041-af3ef285b470"),
            packingList: ["Jacket", "Gloves", "Camera"],
          },
          {
            day: 2,
            title: "Sulphur Mountain",
            desc: "Hike or take the gondola for peak views.",
            image: fixImg("https://images.unsplash.com/photo-1532960400641-9fbbd1b1e5b2"),
            packingList: ["Boots", "Water bottle", "Backpack"],
          },
          {
            day: 3,
            title: "Hot Springs & Wildlife",
            desc: "Soak in hot springs and spot elk nearby.",
            image: fixImg("https://images.unsplash.com/photo-1523819376888-507ec2618e8f"),
            packingList: ["Swimwear", "Towel", "Binoculars"],
          },
        ],
        [
          {
            day: 1,
            title: "Cozy Lodge Arrival",
            desc: "Check into a lodge and enjoy fireside dinner.",
            image: fixImg("https://images.unsplash.com/photo-1542044801-287b42b88f39"),
            packingList: ["Warm layers", "Boots", "Gloves"],
          },
          {
            day: 2,
            title: "Ski Day",
            desc: "Ski at Sunshine Village or snowshoe nearby.",
            image: fixImg("https://images.unsplash.com/photo-1549887534-3db1bd59dcca"),
            packingList: ["Ski gear", "Helmet", "Sunscreen"],
          },
          {
            day: 3,
            title: "Spa & Brunch",
            desc: "Morning spa and relaxed brunch before departure.",
            image: fixImg("https://images.unsplash.com/photo-1542044801-287b42b88f39"),
            packingList: ["Spa wear", "Earphones", "Travel mug"],
          },
        ],
      ],
    },
  ];

  return (
    <div className="bg-gradient-to-b from-[#0f172a] to-[#1e1b4b] text-white min-h-screen py-16 px-6">
      <h1 className="text-5xl font-bold text-center mb-12 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
        Explore 3-Day Adventures 🌍
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
        {destinations.map((dest) => {
          const vIndex = variantIndex[dest.id] ?? 0;
          const variant = dest.variants[vIndex];
          const cost = dest.cost[vIndex % dest.cost.length];

          return (
            <div
              key={dest.id}
              className="group bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:shadow-purple-500/30 transition-all duration-500"
            >
              <div className="relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-56 object-cover transition duration-700 group-hover:scale-105"
                  onError={(e) => (e.currentTarget.src = Fallback)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-2xl font-bold">{dest.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="w-4 h-4" /> {dest.category}
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 ml-2" /> {dest.rating}
                  </div>
                </div>
              </div>

              <div className="p-5 fade-in">
                {variant.map((day) => (
                  <div
                    key={day.day}
                    className="mb-3 border border-white/10 rounded-xl overflow-hidden bg-white/5"
                  >
                    <button
                      onClick={() =>
                        setExpanded(
                          expanded.id === dest.id && expanded.day === day.day
                            ? { id: null, day: null }
                            : { id: dest.id, day: day.day }
                        )
                      }
                      className="flex justify-between items-center w-full p-3 text-left hover:bg-white/10"
                    >
                      <h4 className="font-medium">
                        Day {day.day}: {day.title}
                      </h4>
                      {expanded.id === dest.id && expanded.day === day.day ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>

                    {expanded.id === dest.id && expanded.day === day.day && (
                      <div className="p-3 bg-black/30 fade-in">
                        <img
                          src={day.image}
                          alt={day.title}
                          className="rounded-lg w-full h-40 object-cover mb-3"
                          onError={(e) => (e.currentTarget.src = Fallback)}
                        />
                        <p className="text-sm text-gray-200 mb-3">{day.desc}</p>
                        <p className="font-semibold text-gray-300 mb-1 text-sm">Packing List:</p>
                        <ul className="list-disc list-inside text-xs text-gray-400">
                          {day.packingList.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-between items-center mt-4">
                  <p className="text-sm text-gray-300">Est. Cost: {cost}</p>
                  <button
                    onClick={() => handleShuffle(dest.id, dest.variants.length)}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:scale-105 transition"
                  >
                    <RefreshCw className="w-4 h-4" /> Shuffle
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.4s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
