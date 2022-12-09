import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import CollectiveButton from '../components/CollectiveButton';
import LocationTag from '../components/LocationTag';

const Markdown = styled.div`
  line-height: 1.625;
  p,
  ul,
  ol,
  blockquote {
    margin: 16px 0;
  }

  h1 {
    margin: 0 0 8px 0;
    line-height: 1.375;
    font-size: 20px;
    font-weight: 700;
  }
  h2 {
    margin: 8px 0;
    line-height: 1.375;
    font-weight: 500;
    font-size: 16px;
  }

  h3 {
    margin: 32px 0 16px 0;
    line-height: 1.375;
  }
`;

const RightArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.23035 13.791C7.93876 13.5124 7.93876 13.0607 8.23035 12.782L12.4563 8.71345L1.59111 8.71345C1.26465 8.71345 1 8.39403 1 7.99999C1 7.60596 1.26465 7.28653 1.59111 7.28653L12.4563 7.28653L8.23035 3.21795C7.93876 2.93933 7.93876 2.48759 8.23035 2.20897C8.52194 1.93034 8.99471 1.93034 9.2863 2.20897L14.7813 7.49551C15.0729 7.77413 15.0729 8.22587 14.7813 8.50449L9.2863 13.791C8.99471 14.0697 8.52194 14.0697 8.23035 13.791Z" />
  </svg>
);

const LeftArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.76965 13.791C8.06124 13.5124 8.06124 13.0607 7.76965 12.782L3.54367 8.71345L14.4089 8.71345C14.7354 8.71345 15 8.39403 15 7.99999C15 7.60596 14.7354 7.28653 14.4089 7.28653L3.54368 7.28653L7.76965 3.21795C8.06124 2.93933 8.06124 2.48759 7.76965 2.20897C7.47806 1.93034 7.00529 1.93034 6.7137 2.20897L1.21869 7.49551C0.927102 7.77413 0.927102 8.22587 1.21869 8.50449L6.7137 13.791C7.00529 14.0697 7.47806 14.0697 7.76965 13.791Z" />
  </svg>
);

export const Story = ({ story, openCollectiveModal }) => {
  return (
    <div className={`fadeIn max-w-lg rounded-lg bg-white p-4 lg:max-w-2xl lg:p-4`}>
      <div className="flex flex-col gap-4">
        {story.video && (
          <div className=" relative w-full overflow-hidden rounded-lg pb-[56.25%]">
            <iframe
              className="absolute top-0 left-0 h-full w-full"
              src={story.video.src}
              title={story.video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope;"
              allowFullScreen
            ></iframe>
          </div>
        )}
        <div className="px-4">
          {story.collective && (
            <div className="flex flex-wrap items-center gap-2  lg:-mx-4">
              <div className="-mx-2 lg:mx-0">
                <CollectiveButton collective={story.collective} openCollectiveModal={openCollectiveModal} />
              </div>
              <LocationTag location={story.collective.location} />
              {story?.tags?.map(({ tag }) => (
                <span key={tag} className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-700">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className=" text-gray-600">
            <Markdown dangerouslySetInnerHTML={{ __html: story.content }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const SliderButton = ({ onClick, disabled, children }) => {
  return (
    <button
      disabled={disabled}
      className={`flex h-8 w-8 items-center justify-center rounded-full border p-2 transition-colors lg:h-10 lg:w-10 ${
        disabled ? 'border-gray-200  text-gray-400' : 'border-blue-500 bg-white text-blue-800'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function Stories({ stories, currentTag, openCollectiveModal }) {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const currentStories = stories.filter(story => currentTag === 'ALL' || !!story.tags.find(t => t.tag === currentTag));

  if (!currentStories?.length) {
    return null;
  }

  return (
    <React.Fragment>
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className=" text-xl font-bold text-gray-600 lg:text-4xl">Featured stories</h2>
          <div className="flex items-center gap-2">
            <SliderButton onClick={() => swiperRef.current?.slidePrev()} disabled={activeIndex === 0}>
              <LeftArrow />
            </SliderButton>
            <SliderButton
              onClick={() => swiperRef.current?.slideNext()}
              disabled={activeIndex === currentStories.length - 1}
            >
              <RightArrow />
            </SliderButton>
          </div>
        </div>

        <div className="relative">
          <div className="-mx-4 lg:-ml-8 lg:-mr-10">
            <Swiper
              slidesPerView={'auto'}
              spaceBetween={30}
              className="swiper"
              pagination={{
                clickable: true,
              }}
              modules={[Navigation]}
              onReachEnd={swiper => (swiper.snapGrid = [...swiperRef.current.slidesGrid])}
              onSlideChange={swiper => {
                setActiveIndex(swiper.activeIndex);
              }}
              onBeforeInit={swiper => {
                swiperRef.current = swiper;
              }}
            >
              {currentStories.map(story => (
                <SwiperSlide key={story.slug}>
                  <Story story={story} openCollectiveModal={openCollectiveModal} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="absolute top-0 -left-4 z-10 hidden h-full w-4 bg-gradient-to-l from-transparent to-[#f9fafb] lg:-left-8 lg:block lg:w-8"></div>
          <div className="absolute top-0 -right-4 z-10 hidden h-full w-4 bg-gradient-to-r from-transparent to-[#f9fafb] lg:-right-10 lg:block lg:w-10"></div>
        </div>
      </div>
    </React.Fragment>
  );
}
