/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Reference } from 'react-popper';
import { KEY_CODES } from '@zendeskgarden/react-selection';
import { FauxInput } from '@zendeskgarden/react-textfields';

import { StyledInput, StyledInnerPreview } from './styled-elements';
import { useDownshiftContext } from './utils';

/**
 * Preview component for use in the Autocomplete component
 */
export default function Preview({ children, ...props }) {
  const {
    getInputProps,
    highlightedIndex,
    isOpen,
    isHovered,
    onInputCallback,
    onSelectCallback,
    onHighlightCallback,
    onOpenCallback,
    inputWrapperRef,
    itemsRef,
    previousItemRef
  } = useDownshiftContext('Input');

  const inputRef = useRef(null);

  return (
    <Reference>
      {({ ref }) => (
        <FauxInput
          select
          open={isOpen}
          hovered={isHovered}
          innerRef={fauxInputRef => {
            ref(fauxInputRef);
            inputWrapperRef.current = fauxInputRef;
          }}
          onClick={() => {
            inputRef.current && inputRef.current.focus();
            onOpenCallback(true);
          }}
          {...props}
        >
          {!isOpen && <StyledInnerPreview>{children}</StyledInnerPreview>}
          <StyledInput
            {...getInputProps({
              innerRef: inputRef,
              isOpen,
              onChange: e => {
                onInputCallback(e.target.value);
                onHighlightCallback(null);
              },
              onKeyDown: e => {
                const isEmpty = !e.target.value || e.target.value.trim().length === 0;

                if (!isOpen && (e.keyCode === KEY_CODES.ENTER || e.keyCode === KEY_CODES.SPACE)) {
                  onOpenCallback(true);
                  e.preventDefault();
                }

                if (
                  isOpen &&
                  highlightedIndex === null &&
                  !isEmpty &&
                  e.keyCode === KEY_CODES.ENTER &&
                  itemsRef.current.length > 0
                ) {
                  onSelectCallback(itemsRef.current[0]);
                  onOpenCallback(false);
                  onInputCallback('');
                }

                if (
                  isOpen &&
                  isEmpty &&
                  previousItemRef.current !== null &&
                  e.keyCode === KEY_CODES.LEFT
                ) {
                  onSelectCallback(previousItemRef.current);
                  onOpenCallback(false);
                  onInputCallback('');
                }
              },
              onClick: () => {
                onOpenCallback(true);
              }
            })}
          />
        </FauxInput>
      )}
    </Reference>
  );
}

Preview.propTypes = {
  children: PropTypes.node
};
