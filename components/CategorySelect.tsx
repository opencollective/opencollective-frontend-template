import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

type StyledCategoryButtonProps = React.HTMLProps<HTMLButtonElement> & {
  selected?: boolean;
};

const StyledCategoryButton = styled.button<StyledCategoryButtonProps>`
  flex: 1;
  background: white;
  padding: 40px 20px;
  border: ${({ selected, color }) => (selected ? `${color} solid 3px` : 'white solid 3px')};
  cursor: pointer;
  font-weight: 500;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 500;
  white-space: nowrap;
  :hover {
    border: ${({ color }) => `${color} solid 3px`};
  }
  transition: border 0.2s ease-in-out;
`;

const StyledCategorySelector = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  flex-wrap: wrap;
`;

const CategorySelect = ({ categories, selectedCategory }) => {
  const router = useRouter();
  return (
    <StyledCategorySelector>
      {categories.map(category => (
        <StyledCategoryButton
          key={category.label}
          selected={(!selectedCategory && !category.tag) || category.tag === selectedCategory}
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
