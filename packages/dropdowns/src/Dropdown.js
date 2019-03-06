/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { Manager } from 'react-popper';
import { KEY_CODES, composeEventHandlers } from '@zendeskgarden/react-selection';

export const DropdownContext = React.createContext();

const Dropdown = ({
  children,
  isOpen,
  onOpen,
  selectedItem,
  onSelect,
  highlightedIndex,
  onHighlight,
  itemToString
}) => {
  const itemIndexRef = useRef(0);
  const previousItemRef = useRef(undefined);
  const previousIndexRef = useRef(undefined);
  const nextItemsHashRef = useRef({});
  const popperReferenceElementRef = useRef(null);

  const customGetInputProps = ({ onKeyDown, ...other }, downshift) => {
    return {
      onKeyDown: composeEventHandlers(onKeyDown, e => {
        if (downshift.isOpen) {
          if (e.keyCode === KEY_CODES.TAB) {
            e.preventDefault();
            e.stopPropagation();

            downshift.selectHighlightedItem();
          }

          if (e.keyCode === KEY_CODES.LEFT && downshift.highlightedIndex !== null) {
            e.preventDefault();
            e.stopPropagation();

            downshift.selectItemAtIndex(previousIndexRef.current);
          }

          if (e.keyCode === KEY_CODES.RIGHT) {
            const nextItemIndexes = Object.values(nextItemsHashRef.current);

            if (nextItemIndexes.includes(downshift.highlightedIndex)) {
              e.preventDefault();
              e.stopPropagation();

              downshift.selectItemAtIndex(downshift.highlightedIndex);
            }
          }
        } else if (e.keyCode === KEY_CODES.ENTER || e.keyCode === KEY_CODES.SPACE) {
          e.preventDefault();
          e.stopPropagation();

          downshift.openMenu();
        }
      }),
      ...other
    };
  };

  const transformDownshift = ({ getInputProps, getToggleButtonProps, ...downshift }) => {
    return {
      getInputProps: props => getInputProps(customGetInputProps(props, downshift)),
      getToggleButtonProps: props => getToggleButtonProps({ 'aria-label': undefined, ...props }),
      ...downshift
    };
  };

  /**
   * Uses the undocumented `supressRefError` to allow component composition
   * https://github.com/downshift-js/downshift/issues/529
   */
  return (
    <Manager>
      <Downshift
        suppressRefError
        isOpen={isOpen}
        selectedItem={selectedItem || null}
        highlightedIndex={highlightedIndex}
        onStateChange={changes => {
          if (Object.prototype.hasOwnProperty.call(changes, 'isOpen')) {
            onOpen && onOpen(changes.isOpen);
          }

          if (Object.prototype.hasOwnProperty.call(changes, 'selectedItem')) {
            onSelect && onSelect(changes.selectedItem);
          }

          if (Object.prototype.hasOwnProperty.call(changes, 'highlightedIndex')) {
            onHighlight && onHighlight(changes.highlightedIndex);
          }
        }}
        stateReducer={(state, changes) => {
          switch (changes.type) {
            case undefined:
            case Downshift.stateChangeTypes.keyDownEnter:
            case Downshift.stateChangeTypes.clickItem: {
              let computedIsOpen = state.isOpen;

              if (Object.prototype.hasOwnProperty.call(changes, 'isOpen')) {
                computedIsOpen = changes.isOpen;
              }

              if (Object.prototype.hasOwnProperty.call(changes, 'selectedItem')) {
                const isPreviousItemSelected = changes.selectedItem === previousItemRef.current;
                const isNextItemSelected =
                  nextItemsHashRef.current[changes.selectedItem] !== undefined;

                computedIsOpen = isPreviousItemSelected || isNextItemSelected;
              }

              return {
                ...changes,
                isOpen: computedIsOpen
              };
            }
            default:
              return changes;
          }
        }}
      >
        {downshift => (
          <DropdownContext.Provider
            value={{
              itemIndexRef,
              itemToString,
              previousItemRef,
              previousIndexRef,
              nextItemsHashRef,
              popperReferenceElementRef,
              downshift: transformDownshift(downshift)
            }}
          >
            {children}
          </DropdownContext.Provider>
        )}
      </Downshift>
    </Manager>
  );
};

Dropdown.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  selectedItem: PropTypes.any,
  onSelect: PropTypes.func,
  highlightedIndex: PropTypes.number,
  onHighlight: PropTypes.func,
  itemToString: PropTypes.func
};

export default Dropdown;
