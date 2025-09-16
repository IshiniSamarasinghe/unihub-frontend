import React from "react";
import "./JoinSocietiesHero.css";

export default function JoinSocietiesHero({
  title = "READY TO START YOUR JOURNEY WITH US?",
  description = "Lead a project, learn new skills, or simply find your crowd. Browse the societies below and register today to start your exciting chapter in university life.",
  ctaText = "Click Here",
  href = "/societies" // change to any link / anchor you want
}) {
  return (
    <section className="join-hero" aria-labelledby="join-hero-title">
      <div className="join-hero__inner">
        <h2 id="join-hero-title" className="join-hero__title">
          {title}
        </h2>

        <p className="join-hero__desc">
          {description}
        </p>

        <a className="join-hero__btn" href={href}>
          {ctaText}
        </a>
      </div>
    </section>
  );
}
