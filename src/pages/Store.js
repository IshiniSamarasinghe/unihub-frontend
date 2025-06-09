import React, { useState } from 'react';
import './Store.css';

const storeItems = [
  {
    id: 1,
    title: 'Shield Tshirt',
    description: 'We are taking pre orders now! This is your chance.',
    image: '/assets/store/tshirt.jpeg',
    faculty: 'Faculty of Computing and Technology',
    price: 'Rs. 1200',
    details: 'Whatsap Us - 076 3514818'
  },
  {
    id: 2,
    title: 'Stillness of Night',
    description: 'Custom-made bookmark to raise event funds.',
    image: '/assets/store/bookmark.png',
    faculty: 'Faculty of Computing and Technology',
    price: 'Rs. 50',
    details: 'Whatsap Us - 077 6237016'
  },
  {
    id: 3,
    title: 'ITSA Fundraising Stickers',
    description: 'Sticker pack for your laptop or notebook!',
    image: '/assets/store/stickers.jpg',
     faculty: 'Faculty of Computing and Technology',
    price: 'Starting from Rs. 10/= ',
    details: 'Whatsap Us - 076 3514818'
  },
];

function Store() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="store-wrapper">
      <div className={`store-container ${selectedItem ? 'blurred' : ''}`}>
        <h2>Support Student Fundraisers</h2>
        <div className="store-grid">
          {storeItems.map(item => (
            <div className="store-card" key={item.id}>
              <img src={item.image} alt={item.title} className="store-image" />
              <h3>{item.title}</h3>
              <p className="item-description">{item.description}</p>
              <button className="buy-btn" onClick={() => setSelectedItem(item)}>View</button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="store-modal">
          <div className="modal-content">
            <span className="close-modal" onClick={() => setSelectedItem(null)}>&times;</span>
            <img src={selectedItem.image} alt={selectedItem.title} />

            <h3>{selectedItem.title}</h3>
            <h5>{selectedItem.faculty}</h5>
            <p>{selectedItem.description}</p>

            <p>{selectedItem.price}</p>
            <p>{selectedItem.details}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Store;
