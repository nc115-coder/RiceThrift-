import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { User, Item } from '../types';
import ItemCard from './ItemCard';
import NewItemForm from './NewItemForm';
import { getRecommendedItems } from '../services/geminiService';
import { SearchIcon } from './Icons';
import { RICE_COLLEGES } from '../constants';

interface MarketplaceProps {
  currentUser: User;
  users: User[];
  items: Item[];
  onAddItem: (newItem: Omit<Item, 'id' | 'sellerId' | 'college' | 'location' | 'createdAt' | 'status'>) => void;
  onSelectItem: (item: Item) => void;
  wishlist: number[];
  onToggleWishlist: (itemId: number) => void;
}

// Haversine formula to calculate distance
const getDistance = (loc1: {lat: number, lng: number}, loc2: {lat: number, lng: number}) => {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Marketplace: React.FC<MarketplaceProps> = ({ currentUser, items, onAddItem, onSelectItem, wishlist, onToggleWishlist }) => {
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState({
    college: 'All',
    maxDistance: 5,
    minPrice: '',
    maxPrice: '',
  });

  const [sortBy, setSortBy] = useState('newest');

  const [recommendedItemIds, setRecommendedItemIds] = useState<number[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);

  const fetchRecommendations = useCallback(async () => {
    setIsLoadingRecs(true);
    try {
      const ids = await getRecommendedItems(currentUser.interests, items);
      setRecommendedItemIds(ids);
    } catch (error) {
      console.error("Failed to fetch recommendations", error);
    } finally {
      setIsLoadingRecs(false);
    }
  }, [currentUser.interests, items]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => item.status === 'available');

    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(lowercasedQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
      );
    }

    if (filters.college !== 'All') {
      filtered = filtered.filter(item => item.college === filters.college);
    }
    
    filtered = filtered.filter(item => getDistance(currentUser.location, item.location) <= filters.maxDistance);

    if (filters.minPrice) {
      filtered = filtered.filter(item => item.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(item => item.price <= parseFloat(filters.maxPrice));
    }

    switch (sortBy) {
      case 'price_asc':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return filtered.sort((a, b) => b.price - a.price);
      case 'distance':
        return filtered.sort((a, b) => getDistance(currentUser.location, a.location) - getDistance(currentUser.location, b.location));
      case 'newest':
      default:
        return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }, [items, filters, sortBy, currentUser.location, searchQuery]);

  const recommendedItems = useMemo(() => {
    return recommendedItemIds
      .map(id => items.find(item => item.id === id && item.status === 'available'))
      .filter((item): item is Item => !!item);
  }, [recommendedItemIds, items]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Marketplace</h2>
        <button 
          onClick={() => setIsNewItemModalOpen(true)}
          className="bg-riceBlue text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
        >
          + Sell Item
        </button>
      </div>

      {/* Recommendations Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recommended For You</h3>
        {isLoadingRecs ? (
          <div className="text-center p-4">Loading recommendations...</div>
        ) : recommendedItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedItems.map(item => (
              <ItemCard 
                key={item.id} 
                item={item} 
                currentUserLocation={currentUser.location} 
                onCardClick={onSelectItem}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-100 rounded-lg">No recommendations found. Try updating your profile interests!</div>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 sticky top-[60px] z-5">
        <div className="relative mb-4">
            <label htmlFor="search-items" className="sr-only">Search for items by name or tag</label>
            <input
                id="search-items"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items by name or tag..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-riceBlue"
                aria-label="Search items"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                <SearchIcon className="w-5 h-5 text-gray-400" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">College</label>
            <select name="college" value={filters.college} onChange={handleFilterChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-riceBlue focus:border-riceBlue sm:text-sm rounded-md">
              <option>All</option>
              {RICE_COLLEGES.map(college => <option key={college} value={college}>{college}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="maxDistance" className="block text-sm font-medium text-gray-700">Distance ({filters.maxDistance} mi)</label>
            <input type="range" id="maxDistance" name="maxDistance" min="1" max="20" value={filters.maxDistance} onChange={handleFilterChange} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2 accent-riceBlue" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Price Range</label>
            <div className="flex space-x-2 mt-1">
              <input type="number" name="minPrice" value={filters.minPrice} onChange={handleFilterChange} placeholder="Min" className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-riceBlue focus:border-riceBlue" aria-label="Minimum price"/>
              <input type="number" name="maxPrice" value={filters.maxPrice} onChange={handleFilterChange} placeholder="Max" className="w-full border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-riceBlue focus:border-riceBlue" aria-label="Maximum price"/>
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Sort By</label>
            <select name="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-riceBlue focus:border-riceBlue sm:text-sm rounded-md">
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="distance">Distance</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredAndSortedItems.map(item => (
          <ItemCard 
            key={item.id} 
            item={item} 
            currentUserLocation={currentUser.location} 
            onCardClick={onSelectItem} 
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
      
      {isNewItemModalOpen && (
        <NewItemForm 
          onClose={() => setIsNewItemModalOpen(false)}
          onAddItem={onAddItem}
        />
      )}
    </div>
  );
};

export default Marketplace;