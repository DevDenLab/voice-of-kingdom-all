import React from 'react';
import { Container } from 'react-bootstrap';

const VokMusic = () => {
  const albums = [
    {
      title: "AMOPE WA – We Offer PRAISE!",
      year: "2025",
      description: "This album announces God's focus on thanksgiving - Praising God for His grace and the countless blessings in life. The title roughly translates to 'Our Gratitude,' emphasizing giving thanks to God. The lyrics reflect themes of thanksgiving, divine grace, and redemption, acknowledging how God's mercy and intervention have transformed lives. It's a song of deep reflection and appreciation for God's unfailing love and support during challenging times.",
      quote: "In the song, reflecting testimonies of overcoming challenges, attributing all victories to God's grace rather than personal effort. 'Amope wa' serves as a repeated call to gratitude and worship.",
      quoteSource: "— Ephesians 5:19-20",
      image: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%q=100",
      links: {
        youtube: "https://youtube.com/playlist/album1",
        spotify: "https://spotify.com/album1",
        appleMusic: "https://music.apple.com/album1",
        amazon: "https://amazon.com/album1",
      },
    },
    {
      title: "MASTER OF THE UNIVERSE – OLORI AYE",
      year: "2025",
      description: "The Album 'Master of the Universe (Olori Aye)' celebrates God's supreme authority and majesty. 'Olori Aye' which translates to 'Ruler of the Earth' in Yoruba, reflects themes of worship, reverence, and awe for God's omnipotence. The lyrics highlight God's power to make mountains crumble, defeat enemies, and command the universe, affirming His role as the ultimate creator and sustainer. The song seeks to draw listeners closer to God's presence, emphasizing His unparalleled greatness and ability to provide peace and victory. The song seeks to draw listeners closer to God's presence, emphasizing His unparalleled greatness and ability to provide peace and victory.",
      quote: "'But in these last days He has spoken to us by His Son, whom He appointed heir of all things, and through whom He made the universe.'",
      quoteSource: "— Hebrew 1:2",
      image: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%q=100",
      links: {
        youtube: "https://youtube.com/playlist/album2",
        spotify: "https://spotify.com/album2",
        appleMusic: "https://music.apple.com/album2",
        amazon: "https://amazon.com/album2",
      },
    },
    {
      title: "All the Way Yahweh",
      year: "2025",
      description: "All the Way Yahweh' is a heartfelt journey of faith, worship, and gratitude, celebrating the unfailing goodness and kindness of God. This album invites listeners to reflect on their personal experiences with divine guidance and to rejoice in the unwavering presence of Yahweh through life’s triumphs and trials. Whether you’re standing at a crossroads, celebrating a victory, or seeking solace in challenging times, 'All the Way Yahweh' reminds you that God’s kindness and faithfulness endure through every step of the journey. This album is more than music—it’s an experience of worship, designed to inspire and strengthen your faith in the One who is always good and kind.",
      quote: "Prepare to sing, reflect, and celebrate as you join this moving celebration of Yahweh’s love.",
      quoteSource: "— Psalm 25:10",
      image: "https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%q=100",
      links: {
        youtube: "https://youtube.com/playlist/album3",
        spotify: "https://spotify.com/album3",
        appleMusic: "https://music.apple.com/album3",
        amazon: "https://amazon.com/album3",
      },
    },
  ];

  const renderPlatformButtons = (links) => (
    <div className="platform-buttons">
      <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="platform-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
        <span>YouTube</span>
      </a>
      <a href={links.spotify} target="_blank" rel="noopener noreferrer" className="platform-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 14.5c2.5-1 5.5-1 8 0" />
          <path d="M7 11.5c3.5-1 6.5-1 10 0" />
          <path d="M6 8.5c4.5-1 7.5-1 12 0" />
        </svg>
        <span>Spotify</span>
      </a>
      <a href={links.appleMusic} target="_blank" rel="noopener noreferrer" className="platform-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
          <path d="M10 2c1 .5 2 2 2 5" />
        </svg>
        <span>Apple Music</span>
      </a>
      <a href={links.amazon} target="_blank" rel="noopener noreferrer" className="platform-button">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 8v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z" />
          <path d="M3 8h18" />
          <path d="m12 12 4 4" />
          <path d="m12 12-4 4" />
        </svg>
        <span>Amazon</span>
      </a>
    </div>
  );

  return (
    <div className="music-page">
      <div className="hero-section-music">
        <div className="hero-overlay"></div>
        <h1>WELCOME TO VOKIM MUSIC</h1>
        <p className="hero-subtitle-music">
          VOKIM is a gospel band dedicated to spreading the gospel through heartfelt worship and praise,
          responding to God's movement across the earth in these transformative times.
        </p>
      </div>

      <div className="albums-container">
        <div className="albums-grid">
          {albums.map((album, index) => (
            <div className="album-card" key={index}>
              <div className="card-image-container-music">
                <img src={album.image} alt={album.title} />
              </div>
              <div className="card-content">
                <span className="category">Upcoming Album</span>
                <h3 className="title">{album.title}</h3>
                <p className="year">{album.year}</p>
                <p className="description">{album.description}</p>
                <p className="quote">{album.quote}</p>
                <p className="quote-source">{album.quoteSource}</p>
              </div>
              <div className="card-player">
                {renderPlatformButtons(album.links)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VokMusic;