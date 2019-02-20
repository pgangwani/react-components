/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useEffect,
  useLayoutEffect
} from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Downshift from 'downshift';
import { Manager, Reference, Popper } from 'react-popper';
import { KEY_CODES } from '@zendeskgarden/react-selection';
import { MenuView, Item as MenuItem } from '@zendeskgarden/react-menus';
import { TextGroup, Label, FauxInput, Input } from '@zendeskgarden/react-textfields';

const StyledMenuOverflow = styled.div`
  overflow-y: auto;
  max-height: ${props => props.maxHeight || 'inherit'};
`;

StyledMenuOverflow.propTypes = {
  maxHeight: PropTypes.string
};

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

StyledInput.propTypes = {
  isOpen: PropTypes.bool
};

const StyledMenuWrapper = styled.div`
  z-index: ${props => props.zIndex};
`;

StyledMenuWrapper.propTypes = {
  zIndex: PropTypes.number
};

const AutocompleteContext = createContext({});
const MenuContext = createContext(0);

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
function Autocomplete({
  isOpen,
  onOpen,
  highlightedIndex,
  onHighlight,
  selectedItem,
  onSelect,
  inputValue,
  onInputValueChange,
  itemToString,
  children
}) {
  const [controlledIsOpen, setControlledIsOpen] = useState(false);
  const [controlledHighlightedIndex, setControlledHighlightedIndex] = useState(null);
  const [controlledSelectedItem, setControlledSelectedItem] = useState(null);
  const [controlledInputValue, setControlledInputValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const inputWrapperRef = useRef(null);
  const firstItemRef = useRef(null);

  const onOpenCallback = value => {
    if (isOpen === undefined) {
      setControlledIsOpen(value);
    }

    onOpen && onOpen(value);
  };

  const onHighlightCallback = value => {
    if (highlightedIndex === undefined) {
      setControlledHighlightedIndex(value);
    }

    onHighlight && onHighlight(value);
  };

  const onSelectCallback = value => {
    if (selectedItem === undefined) {
      setControlledSelectedItem(value);
    }

    onSelect && onSelect(value);
  };

  const onInputCallback = value => {
    if (inputValue === undefined) {
      setControlledInputValue(value);
    }

    onInputValueChange && onInputValueChange(value);
  };

  return (
    <Manager>
      <Downshift
        isOpen={isOpen === undefined ? controlledIsOpen : isOpen}
        highlightedIndex={
          highlightedIndex === undefined ? controlledHighlightedIndex : highlightedIndex
        }
        selectedItem={selectedItem === undefined ? controlledSelectedItem : selectedItem}
        inputValue={inputValue === undefined ? controlledInputValue : inputValue}
        itemToString={itemToString}
        onStateChange={changes => {
          if (Object.prototype.hasOwnProperty.call(changes, 'isOpen')) {
            onOpenCallback(changes.isOpen);
          }

          if (Object.prototype.hasOwnProperty.call(changes, 'highlightedIndex')) {
            onHighlightCallback(changes.highlightedIndex);
          }

          if (Object.prototype.hasOwnProperty.call(changes, 'selectedItem')) {
            onSelectCallback(changes.selectedItem);
            onInputCallback('');
          }
        }}
      >
        {downshiftInternals => (
          <TextGroup {...downshiftInternals.getRootProps({ refKey: 'innerRef' })}>
            <AutocompleteContext.Provider
              value={{
                isHovered,
                setIsHovered,
                onOpenCallback,
                onSelectCallback,
                onInputCallback,
                inputWrapperRef,
                firstItemRef,
                ...downshiftInternals
              }}
            >
              {children}
            </AutocompleteContext.Provider>
          </TextGroup>
        )}
      </Downshift>
    </Manager>
  );
}

/**
 * Component to nest within Autocomplete
 */
function AutocompleteLabel(props) {
  const { getLabelProps, setIsHovered } = useDownshiftContext('Label');

  return (
    <Label
      {...getLabelProps({
        ...props,
        onMouseEnter: () => {
          setIsHovered(true);
        },
        onMouseLeave: () => {
          setIsHovered(false);
        }
      })}
    />
  );
}

/**
 * Component to nest within Autocomplete
 **/
function Preview({ children, ...props }) {
  const {
    getInputProps,
    highlightedIndex,
    isOpen,
    isHovered,
    onInputCallback,
    onSelectCallback,
    onOpenCallback,
    inputWrapperRef,
    firstItemRef
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
          {!isOpen && children}
          <StyledInput
            {...getInputProps({
              innerRef: inputRef,
              isOpen,
              onChange: e => {
                onInputCallback(e.target.value);
              },
              onKeyDown: e => {
                if (!isOpen && (e.keyCode === KEY_CODES.ENTER || e.keyCode === KEY_CODES.SPACE)) {
                  onOpenCallback(true);
                  e.preventDefault();
                }

                if (
                  isOpen &&
                  highlightedIndex === null &&
                  (e.target.value && e.target.value.trim().length !== 0) &&
                  e.keyCode === KEY_CODES.ENTER &&
                  firstItemRef.current !== null
                ) {
                  onSelectCallback(firstItemRef.current);
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

/**
 * Component to nest within Autocomplete
 */
function Menu({ children, maxHeight, zIndex, style, ...props }) {
  const { getMenuProps, isOpen, inputWrapperRef, firstItemRef } = useDownshiftContext('Menu');
  const currentIndexRef = useRef(0);
  const popperScheduleUpdateRef = useRef(null);

  // Ensure all items are rendered before resetting
  useLayoutEffect(() => {
    firstItemRef.current = null;
    currentIndexRef.current = 0;
    popperScheduleUpdateRef.current && popperScheduleUpdateRef.current();
  });

  const menuWidth = inputWrapperRef.current
    ? inputWrapperRef.current.getBoundingClientRect().width
    : 0;

  return (
    <MenuContext.Provider value={{ currentIndexRef }}>
      {isOpen && (
        <Popper placement="bottom">
          {({ ref, style: popperStyle, scheduleUpdate, placement }) => {
            popperScheduleUpdateRef.current = scheduleUpdate;

            return (
              <StyledMenuWrapper innerRef={ref} zIndex={zIndex} style={popperStyle}>
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
              </StyledMenuWrapper>
            );
          }}
        </Popper>
      )}
    </MenuContext.Provider>
  );
}

Menu.propTypes = {
  children: PropTypes.node,
  maxHeight: PropTypes.string,
  zIndex: PropTypes.number,
  style: PropTypes.object
};

Menu.defaultProps = {
  maxHeight: '350px',
  zIndex: 1000
};

/**
 * Component to nest within Autocomplete
 */
function Item({ value, component = MenuItem, ...props }) {
  const { currentIndexRef } = useContext(MenuContext);
  const { getItemProps, selectedItem, highlightedIndex, firstItemRef } = useDownshiftContext(
    'Item'
  );

  const currentIndex = currentIndexRef.current;
  const isSelected = selectedItem === value;
  const isFocused = currentIndex === highlightedIndex;

  currentIndexRef.current++;

  useEffect(() => {
    if (firstItemRef.current === null) {
      firstItemRef.current = value;
    }
  });

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

Autocomplete.Label = AutocompleteLabel;
Autocomplete.Preview = Preview;
Autocomplete.Menu = Menu;
Autocomplete.Item = Item;
Autocomplete.propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool,
  onOpen: PropTypes.func,
  highlightedIndex: PropTypes.number,
  onHighlight: PropTypes.func,
  selectedItem: PropTypes.any,
  onSelect: PropTypes.func,
  inputValue: PropTypes.string,
  onInputValueChange: PropTypes.func,
  itemToString: PropTypes.func
};

export default Autocomplete;
