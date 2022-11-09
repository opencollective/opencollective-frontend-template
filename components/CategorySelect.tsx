import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

type StyledCategoryButtonProps = React.HTMLProps<HTMLButtonElement> & {
  selected?: boolean;
};

// Hex to Hexa
const hexToHexa = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const StyledCategoryButton = styled.button<StyledCategoryButtonProps>`
  flex: 1;
  background: white;
  padding: 32px 20px;
  border: ${({ selected, color }) => (selected ? `${color} solid 3px` : 'white solid 3px')};
  cursor: pointer;
  font-weight: 500;
  border-radius: 12px;
  font-size: 20px;
  font-weight: 500;
  white-space: nowrap;

  :hover {
    border: ${({ color }) => `${color} solid 3px`};
    box-shadow: 0px 4px 8px ${({ color }) => hexToHexa(color, 0.2)};
  }
  transition: all 0.2s ease-in-out;
`;

const StyledCategorySelector = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
`;

const CategorySelect = ({ categories, selectedTag }) => {
  const router = useRouter();
  return (
    <StyledCategorySelector>
      {categories.map(category => (
        <StyledCategoryButton
          type="button"
          key={category.label}
          selected={(!selectedTag && !category.tag) || category.tag === selectedTag}
          color={category.color}
          onClick={() => {
            router.push({ pathname: '/', ...(category.tag && { query: { tag: category.tag } }) }, null, {
              shallow: true,
            });
          }}
        >
          {category.label}
        </StyledCategoryButton>
      ))}
    </StyledCategorySelector>
  );
};

export default CategorySelect;
