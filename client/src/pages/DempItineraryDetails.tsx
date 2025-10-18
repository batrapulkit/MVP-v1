import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  MapPin,
  CreditCard,
  ClipboardList,
  Sparkles,
  Heart,
  Share2,
} from 'lucide-react';
import { itineraries } from '../../../shared/data/prebuiltItineraries';

const DempItineraryDetails = () => {
  const { id } = useParams();
  const itineraryId = id ? parseInt(id, 10) : NaN;
  const [_, navigate] = useLocation();
  const [isFavorited, setIsFavorited] = useState(false);
  const [showEnriching, setShowEnriching] = useState(false);

  const itinerary = itineraries.find(i => i.id === itineraryId);
  const [variantIndex, setVariantIndex] = useState(0);
  const [groupItineraries, setGroupItineraries] = useState<typeof itineraries>([]);
  const [current, setCurrent] = useState(itinerary);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!itinerary) return;

    const baseName = itinerary.name.split(' (Plan')[0].trim();
    const group = itineraries.filter(i => i.name.startsWith(baseName));
    const index = group.findIndex(i => i.id === itinerary.id);

    setGroupItineraries(group);
    setVariantIndex(index);
    setCurrent(itinerary);
  }, [itineraryId]);

  const handleBack = () => navigate('/explore');
  const handleFavorite = () => setIsFavorited(prev => !prev);

  const handleEnrich = () => {
    setShowEnriching(true);

    setTimeout(() => {
      const nextIndex = (variantIndex + 1) % groupItineraries.length;
      setVariantIndex(nextIndex);
      setCurrent(groupItineraries[nextIndex]);
      setShowEnriching(false);
    }, 1200);
  };

  const handleShare = () => {
    const shareData = {
      title: `Triponic | ${current?.name}`,
      text: `Check out this amazing itinerary on Triponic: ${current?.name}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(err => console.warn('Sharing failed:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('🔗 Link copied to clipboard!');
    }
  };

  if (!current || isNaN(itineraryId)) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Itinerary Not Found</h1>
        <p className="mb-6 text-gray-600">Please go back and try a different trip.</p>
        <Button onClick={handleBack} className="bg-indigo-600 text-white">
          Back to Explore
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-100">
      {/* Hero */}
      <div className="relative h-[45vh] md:h-[60vh] w-full overflow-hidden rounded-b-[3rem] shadow-xl">
        <img src={current.image} alt={current.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-10 left-8 text-white max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
            {current.name}
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="mt-4 text-white border-white hover:bg-white/10"
            onClick={handleBack}
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Explore
          </Button>
        </div>
      </div>

      {/* Overview */}
      <div className="max-w-4xl mx-auto -mt-20 relative z-10 rounded-3xl bg-white/90 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
          <h2 className="text-2xl font-bold text-indigo-900">🌍 Trip Overview</h2>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-1" /> Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleFavorite}>
              <Heart className={`w-4 h-4 mr-1 ${isFavorited ? 'text-red-500 fill-red-500' : ''}`} />
              Favorite
            </Button>
            <Button variant="outline" size="sm" onClick={handleEnrich}>
              <Sparkles className="w-4 h-4 mr-1" /> Enrich
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <CreditCard className="w-5 h-5 text-indigo-500" />
            <p><strong>Estimated Cost:</strong> {current.cost}</p>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="w-5 h-5 text-indigo-500" />
            <p><strong>Visa Info:</strong> {current.visa}</p>
          </div>
          <div className="flex items-start gap-2">
            <ClipboardList className="w-5 h-5 text-indigo-500" />
            <p><strong>Notes:</strong> {current.notes}</p>
          </div>
        </div>
      </div>

      {/* Enriching Overlay */}
      {showEnriching && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl px-8 py-6 text-center max-w-sm animate-pulse">
            <Sparkles className="mx-auto mb-3 text-indigo-600 w-8 h-8 animate-spin" />
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">Enhancing Itinerary...</h3>
            <p className="text-sm text-gray-600">
              Triponic is cycling to a unique travel variant ✨
            </p>
          </div>
        </div>
      )}

      {/* Days */}
      <div className="max-w-4xl mx-auto mt-16 px-4 md:px-0 pb-20">
        <h2 className="text-2xl font-bold text-purple-800 mb-6 mt-4">📅 Day-wise Plan</h2>
        <div className="space-y-8">
          {current.days.map((day, index) => (
            <div
              key={index}
              className="bg-white/90 backdrop-blur-md border border-indigo-100 rounded-xl p-5 shadow-md hover:shadow-lg transition"
            >
              <p className="text-lg font-semibold text-indigo-800">
                Day {index + 1}: {day.title}
              </p>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{day.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DempItineraryDetails;