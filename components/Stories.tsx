import React from 'react';
import { Flipped, Flipper } from 'react-flip-toolkit';
import styled from 'styled-components';

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
    font-size: 28px;
    font-weight: 700;
  }
  h2 {
    margin: 8px 0;
    line-height: 1.375;
    font-weight: 500;
    font-size: 18px;
  }

  h3 {
    margin: 32px 0 16px 0;
    line-height: 1.375;
  }
`;

const Tag = styled.div`
  background: ${({ color }) => color ?? '#333'};
  color: white;
  padding: 4px 12px;
  border-radius: 99px;

  display: inline-block;
`;

export default function Stories({ stories, currentTag }) {
  if (!stories?.length) {
    return null;
  }

  return (
    <div className="">
      <h1 className="mb-6 text-4xl font-bold text-gray-500">Featured stories</h1>
      <div className="relative h-[350px]">
        <Flipper flipKey={currentTag}>
          <div className="absolute -left-2 -right-24 flex gap-8 overflow-x-scroll pl-2 pb-6 pr-24">
            {stories
              .filter(story => currentTag === 'ALL' || !!story.tags.find(t => t.tag === currentTag))
              .map(story => {
                return (
                  <Flipped flipId={story.slug} key={story.slug}>
                    <div className="fadeIn max-w-2xl flex-shrink-0 rounded-lg bg-white p-8" key={story.slug}>
                      <div className="flex gap-8">
                        <img src="/video-placeholder.png" alt="Video placeholder" className="h-64 w-64" />
                        <div>
                          <Markdown dangerouslySetInnerHTML={{ __html: story.content }} />
                          <div className="meta">
                            <div className="tags">
                              {story.tags.map(tag => (
                                <Tag color={tag.color} key={tag.tag}>
                                  {tag.tag}
                                </Tag>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Flipped>
                );
              })}
          </div>
        </Flipper>

        <div className="absolute -left-2 z-10 h-full w-2 bg-gradient-to-l from-transparent to-[#f9fafb]"></div>
        <div className="absolute -right-24 z-10 h-full w-24 bg-gradient-to-r from-transparent to-[#f9fafb]"></div>
      </div>
    </div>
  );
}
