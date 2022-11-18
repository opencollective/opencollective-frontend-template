import React from 'react';
import styled from 'styled-components';

// Hex to Hexa
const hexToHexa = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

type StyledCategoryButtonProps = React.HTMLProps<HTMLButtonElement> & {
  selected?: boolean;
  color?: string;
};

const StyledCategoryButton = styled.button<StyledCategoryButtonProps>`
  flex: 1;
  padding: 20px 20px;
  background: white;
  border: ${({ selected, color }) => (selected ? `${color} solid 3px` : 'transparent solid 3px')};
  cursor: pointer;
  font-weight: 500;
  border-radius: 12px;
  font-size: 24px;
  font-weight: 500;
  white-space: nowrap;

  // box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

  :hover {
    border: ${({ color }) => `${color} solid 3px`};
    box-shadow: 0px 0px 16px ${({ color }) => hexToHexa(color, 0.2)};
  }
  transition: all 0.2s ease-in-out;
`;

const StyledCategorySelector = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  flex-wrap: wrap;
`;

const CategorySelect = ({ categories, selectedTag, onSelect, currentTimePeriod }) => {
  return (
    <StyledCategorySelector>
      {categories.map(category => (
        <StyledCategoryButton
          type="button"
          key={category.label}
          selected={category.tag === selectedTag}
          color={category.color}
          onClick={() => {
            onSelect(category);
          }}
        >
          {category.label} ({category.data[currentTimePeriod].collectiveCount})
        </StyledCategoryButton>
      ))}
    </StyledCategorySelector>
  );
};

export default CategorySelect;
