import React from 'react';
import type { User, Item, ChatThread } from '../types';

interface InboxProps {
  currentUser: User;
  chats: ChatThread[];
  items: Item[];
  users: User[];
  onSelectItem: (item: Item) => void;
}

const Inbox: React.FC<InboxProps> = ({ currentUser, chats, items, users, onSelectItem }) => {

  const userChats = chats
    .filter(chat => chat.participantIds.includes(currentUser.id))
    .map(chat => {
      const item = items.find(i => i.id === chat.itemId);
      const otherParticipantId = chat.participantIds.find(id => id !== currentUser.id);
      const otherParticipant = users.find(u => u.id === otherParticipantId);
      const lastMessage = chat.messages[chat.messages.length - 1];
      return { chat, item, otherParticipant, lastMessage };
    })
    .filter(data => data.item && data.otherParticipant && data.lastMessage)
    .sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime());

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Inbox</h2>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {userChats.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {userChats.map(({ chat, item, otherParticipant, lastMessage }) => item && otherParticipant && (
              <li key={chat.itemId} onClick={() => onSelectItem(item)} className="p-4 hover:bg-gray-50 cursor-pointer flex items-center space-x-4">
                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{lastMessage.timestamp.toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-gray-600">Chat with {otherParticipant.name}</p>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    <span className={lastMessage.senderId === currentUser.id ? 'font-semibold' : ''}>
                      {lastMessage.senderId === currentUser.id ? 'You: ' : ''}
                    </span>
                    {lastMessage.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-center text-gray-500">No active chats.</p>
        )}
      </div>
    </div>
  );
};

export default Inbox;