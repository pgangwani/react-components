/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import PropTypes from 'prop-types';
import styled from 'styled-components';

export const StyledPagination = styled.ul.attrs({
  'data-garden-id': 'pagination.pagination_view',
  'data-garden-version': PACKAGE_VERSION
})`
  *,
  ::before,
  ::after {
    box-sizing: border-box;
  }

  display: flex;
  list-style: none;
`;

StyledPagination.displayName = 'StyledPagination';

export const StyledPage = styled.li.attrs({
  'data-garden-id': 'pagination.page',
  'data-garden-version': PACKAGE_VERSION
})`
  margin: 0 8px;
  border-radius: 4px;
  background-color: grey;
  cursor: pointer;
  padding: 8px;

  ${props =>
    props.current &&
    `
    background-color: red;
  `}

  ${props =>
    props.focused &&
    `
    background-color: blue;
  `}

  &:hover {
    color: green;
  }
`;

StyledPage.propTypes = {
  current: PropTypes.bool,
  focused: PropTypes.bool,
  hovered: PropTypes.bool
};

export const StyledNextPage = styled(StyledPage).attrs({
  'data-garden-id': 'pagination.next_page',
  'data-garden-version': PACKAGE_VERSION
})`
  ${props =>
    props.hidden &&
    `
    visibility: hidden;
  `}
`;

StyledNextPage.propTypes = {
  current: PropTypes.bool,
  focused: PropTypes.bool,
  hovered: PropTypes.bool,
  hidden: PropTypes.bool
};

export const StyledPreviousPage = styled(StyledPage).attrs({
  'data-garden-id': 'pagination.previous_page',
  'data-garden-version': PACKAGE_VERSION
})`
  ${props =>
    props.hidden &&
    `
    visibility: hidden;
  `}
`;

StyledPreviousPage.propTypes = {
  current: PropTypes.bool,
  focused: PropTypes.bool,
  hovered: PropTypes.bool,
  hidden: PropTypes.bool
};

export const StyledGap = styled.li.attrs({
  'data-garden-id': 'pagination.gap',
  'data-garden-version': PACKAGE_VERSION
})``;
