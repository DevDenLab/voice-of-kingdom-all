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
      'VOKIM373_efkf04',
      'VOKIM339_u6fpyi',
      'VOKIM325_r3ojtj',
      'VOKIM285_w7zxta',
      'VOKIM33_ilastc',
      'VOKIM2_uj6mbq',
    ];

    const videos = [
      {
        url: 'home//video 1.MOV',
        type: 'video/quicktime'
      },
      {
        url: 'home//video 2.MOV',
        type: 'video/quicktime'
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