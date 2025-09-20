import React, { useState } from 'react';
import type { User, Item, Location } from '../types';
import { RiceCollege } from '../types';
import { RICE_COLLEGES } from '../constants';
import ItemCard from './ItemCard';

interface ProfileProps {
  user: User;
  onUpdateProfile: (updatedUser: User) => void;
  items: Item[];
  wishlist: number[];
  onToggleWishlist: (itemId: number) => void;
  onSelectItem: (item: Item) => void;
  currentUserLocation: Location;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateProfile, items, wishlist, onToggleWishlist, onSelectItem, currentUserLocation }) => {
  const [name, setName] = useState(user.name);
  const [college, setCollege] = useState(user.college);
  const [interests, setInterests] = useState(user.interests);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ ...user, name, college, interests });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const wishlistedItems = items.filter(item => wishlist.includes(item.id));

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h2>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-riceBlue focus:border-riceBlue"
            />
          </div>
          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700">Rice College</label>
            <select
              id="college"
              value={college}
              onChange={(e) => setCollege(e.target.value as RiceCollege)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-riceBlue focus:border-riceBlue"
            >
              {RICE_COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700">My Interests & Style</label>
            <textarea
              id="interests"
              rows={4}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-riceBlue focus:border-riceBlue"
              placeholder="e.g. Vintage clothes, streetwear, designer brands..."
            />
             <p className="mt-2 text-sm text-gray-500">
              This helps us recommend items you'll love!
            </p>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-riceBlue text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-blue-800 transition-colors"
            >
              Save Changes
            </button>
            {isSaved && <span className="text-green-600 font-semibold">Profile Saved!</span>}
          </div>
        </form>
      </div>
      
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">My Wishlist</h3>
        {wishlistedItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistedItems.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                currentUserLocation={currentUserLocation}
                onCardClick={onSelectItem}
                wishlist={wishlist}
                onToggleWishlist={onToggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Your wishlist is empty. Tap the heart on an item to save it!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;