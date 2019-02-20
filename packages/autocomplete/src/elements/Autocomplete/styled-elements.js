/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Input } from '@zendeskgarden/react-textfields';

export const StyledMenuOverflow = styled.div`
  overflow-y: auto;
  max-height: ${props => props.maxHeight || 'inherit'};
`;

StyledMenuOverflow.propTypes = {
  maxHeight: PropTypes.string
};

export const StyledInput = styled(Input).attrs({ bare: true })`
  ${props =>
    !props.isOpen &&
    `
    && {
      opacity: 0;
      height: 0;
      min-height: 0;
      width: 0;
      min-width: 0;
    }
  `}
`;

StyledInput.propTypes = {
  isOpen: PropTypes.bool
};

export const StyledMenuWrapper = styled.div`
  z-index: ${props => props.zIndex};
`;

StyledMenuWrapper.propTypes = {
  zIndex: PropTypes.number
};

export const StyledInnerPreview = styled.div`
  display: inline-block;
  vertical-align: middle;
`;
