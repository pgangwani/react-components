/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { NextItem as MenuNextItem } from '@zendeskgarden/react-menus';

import { useDownshiftContext, useMenuContext } from './utils';

/**
 * Component for use within the Autocomplete component
 */
export default function NextItem({ value, component = MenuNextItem, disabled, ...props }) {
  const { currentIndexRef } = useMenuContext('Item');
  const {
    getItemProps,
    selectedItem,
    highlightedIndex,
    itemsRef,
    itemToString
  } = useDownshiftContext('Item');

  const currentIndex = currentIndexRef.current;
  const isFocused = currentIndex === highlightedIndex;
  let isSelected = selectedItem === value;

  if (itemToString) {
    isSelected = itemToString(selectedItem) === itemToString(value);
  }

  useEffect(() => {
    if (!disabled) {
      itemsRef.current.push(value);
    }
  });

  if (disabled) {
    return React.createElement(component, {
      disabled,
      ...props
    });
  }

  currentIndexRef.current++;

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

NextItem.propTypes = {
  value: PropTypes.any,
  component: PropTypes.any
};
