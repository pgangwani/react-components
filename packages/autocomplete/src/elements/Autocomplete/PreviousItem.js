/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { PreviousItem as MenuPreviousItem } from '@zendeskgarden/react-menus';

import { useDownshiftContext, useMenuContext } from './utils';

/**
 * Component for use within the Autocomplete component
 */
export default function PreviousItem({ value, component = MenuPreviousItem, disabled, ...props }) {
  const { currentIndexRef } = useMenuContext('Item');
  const {
    getItemProps,
    selectedItem,
    highlightedIndex,
    itemsRef,
    itemToString,
    previousItemRef
  } = useDownshiftContext('PreviousItem');

  const currentIndex = currentIndexRef.current;
  const isFocused = currentIndex === highlightedIndex;
  let isSelected = selectedItem === value;

  if (itemToString) {
    isSelected = itemToString(selectedItem) === itemToString(value);
  }

  currentIndexRef.current++;

  useEffect(() => {
    itemsRef.current.push(value);
    previousItemRef.current = value;
  });

  return React.createElement(
    component,
    getItemProps({
      item: value,
      disabled,
      checked: isSelected && !disabled,
      focused: isFocused && !disabled,
      ...props
    })
  );
}

PreviousItem.propTypes = {
  value: PropTypes.any,
  component: PropTypes.any
};
