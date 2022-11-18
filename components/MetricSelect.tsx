import React from 'react';
import styled from 'styled-components';

type StyledCategoryButtonProps = React.HTMLProps<HTMLButtonElement> & {
  selected?: boolean;
  color?: string;
};

const StyledCategoryButton = styled.button<StyledCategoryButtonProps>`
  flex: 1;
  padding: 24px 20px;
  background: none;
  border: 0;
  //background: ${({ selected }) => (selected ? 'white' : `transparent`)};
  //border-radius: 16px;
  //box-shadow: ${({ selected }) => (selected ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' : `0`)};

  //cursor: pointer;
  font-weight: 500;
  font-size: 20px;
  font-weight: 500;
  white-space: nowrap;
  border: 3px transparent solid;
  // :hover {
  //   border: ${({ color }) => `3px ${color} solid`};
  // }
  transition: all 0.2s ease-in-out;
`;

const StyledCategorySelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
`;

const MetricSelect = ({ options, selectedTag, onSelect, children }) => {
  return (
    <StyledCategorySelector>
      {options.map(option => (
        <StyledCategoryButton
          type="button"
          color={option.color}
          key={option.tag}
          selected={(!selectedTag && !option.tag) || option.tag === selectedTag}
          onClick={() => {
            onSelect(option);
          }}
        >
          {option.label}
        </StyledCategoryButton>
      ))}
      {children}
    </StyledCategorySelector>
  );
};

export default MetricSelect;
