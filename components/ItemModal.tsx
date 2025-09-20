import React from 'react';
import type { Item, User, ChatThread } from '../types';
import { CloseIcon, HeartIcon } from './Icons';
import ChatWindow from './ChatWindow';

interface ItemModalProps {
  item: Item;
  seller: User;
  currentUser: User;
  distance: number;
  chatThread?: ChatThread;
  onClose: () => void;
  onUpdateItemStatus: (itemId: number, status: 'available' | 'sold') => void;
  onSendMessage: (itemId: number, receiverId: number, text: string) => void;
  wishlist: number[];
  onToggleWishlist: (itemId: number) => void;
}

const ItemModal: React.FC<ItemModalProps> = ({ item, seller, currentUser, distance, chatThread, onClose, onUpdateItemStatus, onSendMessage, wishlist, onToggleWishlist }) => {
  const isSeller = currentUser.id === seller.id;
  const isWishlisted = wishlist.includes(item.id);

  const handleMarkAsSold = () => {
    onUpdateItemStatus(item.id, 'sold');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2">
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
        </div>

        {/* Right Side: Details & Chat */}
        <div className="w-full md:w-1/2 flex flex-col p-6 overflow-y-auto">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold text-gray-900 pr-2">{item.name}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <CloseIcon className="w-7 h-7" />
            </button>
          </div>
          <div className="flex items-center justify-between mb-4">
             <p className="text-3xl font-extrabold text-riceBlue">${item.price}</p>
             <button
                onClick={() => onToggleWishlist(item.id)}
                className="flex items-center space-x-2 text-sm font-semibold py-2 px-4 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
             >
                <HeartIcon className={`w-5 h-5 ${isWishlisted ? 'text-red-500' : 'text-gray-500'}`} filled={isWishlisted}/>
                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
             </button>
          </div>
          
          <div className="text-sm text-gray-600 space-y-2 mb-4">
            <p><span className="font-semibold">Seller:</span> {seller.name} ({seller.college})</p>
            <p><span className="font-semibold">Distance:</span> {distance.toFixed(1)} miles away</p>
            <p><span className="font-semibold">Tags:</span> {item.tags.join(', ')}</p>
          </div>

          <p className="text-gray-700 mb-6 flex-shrink-0">{item.description}</p>
          
          {isSeller ? (
            <button
              onClick={handleMarkAsSold}
              disabled={item.status === 'sold'}
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {item.status === 'sold' ? 'Item Sold' : 'Mark as Sold'}
            </button>
          ) : (
            <div className="flex-grow flex flex-col border-t pt-4 min-h-[200px]">
              <h3 className="text-lg font-semibold mb-2 text-center text-gray-700">Chat with {seller.name}</h3>
              <ChatWindow 
                currentUser={currentUser}
                receiver={seller}
                chatThread={chatThread}
                onSendMessage={(text) => onSendMessage(item.id, seller.id, text)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemModal;