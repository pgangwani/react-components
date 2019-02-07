/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { useEffect } from 'react';

import composeEventHandlers from './utils/composeEventHandlers';
import KEY_CODES from './utils/KEY_CODES';
import DIRECTION from './utils/DIRECTIONS';
import ACTIONS from './utils/ACTIONS';

/* eslint-disable */
function stateReducer(items, selectedItem, focusedItem, action, onSelection, onFocus) {
  switch (action.type) {
    case ACTIONS.FOCUS:
      onFocus && onFocus(action.payload);
      return;
    case ACTIONS.INCREMENT: {
      const currentIndex =
        focusedItem === undefined ? items.indexOf(selectedItem) : items.indexOf(focusedItem);
      onFocus && onFocus(items[(currentIndex + 1) % items.length]);
      return;
    }
    case ACTIONS.DECREMENT: {
      const currentIndex =
        focusedItem === undefined ? items.indexOf(selectedItem) : items.indexOf(focusedItem);
      onFocus && onFocus(items[(currentIndex + items.length - 1) % items.length]);
      return;
    }
    case ACTIONS.HOME:
      onFocus && onFocus(items[0]);
      return;
    case ACTIONS.END:
      onFocus && onFocus(items[items.length - 1]);
      return;
    case ACTIONS.MOUSE_SELECT:
      onSelection && onSelection(action.payload);
      onFocus && onFocus(undefined);
      return;
    case ACTIONS.KEYBOARD_SELECT:
      onSelection && onSelection(action.payload);
      return;
    case ACTIONS.EXIT_WIDGET:
      onFocus && onFocus(undefined);
      return;
  }
}
/* eslint-enable */

/**
 * Custom useSelection hook
 */
function useRovingTabIndex({
  direction = DIRECTION.HORIZONTAL,
  selectedItem,
  focusedItem,
  onSelect,
  onFocus
} = {}) {
  const refs = [];
  const items = [];

  const dispatch = action => {
    stateReducer(items, selectedItem, focusedItem, action, onSelect, onFocus);
  };

  useEffect(
    () => {
      const focusedIndex = items.indexOf(focusedItem);

      refs[focusedIndex] && refs[focusedIndex].current.focus();
    },
    [focusedItem]
  );

  const getContainerProps = ({ role = 'listbox', ...other } = {}) => ({
    role,
    ...other
  });

  const getItemProps = ({
    selectedAriaKey = 'aria-selected',
    role = 'option',
    onFocus: onFocusCallback,
    onKeyDown,
    onClick,
    item,
    focusRef,
    ...other
  } = {}) => {
    if (item === undefined) {
      throw new Error('You messed up');
    }

    refs.push(focusRef);
    items.push(item);

    const isFocused = focusedItem === item;
    const isSelected = selectedItem === item;

    return {
      role,
      tabIndex: isFocused ? 0 : -1,
      [selectedAriaKey]: isSelected,
      onFocus: composeEventHandlers(onFocusCallback, () => {
        dispatch({ type: ACTIONS.FOCUS, payload: item });
      }),
      onBlur: e => {
        if (e.target.tabIndex === 0) {
          dispatch({ type: ACTIONS.EXIT_WIDGET });
        }
      },
      onClick: composeEventHandlers(onClick, () => {
        dispatch({ type: ACTIONS.MOUSE_SELECT, payload: item });
      }),
      onKeyDown: composeEventHandlers(onKeyDown, e => {
        if (
          (e.keyCode === KEY_CODES.UP && direction === DIRECTION.VERTICAL) ||
          (e.keyCode === KEY_CODES.LEFT && direction === DIRECTION.HORIZONTAL)
        ) {
          dispatch({ type: ACTIONS.DECREMENT });
          e.preventDefault();
        } else if (
          (e.keyCode === KEY_CODES.DOWN && direction === DIRECTION.VERTICAL) ||
          (e.keyCode === KEY_CODES.RIGHT && direction === DIRECTION.HORIZONTAL)
        ) {
          dispatch({ type: ACTIONS.INCREMENT });
          e.preventDefault();
        } else if (e.keyCode === KEY_CODES.HOME) {
          dispatch({ type: ACTIONS.HOME });
          e.preventDefault();
        } else if (e.keyCode === KEY_CODES.END) {
          dispatch({ type: ACTIONS.END });
          e.preventDefault();
        } else if (e.keyCode === KEY_CODES.SPACE || e.keyCode === KEY_CODES.ENTER) {
          dispatch({
            type: ACTIONS.KEYBOARD_SELECT,
            payload: item
          });
          e.preventDefault();
        }
      }),
      ...other
    };
  };

  return {
    focusedItem,
    selectedItem,
    getItemProps,
    getContainerProps
  };
}

export default useRovingTabIndex;
