import React from 'react';

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
    <div style={{ padding: '2rem 0', textAlign: 'center' }}>
     
    <div style={{
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '2rem',
  flexWrap: 'wrap',
  padding: '0 2rem',
}}>
  {logos.map((logo, index) => (
    <div key={index} style={{
      width: '80px',
      height: '80px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <img
        src={logo.src}
        alt={logo.alt}
        title={logo.alt}
        style={{
          maxHeight: '60px',
          maxWidth: '100%',
          objectFit: 'contain',
          transition: 'transform 0.3s ease',
        }}
        onMouseEnter={e => e.target.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.target.style.transform = 'scale(1.0)'}
      />
    </div>
  ))}
</div>
    </div>
  );
}

export default UniversityLogos;
