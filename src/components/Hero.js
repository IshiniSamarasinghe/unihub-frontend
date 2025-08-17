import React from "react";
import "./Hero.css";

export default function Hero() {
  const bg = `${process.env.PUBLIC_URL}/assets/hero-image2.png`;

  const handleScroll = () => {
    const el = document.getElementById("event-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero hero--template">
      <div className="hero__container">
        {/* Left: dark panel */}
        <div className="hero__left">
          <span className="hero__eyebrow">Welcome to UniHub</span>

          <h1 className="hero__headline">
            Create, Share, and Grow <span className="marker">Your Campus Community</span>
              
          </h1>

          <p className="hero__lead">
            Discover workshops, club meetups, and university events in one place.
            Submit your own events and manage approvals with a click.
          </p>

          <div className="hero__actions">
            <button className="btn btn--amber" onClick={handleScroll}>
              Get Started
            </button>
            
          </div>

          <ul className="hero__ticks">
            <li>✓ Email approval links</li>
            <li>✓ Media gallery per event</li>
            <li>✓ Smart reminders</li>
          </ul>
        </div>

        {/* Right: image */}
        <div className="hero__right">
          <div
            className="hero__img"
            style={{ backgroundImage: `url(${bg})` }}
            aria-label="Students celebrating graduation"
            role="img"
          />
          <button className="play-btn" aria-label="Watch tour">
            <span className="play-triangle" />
          </button>
        </div>
      </div>
    </section>
  );
}
