/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { zdColorGrey800 } from '@zendeskgarden/css-variables';
import ChevronLeftIcon from '@zendeskgarden/svg-icons/src/16/chevron-left-stroke.svg';
import ChevronRightIcon from '@zendeskgarden/svg-icons/src/16/chevron-right-stroke.svg';

import retrieveOverrideStyles from './utils/retrieveOverrideStyles';

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
  justify-content: center;
  margin-top: 0;
  padding: 0;
  list-style: none;
  white-space: nowrap;

  ${props => retrieveOverrideStyles(props)};
`;

StyledPagination.displayName = 'StyledPagination';

const commonPageStyling = css`
  display: inline-block;
  margin-left: 4px;
  border-radius: 4px;
  cursor: pointer;
  padding: 0 0.35714em;
  min-width: 32px;
  max-width: 64px;
  height: 32px;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  line-height: 2.28571;
  color: #68737d;
  font-size: 14px;
  user-select: none;
`;

export const StyledPage = styled.li.attrs({
  'data-garden-id': 'pagination.page',
  'data-garden-version': PACKAGE_VERSION
})`
  ${commonPageStyling}

  ${props =>
    props.current &&
    `
    background-color: rgba(104, 115, 125, .15);
    color: #2f3941;
    font-weight: 600;
  `}

  ${props =>
    props.focused &&
    `
    outline: none;
    box-shadow: inset 0 0 0 3px rgba(31, 115, 183, .35);
  `}

  &:focus {
    outline: none;
  }

  &:hover {
    background-color: rgba(104, 115, 125, 0.15);
    color: #2f3941;
  }

  &:active {
    box-shadow: none;
    background-color: rgba(104, 115, 125, 0.25);
  }

  ${props => retrieveOverrideStyles(props)};
`;

StyledPage.propTypes = {
  current: PropTypes.bool,
  focused: PropTypes.bool,
  hovered: PropTypes.bool
};

const styledNextPageWrapperHoveredStyling = css`
  color: ${zdColorGrey800};
`;

const StyledNextPageWrapper = styled.li.attrs({
  'data-garden-id': 'pagination.next_page',
  'data-garden-version': PACKAGE_VERSION
})`
  ${commonPageStyling}

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  ${props =>
    props.focused &&
    `
    ${styledNextPageWrapperHoveredStyling}

    background-color: rgba(104, 115, 125, .15);
  `}

  &:hover {
    ${styledNextPageWrapperHoveredStyling}
  }

  &:focus {
    outline: none;
  }

  ${props =>
    props.hidden &&
    `
    visibility: hidden;
  `}

  ${props => retrieveOverrideStyles(props)};
`;

export const StyledNextPage = React.forwardRef((props, ref) => (
  <StyledNextPageWrapper ref={ref} {...props}>
    <ChevronRightIcon />
  </StyledNextPageWrapper>
));

StyledNextPage.propTypes = {
  focused: PropTypes.bool,
  hovered: PropTypes.bool,
  hidden: PropTypes.bool
};

const StyledPreviousPageWrapper = styled(StyledPage).attrs({
  'data-garden-id': 'pagination.previous_page',
  'data-garden-version': PACKAGE_VERSION
})`
  display: flex;
  align-items: center;
  justify-content: center;

  ${props =>
    props.focused &&
    `
    ${styledNextPageWrapperHoveredStyling}

    background-color: rgba(104, 115, 125, .15);
  `}

  &:hover {
    ${styledNextPageWrapperHoveredStyling}
  }

  &:focus {
    outline: none;
  }

  ${props =>
    props.hidden &&
    `
    visibility: hidden;
  `}

  ${props => retrieveOverrideStyles(props)};
`;

export const StyledPreviousPage = React.forwardRef((props, ref) => (
  <StyledPreviousPageWrapper ref={ref} {...props}>
    <ChevronLeftIcon />
  </StyledPreviousPageWrapper>
));

StyledPreviousPage.propTypes = {
  current: PropTypes.bool,
  focused: PropTypes.bool,
  hovered: PropTypes.bool,
  hidden: PropTypes.bool
};

export const StyledGap = styled(StyledPage).attrs({
  'data-garden-id': 'pagination.gap',
  'data-garden-version': PACKAGE_VERSION
})`
  font-size: 16px;

  ${props => retrieveOverrideStyles(props)};
`;
