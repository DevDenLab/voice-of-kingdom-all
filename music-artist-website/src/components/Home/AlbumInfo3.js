import React from 'react';

const AlbumDisplay3 = () => {

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
            <h1>UPCOMING</h1>
            <h2>All the Way Yahweh
            </h2>
            <p className="album-year-home">2025</p>
            <p className="album-description-home">
            All the Way Yahweh" is a heartfelt journey of faith, worship, and gratitude, celebrating the unfailing goodness and kindness of God. This album invites listeners to reflect on their personal experiences with divine guidance and to rejoice in the unwavering presence of Yahweh through life’s triumphs and trials.
            </p>
            <p className="album-description-home">Whether you’re standing at a crossroads, celebrating a victory, or seeking solace in challenging times, "All the Way Yahweh" reminds you that God’s kindness and faithfulness endure through every step of the journey. This album is more than music—it’s an experience of worship, designed to inspire and strengthen your faith in the One who is always good and kind.
            </p>
            <p>Prepare to sing, reflect, and celebrate as you join this moving celebration of Yahweh’s love.
            </p>
            <p style={{textAlign: 'right', marginRight: '2rem'}}>—Psalm 25:10</p>
          </div>
        
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
          margin-top:0px
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
          height:700px,
        }

        .album-image-section-home:hover {
          transform: scale(1.02);
        }

        .album-image-home {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
          max-height: 600px;
        }

        .album-info-section-home {
          display: flex;
          flex-direction: column;
          justify-content: center;
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
            height:350px; 
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

export default AlbumDisplay3;