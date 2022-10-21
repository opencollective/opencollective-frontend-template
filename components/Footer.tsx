import React from 'react';
import styled from 'styled-components';

import packageJSON from '../package.json';

const StyledFooter = styled.footer`
  margin-top: 2rem;
  font-size: 13px;

  ul {
    margin-bottom: 1rem;
    padding: 0;
    list-style: none;
  }

  li {
    margin-right: 1rem;
    display: inline-block;
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
        <li>
          <em>
            <strong>
              opencollective/frontend-components@{packageJSON.dependencies['@opencollective/frontend-components']}
            </strong>
          </em>
        </li>
      </ul>
    </StyledFooter>
  );
}
