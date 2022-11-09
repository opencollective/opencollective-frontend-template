import React from 'react';
import styled from 'styled-components';

import { H4 } from '@opencollective/frontend-components/components/Text';

const StoryWrapper = styled.div`
  .video {
    aspect-ratio: 16 / 9;
    width: 100%;
    border-radius: 8px;
  }
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
  background: white;
  padding: 32px;
  .meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }
  .tags {
    display: flex;

    gap: 16px;
  }
`;

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
  }
  h2 {
    margin: 8px 0;
    line-height: 1.375;
    font-weight: 500;
  }

  h3 {
    margin: 32px 0 16px 0;
    line-height: 1.375;
  }
`;

const Tag = styled.div`
  background: ${({ color }) => color ?? '#333'};
  color: white;
  padding: 4px 8px;
  border-radius: 8px;

  display: inline-block;
`;

const Video = ({ src, title }) => {
  return (
    <iframe
      className="video"
      title={title}
      src={src}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope;"
      allowFullScreen
    ></iframe>
  );
};
export default function Stories({ stories }) {
  const story = stories && stories[0];
  if (!story) return null;
  return (
    <React.Fragment>
      <H4 px={'24px'} fontWeight="300" mt={4} mb={2}>
        Stories
      </H4>
      <StoryWrapper>
        {story.video && <Video src={story.video.src} title={story.video.title} />}
        <div>
          {/* <h1>{story.title}</h1>
        <h2>{story.subtitle}</h2> */}
          <Markdown dangerouslySetInnerHTML={{ __html: story.content }} />
          <div className="meta">
            <div className="tags">
              {story.tags.map(tag => (
                <Tag color={tag.color} key={tag.tag}>
                  {tag.tag}
                </Tag>
              ))}
            </div>
            <div>{story.location}</div>
          </div>
        </div>
      </StoryWrapper>
    </React.Fragment>
  );
}
