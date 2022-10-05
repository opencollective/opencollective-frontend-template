import React from 'react';
import styled from 'styled-components';

import packageJSON from '../package.json';

const StyledFooter = styled.footer`
  margin-top: 2rem;

  ul {
    margin-bottom: 1rem;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-block;
    margin-right: 1rem;
  }
`;

export default function Footer() {
  return (
    <StyledFooter>
      <hr />
      <ul>
        <li>
          <em>
            <strong>
              {packageJSON.name}@{packageJSON.version}
            </strong>
          </em>
        </li>
      </ul>
    </StyledFooter>
  );
}
