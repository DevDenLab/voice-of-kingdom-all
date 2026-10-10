import React from 'react';
import MainContent from './Home/MainContent';
import Quote from './Home/Quote&Title';
import AlbumDisplay from './Home/AlbumInfo';
import AlbumDisplay2 from './Home/AlbumInfo2';
import AlbumDisplay3 from './Home/AlbumInfo3';
import SpecialEvent from './Home/SpecialEvent';
import EventHighlights from "./Home/EventHighlights";
import VokimExperience from './Home/VokimExperience';
import { useSiteContent } from '../lib/siteContent';

// Shown only until highlights are uploaded from the dashboard (/gallery/manage).
const FALLBACK_HIGHLIGHTS = [
  'VOKIM376_j2rlyl',
  'VOKIM339_px8sr8',
  'VOKIM371_bmwzge',
  'VOKIM372_vspjh2',
  'VOKIM285_q5baqn',
  'VOKIM394_r21brp',
];

const VIDEOS = [
  {
    url: 'https://www.youtube.com/embed/3kDcaMr09Uc?autoplay=0&rel=0&modestbranding=1',
    type: 'youtube'
  },
  {
    url: 'https://www.youtube.com/embed/3kDcaMr09Uc?autoplay=0&rel=0&modestbranding=1',
    type: 'youtube'
  }
];

const Home = () => {
  const { content, status } = useSiteContent();

  let images = [];
  if (status !== 'loading') {
    images = content.highlights.length ? content.highlights : FALLBACK_HIGHLIGHTS;
  }

  return (
    <div className="pb-4">
      <MainContent
        imageUrl="/static/Band_Image.jpg"
        showCountdown={content.poster.show_countdown}
        countdownTitle={`${content.event.title} STARTS IN`}
        countdownDate={content.event.countdown_date}
      />
      <Quote />
      {/*<SpecialEvent /> */}
      <VokimExperience posterKey={content.poster.key} event={content.event} />
      {/*<AlbumDisplay />*/}
      {/*<AlbumDisplay2 />*/}
      {/*<AlbumDisplay3 />*/}
      <EventHighlights images={images} videos={VIDEOS} />
    </div>
  );
};

export default Home;