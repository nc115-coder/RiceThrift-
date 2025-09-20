
import React, { useState } from 'react';
import type { Item } from '../types';
import { CloseIcon } from './Icons';

interface NewItemFormProps {
  onClose: () => void;
  onAddItem: (newItem: Omit<Item, 'id' | 'sellerId' | 'college' | 'location' | 'createdAt' | 'status'>) => void;
}

const NewItemForm: React.FC<NewItemFormProps> = ({ onClose, onAddItem }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !image) {
      alert('Please fill out all fields and upload an image.');
      return;
    }

    onAddItem({
      name,
      description,
      price: parseFloat(price),
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      imageUrl: URL.createObjectURL(image),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">Sell Your Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-riceBlue focus:border-riceBlue" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-riceBlue focus:border-riceBlue" />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input type="number" id="price" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-riceBlue focus:border-riceBlue" />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input type="text" id="tags" value={tags} onChange={e => setTags(e.target.value)} placeholder="e.g. vintage, blue, denim" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-riceBlue focus:border-riceBlue" />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
            <input type="file" id="image" accept="image/*" onChange={e => e.target.files && setImage(e.target.files[0])} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-riceBlue hover:file:bg-blue-100"/>
          </div>
          <div className="pt-2">
            <button type="submit" className="w-full bg-riceBlue text-white font-bold py-3 px-4 rounded-md hover:bg-blue-800 transition-colors">List Item</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewItemForm;
