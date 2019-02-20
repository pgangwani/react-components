/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Downshift from 'downshift';
import { Manager, Reference, Popper } from 'react-popper';
import { KEY_CODES } from '@zendeskgarden/react-selection';
import { MenuView, Item as MenuItem } from '@zendeskgarden/react-menus';
import { TextGroup, Label, FauxInput, Input, Hint, Message } from '@zendeskgarden/react-textfields';

const StyledMenuOverflow = styled.div`
  overflow-y: auto;
  max-height: ${props => props.maxHeight || 'inherit'};
`;

const StyledInput = styled(Input).attrs({ bare: true })`
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

const AutocompleteContext = createContext({});
const AutocompleteMenuContext = createContext(0);

/**
 * utility to ensure all static elements are used within a parent Autocomplete
 */
function useDownshiftContext(componentName) {
  const downshift = useContext(AutocompleteContext);

  if (!downshift) {
    throw new Error(`"${componentName}" can only be rendered within the "Autocomplete" component`);
  }

  return downshift;
}

/**
 * Test Autocomplete with Hooks
 */
function Autocomplete({ onChange, inputValue, onInputValueChange, itemToString, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(null);

  const inputWrapperRef = useRef(null);
  const inputRef = useRef(null);

  return (
    <Manager>
      <Downshift
        isOpen={isOpen}
        inputValue={inputValue}
        selectedItem={selectedItem}
        highlightedIndex={highlightedIndex}
        itemToString={itemToString}
        onStateChange={changes => {
          if (Object.prototype.hasOwnProperty.call(changes, 'isOpen')) {
            setIsOpen(changes.isOpen);
          }

          if (Object.prototype.hasOwnProperty.call(changes, 'highlightedIndex')) {
            setHighlightedIndex(changes.highlightedIndex);
          }

          if (Object.prototype.hasOwnProperty.call(changes, 'selectedItem')) {
            setSelectedItem(changes.selectedItem);
            onChange && onChange(changes.selectedItem);
            onInputValueChange('');
          }
        }}
        onOuterClick={() => {
          setIsOpen(false);
        }}
      >
        {downshiftInternals => (
          <div>
            <Reference>
              {({ ref }) => (
                <TextGroup>
                  <Label
                    {...downshiftInternals.getLabelProps({
                      onMouseEnter: () => {
                        setIsHovered(true);
                      },
                      onMouseLeave: () => {
                        setIsHovered(false);
                      }
                    })}
                  >
                    Test Label
                  </Label>
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
                      setIsOpen(true);
                    }}
                  >
                    {!isOpen && <span>{selectedItem && selectedItem}</span>}
                    <StyledInput
                      {...downshiftInternals.getInputProps({
                        innerRef: inputRef,
                        isOpen,
                        onChange: e => {
                          onInputValueChange && onInputValueChange(e.target.value);
                        },
                        onKeyDown: e => {
                          if (e.keyCode === KEY_CODES.ENTER || e.keyCode === KEY_CODES.SPACE) {
                            setIsOpen(true);

                            e.preventDefault();
                          }
                        },
                        onClick: () => {
                          setIsOpen(true);
                        }
                      })}
                    />
                  </FauxInput>
                </TextGroup>
              )}
            </Reference>
            <AutocompleteContext.Provider
              value={{ setHighlightedIndex, inputWrapperRef, ...downshiftInternals }}
            >
              {children}
            </AutocompleteContext.Provider>
          </div>
        )}
      </Downshift>
    </Manager>
  );
}

/**
 * Component to nest within Autocomplete
 */
function Menu({ children, maxHeight, style, ...props }) {
  const { getMenuProps, isOpen, inputWrapperRef } = useDownshiftContext('Menu');
  const currentIndexRef = useRef(0);
  const popperScheduleUpdateRef = useRef(null);

  // Reset to 0 on every re-render
  useEffect(() => {
    currentIndexRef.current = 0;
    popperScheduleUpdateRef.current && popperScheduleUpdateRef.current();
  });

  const menuWidth = inputWrapperRef.current
    ? inputWrapperRef.current.getBoundingClientRect().width
    : 0;

  return (
    <AutocompleteMenuContext.Provider value={{ currentIndexRef }}>
      {isOpen && (
        <Popper placement="bottom">
          {({ ref, style: popperStyle, scheduleUpdate, placement }) => {
            popperScheduleUpdateRef.current = scheduleUpdate;

            return (
              <div ref={ref} style={popperStyle}>
                <MenuView
                  {...getMenuProps({
                    refKey: 'innerRef',
                    placement,
                    style: { width: menuWidth, ...style },
                    ...props
                  })}
                >
                  <StyledMenuOverflow maxHeight={maxHeight}>{children}</StyledMenuOverflow>
                </MenuView>
              </div>
            );
          }}
        </Popper>
      )}
    </AutocompleteMenuContext.Provider>
  );
}

Menu.propTypes = {
  children: PropTypes.node,
  maxHeight: PropTypes.string,
  style: PropTypes.object
};
Menu.defaultProps = {
  maxHeight: '350px'
};

/**
 * Component to nest within Autocomplete
 */
function Item({ value, component = MenuItem, ...props }) {
  const { currentIndexRef } = useContext(AutocompleteMenuContext);
  const { getItemProps, selectedItem, highlightedIndex } = useDownshiftContext('Item');

  const currentIndex = currentIndexRef.current;
  const isSelected = selectedItem === value;
  const isFocused = currentIndex === highlightedIndex;

  currentIndexRef.current++;

  return React.createElement(
    component,
    getItemProps({
      item: value,
      checked: isSelected,
      focused: isFocused,
      ...props
    })
  );
}

Item.propTypes = {
  value: PropTypes.string,
  component: PropTypes.any
};

Autocomplete.Menu = Menu;
Autocomplete.Item = Item;
Autocomplete.propTypes = {
  children: PropTypes.node
};

export default Autocomplete;
