import React from 'react';
import type { Item, Location } from '../types';
import { HeartIcon } from './Icons';

interface ItemCardProps {
  item: Item;
  currentUserLocation: Location;
  onCardClick: (item: Item) => void;
  wishlist: number[];
  onToggleWishlist: (itemId: number) => void;
}

const getDistance = (loc1: Location, loc2: Location) => {
  const R = 3959; // Radius of the Earth in miles
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLon = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) * Math.cos(loc2.lat * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};


const ItemCard: React.FC<ItemCardProps> = ({ item, currentUserLocation, onCardClick, wishlist, onToggleWishlist }) => {
    
  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent the modal from opening
    onToggleWishlist(item.id);
  };
    
  const isWishlisted = wishlist.includes(item.id);

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:-translate-y-1 transition-transform duration-200 flex flex-col relative"
      onClick={() => onCardClick(item)}
    >
      <button 
        onClick={handleWishlistClick}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-colors ${
          isWishlisted ? 'bg-red-500 text-white' : 'bg-white/70 text-gray-700 hover:bg-white'
        }`}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <HeartIcon className="w-5 h-5" filled={isWishlisted} />
      </button>

      <img src={item.imageUrl} alt={item.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
        <p className="text-2xl font-bold text-riceBlue mt-1">${item.price}</p>
        <div className="mt-auto pt-2 flex justify-between items-center text-sm text-gray-500">
          <span>{item.college}</span>
          <span>{getDistance(currentUserLocation, item.location)} mi</span>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;