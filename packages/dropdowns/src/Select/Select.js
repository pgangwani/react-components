/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Reference } from 'react-popper';
import { KEY_CODES } from '@zendeskgarden/react-selection';
import StyledHiddenInput from '../styled/StyledHiddenInput';
import StyledSelect from '../styled/StyledSelect';
import useDropdownContext from '../utils/useDropdownContext';

const Select = ({ children, ...props }) => {
  const {
    popperReferenceElementRef,
    downshift: { getRootProps, getToggleButtonProps, getInputProps, isOpen, openMenu }
  } = useDropdownContext();
  const [isFocused, setisFocused] = useState(false);
  const hiddenInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      hiddenInputRef.current && hiddenInputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Reference>
      {({ ref }) => (
        <div {...getRootProps()}>
          <StyledSelect
            {...getToggleButtonProps({
              tabIndex: 0,
              open: isOpen,
              focused: isOpen || isFocused,
              onFocus: () => {
                setisFocused(true);
              },
              onBlur: () => {
                setisFocused(false);
              },
              innerRef: tbRef => {
                ref(tbRef);
                popperReferenceElementRef.current = tbRef;
              },
              onKeyDown: e => {
                if (!isOpen && e.keyCode === KEY_CODES.ENTER) {
                  e.preventDefault();
                  e.stopPropagation();
                  openMenu();
                }
              },
              ...props
            })}
          >
            {children}
            <StyledHiddenInput
              {...getInputProps({
                innerRef: hiddenInputRef,
                tabIndex: -1,
                readOnly: true,
                value: ''
              })}
            />
          </StyledSelect>
        </div>
      )}
    </Reference>
  );
};

Select.propTypes = {
  children: PropTypes.node
};

export default Select;
