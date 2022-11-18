import React, { Fragment } from 'react';
import { Listbox } from '@headlessui/react';
import styled from 'styled-components';

const StyledListBoxButton = styled(Listbox.Button)`
  background: transparent;
  width: 100%;

  font-size: 24px;
  outline: none;
  border: none;
  padding: 10px 14px;
  border: 3px solid transparent;
  font-weight: 500;
  cursor: pointer;
  height: 100%;
  color: #333;
  border-radius: 8px;
  transition: all 0.2s ease-in-out;
  p {
    margin: 0;
  }
  span.period {
    font-size: 20px;
    color: #333;
  }
  span {
    font-size: 12px;
    color: #666;
    vertical-align: middle;
    transition: all 0.2s ease-in-out;
  }
  :hover {
    border: 3px solid #333;

    color: #333;
    span {
      color: #333;
    }
  }
`;

const DropdownOptions = styled(Listbox.Options)`
  position: absolute;
  background: white;
  margin: 0;
  margin-top: 16px;
  list-style: none;
  border-radius: 8px;
  border: 3px solid #333;
  font-weight: 500;
  z-index: 99999;

  font-size: 24px;
  padding: 0;
  right: 0;
  white-space: nowrap;
  li {
    cursor: pointer;
    color: #333;
    padding: 12px 16px;
    padding-left: 16px;
    text-align: right;
    position: relative;
    :hover {
      background: black;
      color: white;
    }
    span {
      position: absolute;
      right: 10px;
    }
  }
`;
const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  flex-shrink: 0;
`;

export default function DropdownSelector({ options, currentTag, onChange }) {
  const selectedOption = options.find(option => option.tag === currentTag);
  return (
    <DropdownWrapper>
      <Listbox value={selectedOption} onChange={onChange}>
        <StyledListBoxButton>
          <p>
            {selectedOption?.label} <span>▼</span>
          </p>
        </StyledListBoxButton>
        <DropdownOptions>
          {options.map(option => (
            <Listbox.Option key={option.tag} value={option} as={Fragment}>
              <li>{option.label}</li>
            </Listbox.Option>
          ))}
        </DropdownOptions>
      </Listbox>
    </DropdownWrapper>
  );
}
