/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import styled from 'styled-components';

const StyledHiddenInput = styled.input`
  position: relative;
  left: -100px;
  transform: scale(0);
  opacity: 0;
  outline: 0;
  border-width: 0;
  border-style: initial;
  border-color: initial;
  background: 0 center;
  padding: 0;
  width: 1px;
  color: transparent;
  font-size: inherit;
  border-image: initial;
`;

export default StyledHiddenInput;
