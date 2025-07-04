// ✅ UniversityLogos.js (Mobile Responsive with Hover Effects)

import React from 'react';
import './UniversityLogos.css';


function UniversityLogos() {
  const logos = [
    { src: '/react/assets/universities/uok.png', alt: 'University of Kelaniya' },
    { src: '/react/assets/universities/colo.png', alt: 'University of Colombo' },
    { src: '/react/assets/universities/pera.png', alt: 'University of Peradeniya' },
    { src: '/react/assets/universities/jaff.png', alt: 'University of Jaffna' },
    { src: '/react/assets/universities/jpura.png', alt: 'University of Sri Jayewardenepura' },
    { src: '/react/assets/universities/art.png', alt: 'University of Visual & Performing Arts' },
    { src: '/react/assets/universities/eas.png', alt: 'Eastern University' },
    { src: '/react/assets/universities/mora.png', alt: 'University of Moratuwa' },
    { src: '/react/assets/universities/ruhuna.png', alt: 'University of Ruhuna' },
  ];

  return (
    <div className="university-logos-wrapper">
      <div className="university-logos-grid">
        {logos.map((logo, index) => (
          <div key={index} className="university-logo-item">
            <img
              src={logo.src}
              alt={logo.alt}
              title={logo.alt}
              className="university-logo-img"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default UniversityLogos;
