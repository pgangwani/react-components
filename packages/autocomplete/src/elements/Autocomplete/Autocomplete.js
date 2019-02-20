/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { createContext, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { Manager } from 'react-popper';
import { TextGroup } from '@zendeskgarden/react-textfields';

import Label from './Label';
import Preview from './Preview';
import Menu from './Menu';
import Item from './Item';
import PreviousItem from './PreviousItem';
import NextItem from './NextItem';

export const AutocompleteContext = createContext({});

/**
 * Autocomplete component TODO description
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
  const itemsRef = useRef([]);
  const nextItemIndexesRef = useRef({});
  const previousItemRef = useRef(null);

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

            if (!changes.isOpen) {
              onInputCallback('');
            }
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
                onHighlightCallback,
                inputWrapperRef,
                itemToString,
                itemsRef,
                previousItemRef,
                nextItemIndexesRef,
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

Autocomplete.Label = Label;
Autocomplete.Preview = Preview;
Autocomplete.Menu = Menu;
Autocomplete.Item = Item;
Autocomplete.PreviousItem = PreviousItem;
Autocomplete.NextItem = NextItem;

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
