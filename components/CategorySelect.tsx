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
  border: ${({ selected }) => (selected ? 'blue solid 2px' : 'white solid 2px')};
  cursor: pointer;
  font-weight: 500;
  border-radius: 8px;
  font-size: 20px;
  font-weight: 500;
`;

const StyledCategorySelector = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
`;

const CategorySelect = ({ categories, selectedCategory }) => {
  const router = useRouter();
  return (
    <StyledCategorySelector>
      {categories.map(category => (
        <StyledCategoryButton
          key={category.label}
          selected={(!selectedCategory && !category.tag) || category.tag === selectedCategory}
          onClick={() => {
            router.push(`/${category.tag || ''}`);
            // router.push({ pathname: '/', ...(category.tag && { query: { tag: category.tag } }) });
          }}
        >
          {category.label}
        </StyledCategoryButton>
      ))}
    </StyledCategorySelector>
  );
};

export default CategorySelect;
