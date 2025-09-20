import React, { useState, useEffect } from 'react';
import Marketplace from './components/Marketplace';
import Inbox from './components/Inbox';
import Profile from './components/Profile';
import ItemModal from './components/ItemModal';
import { StoreIcon, InboxIcon, UserIcon, RiceThriftLogo } from './components/Icons';
import type { User, Item, ChatThread, Location } from './types';
import { RiceCollege } from './types';

const CURRENT_USER_ID = 1;

// Haversine formula to calculate distance
const getDistance = (loc1: {lat: number, lng: number}, loc2: {lat: number, lng: number}) => {
  if (!loc1 || !loc2) return 0;
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

// Mock Data Generation
const generateMockLocation = (): Location => ({
  lat: 29.7174 + (Math.random() - 0.5) * 0.02, // Rice University coordinates with some randomness
  lng: -95.4018 + (Math.random() - 0.5) * 0.02,
});

const generateMockUsers = (): User[] => [
  { id: 1, name: 'Sammy the Owl', college: RiceCollege.WIESS, interests: 'Vintage streetwear, designer sneakers, and classic rock band t-shirts', location: generateMockLocation() },
  { id: 2, name: 'Jane Doe', college: RiceCollege.BAKER, interests: 'Sustainable fashion, minimalist clothing, comfortable study wear', location: generateMockLocation() },
  { id: 3, name: 'John Smith', college: RiceCollege.MCMURTRY, interests: 'Athletic wear, jerseys, hats', location: generateMockLocation() },
];

const generateMockItems = (): Item[] => [
  { id: 1, sellerId: 2, name: 'Vintage Rice Sweatshirt', description: 'Cozy and soft, perfect for chilly library nights. Barely worn.', price: 25, tags: ['vintage', 'rice university', 'sweatshirt'], imageUrl: 'https://picsum.photos/seed/item1/400/400', college: RiceCollege.BAKER, status: 'available', createdAt: new Date('2023-10-26T10:00:00Z'), location: generateMockLocation() },
  { id: 2, sellerId: 3, name: 'Nike Running Shoes', description: 'Size 10. Great condition, used for one season.', price: 50, tags: ['nike', 'shoes', 'athletic'], imageUrl: 'https://picsum.photos/seed/item2/400/400', college: RiceCollege.MCMURTRY, status: 'available', createdAt: new Date('2023-10-27T11:00:00Z'), location: generateMockLocation() },
  { id: 3, sellerId: 2, name: 'North Face Backpack', description: 'Spacious backpack, can fit a laptop and multiple textbooks. All zippers work.', price: 40, tags: ['backpack', 'north face', 'school'], imageUrl: 'https://picsum.photos/seed/item3/400/400', college: RiceCollege.BAKER, status: 'sold', createdAt: new Date('2023-10-25T09:00:00Z'), location: generateMockLocation() },
  { id: 4, sellerId: 3, name: 'Fjallraven Kanken', description: 'Classic Kanken in navy blue. A few scuffs but adds to the character.', price: 30, tags: ['backpack', 'fjallraven', 'minimalist'], imageUrl: 'https://picsum.photos/seed/item4/400/400', college: RiceCollege.MCMURTRY, status: 'available', createdAt: new Date('2023-10-28T14:00:00Z'), location: generateMockLocation() },
  { id: 5, sellerId: 2, name: 'Classic Rock Graphic Tee', description: 'Led Zeppelin graphic tee, size Medium. Soft cotton.', price: 15, tags: ['t-shirt', 'vintage', 'band tee'], imageUrl: 'https://picsum.photos/seed/item5/400/400', college: RiceCollege.BAKER, status: 'available', createdAt: new Date('2023-10-29T16:00:00Z'), location: generateMockLocation() },
];

const generateMockChats = (): ChatThread[] => [
  {
    itemId: 2,
    participantIds: [1, 3],
    messages: [
      { id: 1, itemId: 2, senderId: 1, receiverId: 3, text: 'Hey! Are the Nike shoes still available?', timestamp: new Date('2023-10-27T12:00:00Z') },
      { id: 2, itemId: 2, senderId: 3, receiverId: 1, text: 'Yep, they are!', timestamp: new Date('2023-10-27T12:05:00Z') },
    ]
  }
];


type Tab = 'marketplace' | 'inbox' | 'profile';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('marketplace');
  const [users, setUsers] = useState<User[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [chats, setChats] = useState<ChatThread[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    const mockUsers = generateMockUsers();
    setUsers(mockUsers);
    setItems(generateMockItems());
    setChats(generateMockChats());
    setCurrentUser(mockUsers.find(u => u.id === CURRENT_USER_ID) || null);
    
    // Load wishlist from localStorage
    try {
        const savedWishlist = localStorage.getItem('riceThriftWishlist');
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }
    } catch (error) {
        console.error("Could not load wishlist from localStorage", error);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
        localStorage.setItem('riceThriftWishlist', JSON.stringify(wishlist));
    } catch (error) {
        console.error("Could not save wishlist to localStorage", error);
    }
  }, [wishlist]);

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };
  
  const handleAddItem = (newItem: Omit<Item, 'id' | 'sellerId' | 'college' | 'location' | 'createdAt' | 'status'>) => {
    if (!currentUser) return;
    const fullNewItem: Item = {
      ...newItem,
      id: Math.max(...items.map(i => i.id)) + 1,
      sellerId: currentUser.id,
      college: currentUser.college,
      location: currentUser.location,
      createdAt: new Date(),
      status: 'available',
    };
    setItems(prevItems => [fullNewItem, ...prevItems]);
  };

  const handleUpdateItemStatus = (itemId: number, status: 'available' | 'sold') => {
    setItems(items.map(item => item.id === itemId ? { ...item, status } : item));
    if (status === 'sold') {
        setSelectedItem(prev => (prev?.id === itemId ? { ...prev, status: 'sold' } : prev));
    }
  };

  const handleSendMessage = (itemId: number, receiverId: number, text: string) => {
    if (!currentUser) return;
    const newMessage = {
      id: Date.now(),
      itemId,
      senderId: currentUser.id,
      receiverId,
      text,
      timestamp: new Date(),
    };

    setChats(prevChats => {
      const existingThreadIndex = prevChats.findIndex(c => c.itemId === itemId && c.participantIds.includes(currentUser.id));
      if (existingThreadIndex > -1) {
        const updatedChats = [...prevChats];
        updatedChats[existingThreadIndex].messages.push(newMessage);
        return updatedChats;
      } else {
        return [...prevChats, { itemId, participantIds: [currentUser.id, receiverId], messages: [newMessage] }];
      }
    });
  };
  
  const handleToggleWishlist = (itemId: number) => {
    setWishlist(prev => 
        prev.includes(itemId) 
            ? prev.filter(id => id !== itemId) 
            : [...prev, itemId]
    );
  };


  const renderContent = () => {
    if (!currentUser) return <div>Loading...</div>;
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace 
          currentUser={currentUser} 
          users={users} 
          items={items} 
          onAddItem={handleAddItem}
          onSelectItem={setSelectedItem}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />;
      case 'inbox':
        return <Inbox 
          currentUser={currentUser}
          chats={chats}
          items={items}
          users={users}
          onSelectItem={setSelectedItem}
        />;
      case 'profile':
        return <Profile 
          user={currentUser} 
          onUpdateProfile={handleUpdateProfile} 
          items={items}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          onSelectItem={setSelectedItem}
          currentUserLocation={currentUser.location}
        />;
      default:
        return null;
    }
  };
  
  const NavItem: React.FC<{ tabName: Tab; icon: React.ReactNode; label: string }> = ({ tabName, icon, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
        activeTab === tabName ? 'text-riceBlue font-semibold' : 'text-riceGray hover:text-riceBlue'
      }`}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <div className="container mx-auto max-w-4xl pb-20">
        <header className="sticky top-0 bg-white shadow-md z-10 px-4 py-3 flex justify-center items-center">
          <RiceThriftLogo className="h-8"/>
        </header>

        <main className="p-4">
          {renderContent()}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg flex justify-around max-w-4xl mx-auto">
        <NavItem tabName="marketplace" icon={<StoreIcon className="w-6 h-6" />} label="Marketplace" />
        <NavItem tabName="inbox" icon={<InboxIcon className="w-6 h-6" />} label="Inbox" />
        <NavItem tabName="profile" icon={<UserIcon className="w-6 h-6" />} label="Profile" />
      </nav>

      {selectedItem && currentUser && (
        <ItemModal
          item={selectedItem}
          seller={users.find(u => u.id === selectedItem.sellerId)!}
          currentUser={currentUser}
          distance={getDistance(currentUser.location, selectedItem.location)}
          chatThread={chats.find(c => c.itemId === selectedItem.id && c.participantIds.includes(currentUser.id))}
          onClose={() => setSelectedItem(null)}
          onUpdateItemStatus={handleUpdateItemStatus}
          onSendMessage={handleSendMessage}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
        />
      )}
    </div>
  );
};

export default App;