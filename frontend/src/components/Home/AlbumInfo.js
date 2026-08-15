import React from 'react';

const AlbumDisplay = () => {
  return (
    <div className="album-container-home">
      <div className="album-wrapper-home">
        <div className="album-image-section-home">
          <img
            src="https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D%q=100"
            alt="The Great Commission Album Cover"
            className="album-image-home"
          />
        </div>
        
        <div className="album-info-section-home">
          <div className="album-header-home">
            <h1>UPCOMING ALBUM</h1>
            <h2>AMOPE  WA – We Offer PRAISE!</h2>
            <p className="album-year-home">2025</p>
            <p className="album-description-home">
            This album announces God's focus on thanksgiving  - Praising God for His grace and the countless blessings in life. The title roughly translates to "Our Gratitude," emphasizing giving thanks to God. The lyrics reflect themes of thanksgiving, divine grace, and redemption, acknowledging how God's mercy and intervention have transformed lives. It's a song of deep reflection and appreciation for God's unfailing love and support during challenging times.
            </p>
            <p>In the song,  reflecting testimonies of overcoming challenges, attributing all victories to God's grace rather than personal effort. "Amope wa" serves as a repeated call to gratitude and worship. </p>
            <p style={{textAlign: 'right', marginRight: '4rem'}}>— Ephesians 5:19-20</p>
          </div>
        
          {/* <div className="platform-buttons">
            <button className="platform-button">
              {youtubeIcon}
              <span>YouTube</span>
            </button>
            <button className="platform-button">
              {appleIcon}
              <span>Apple Music</span>
            </button>
            <button className="platform-button">
              {spotifyIcon}
              <span>Spotify</span>
            </button>
            <button className="platform-button">
              {amazonIcon}
              <span>Amazon</span>
            </button>
          </div>

          <button className="all-albums-button">
            ALL ALBUMS
          </button> */}
        </div>
      </div>
      
      <style jsx>{`
        .album-container-home {
          min-height: 100vh;
          background-color: #f8f9fa;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .album-wrapper-home {
          background: white;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 3rem;
          display: grid;
          gap: 3rem;
          grid-template-columns: 1fr 1fr;
        }

        .album-image-section-home {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
          height: auto;  /* Changed from height:fit-content */
          align-self: start;  /* Added to align with the top */
        }

        .album-image-section-home:hover {
          transform: scale(1.02);
        }

        .album-image-home {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          max-height: 500px;
        }

        .album-info-section-home {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;  /* Changed from center to align with top */
          gap: 2rem;
        }

        .album-header-home h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .album-year-home {
          font-size: 1.25rem;
          color: #666;
          margin: 0 0 1rem 0;
          font-weight: 500;
        }

        .album-description-home {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #4a4a4a;
          margin: 0;
        }

        .platform-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .platform-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          border: 2px solid #eaeaea;
          border-radius: 50px;
          background-color: white;
          color: #333;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .platform-button:hover {
          background-color: #f8f9fa;
          border-color: #333;
          transform: translateY(-2px);
        }

        .all-albums-button {
          padding: 1rem 2rem;
          background-color: #333;
          color: white;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.3s ease;
          align-self: flex-start;
        }

        .all-albums-button:hover {
          background-color: #1a1a1a;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .album-wrapper-home {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }
          
          .album-image-home {
            height: 350px;
          }
          
          .album-header-home h1 {
            font-size: 2rem;
          }

          .platform-buttons {
            justify-content: center;
          }

          .all-albums-button {
            width: 100%;
            text-align: center;
          }

          .album-container-home {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AlbumDisplay;