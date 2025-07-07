import React, { useEffect, useState } from 'react';
import axios from '../axios';
import './TopSlider.css';
import { useNavigate } from 'react-router-dom';

function TopSlider() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/store-items')
            .then(res => {
                setItems(res.data);
            })
            .catch(err => {
                console.error('❌ Failed to fetch store items:', err);
                setItems([]);
            });
    }, []);

    return (
        <div className="top-slider">
            <div className="slider-track">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <span
                            className="slider-item clickable"
                            key={index}
                            onClick={() => navigate('/store')}
                        >
                            🛍️ {item.title} — {item.price}
                        </span>
                    ))
                ) : (
                    <span className="slider-item">🎉 Visit the UniHub Store and support student fundraisers!</span>
                )}
            </div>
        </div>
    );
}

export default TopSlider;
