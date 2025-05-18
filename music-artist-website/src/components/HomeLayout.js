import React, { useEffect, useState } from 'react';
import MainContent from './Home/MainContent';
import Quote from './Home/Quote&Title';
import AlbumDisplay from './Home/AlbumInfo';
import AlbumDisplay2 from './Home/AlbumInfo2';
import AlbumDisplay3 from './Home/AlbumInfo3';
import SpecialEvent from './Home/SpecialEvent';
import EventHighlights from "./Home/EventHighlights";

const Home = () => {
  const [media, setMedia] = useState({ images: [], videos: [] });
  useEffect(() => {
    // Set specific URLs for images and videos
    const images = [
      'VOKIM376_j2rlyl',
      'VOKIM339_px8sr8',
      'VOKIM371_bmwzge',
      'VOKIM372_vspjh2',
      'VOKIM233_iey6wf',
      'VOKIM394_r21brp',
    ];

    const videos = [
      {
        url: 'https://www.youtube.com/embed/3kDcaMr09Uc?autoplay=0&rel=0&modestbranding=1',
        type: 'youtube'
      },
      {
        url: 'https://www.youtube.com/embed/3kDcaMr09Uc?autoplay=0&rel=0&modestbranding=1',
        type: 'youtube'
      }
    ];

    setMedia({ images, videos });
  }, []);

  return (
    <div className="pb-4">
      <MainContent imageUrl="/static/Band_Image.jpg" />
      <Quote />
      {/*<SpecialEvent /> */}
      <AlbumDisplay />
      <AlbumDisplay2 />
      <AlbumDisplay3 />
      <EventHighlights images={media.images} videos={media.videos} />
    </div>
  );
};

export default Home;