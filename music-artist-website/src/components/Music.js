
import React from 'react';
import './Music.css';



function Music() {
  const musicCatalog = [
      { title: 'Album 1', cover: 'https://m.zenmix.io/mm/royalty-free-spiritual-music.jpg', link: '#' },
      { title: 'Album 2', cover: 'https://m.zenmix.io/mm/royalty-free-spiritual-music.jpg', link: '#' },
      { title: 'Single 1', cover: 'https://m.zenmix.io/mm/royalty-free-spiritual-music.jpg', link: '#' },
      { title: 'Single 2', cover: 'https://m.zenmix.io/mm/royalty-free-spiritual-music.jpg', link: '#' },
    ];
    
  return (
    <div className="vok-music-page">
      {/* Hero Section */}
      <section className="hero-section">
        <img src="https://m.zenmix.io/mm/royalty-free-spiritual-music.jpg" alt="Sarah Akintunde" className="artist-photo" />
        <div className="bio-content">
          <h1>Sarah Akintunde</h1>
          <p>
            Sarah Akintunde is a gospel artist known for her deep and powerful worship. Her ministry has reached 
            thousands, leading people closer to God through heartfelt music and spiritual engagement. Experience her 
            soulful worship in all its glory.
          </p>
        </div>
      </section>

      {/* Music Catalog */}
      <section className="music-catalog">
        <h2>Music Catalog</h2>
        <div className="catalog-grid">
          {musicCatalog.map((item, index) => (
            <div key={index} className="music-item">
              <img src={item.cover} alt={item.title} className="album-cover" />
              <h3>{item.title}</h3>
              <a href={item.link} className="stream-button">Stream Now</a>
            </div>
          ))}
        </div>
      </section>

      {/* Streaming Links */}
      <section className="streaming-links">
        <h2>Listen to Sarah's Music</h2>
        <div className="streaming-buttons">
          <a href="https://www.spotify.com" target="_blank" rel="noreferrer" className="spotify">Spotify</a>
          <a href="https://www.apple.com/music" target="_blank" rel="noreferrer" className="apple-music">Apple Music</a>
          <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="youtube">YouTube</a>
          <a href="https://www.amazon.com/music" target="_blank" rel="noreferrer" className="amazon-music">Amazon Music</a>
        </div>
      </section>
    </div>
  );
}

export default Music;