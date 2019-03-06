/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { createContext } from 'react';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';

import StyledMenu from '../styled/StyledMenu';
import useDropdownContext from '../utils/useDropdownContext';
import { getPopperPlacement } from '../utils/placements';

export const MenuContext = createContext();

const Menu = ({
  placement,
  popperModifiers,
  eventsEnabled,
  animate,
  maxHeight,
  style: menuStyle,
  zIndex,
  ...props
}) => {
  const {
    itemIndexRef,
    previousItemRef,
    previousIndexRef,
    nextItemsHashRef,
    popperReferenceElementRef,
    downshift: { isOpen, getMenuProps }
  } = useDropdownContext();

  itemIndexRef.current = 0;
  nextItemsHashRef.current = {};
  previousItemRef.current = undefined;
  previousIndexRef.current = 0;

  if (!isOpen) {
    return null;
  }

  const popperPlacement = getPopperPlacement(placement);

  return (
    <MenuContext.Provider value={{ itemIndexRef }}>
      <Popper placement={popperPlacement} modifiers={popperModifiers} eventsEnabled={eventsEnabled}>
        {({ ref, style, placement: currentPlacement }) => {
          let computedStyle = menuStyle;

          if (popperReferenceElementRef.current) {
            computedStyle = {
              ...menuStyle,
              width: popperReferenceElementRef.current.getBoundingClientRect().width
            };
          }

          return (
            <div ref={ref} style={{ zIndex, ...style }}>
              <StyledMenu
                {...getMenuProps({
                  maxHeight,
                  refKey: 'menuRef',
                  placement: currentPlacement,
                  animate,
                  style: computedStyle,
                  ...props
                })}
              />
            </div>
          );
        }}
      </Popper>
    </MenuContext.Provider>
  );
};

Menu.propTypes = {
  placement: PropTypes.string,
  popperModifiers: PropTypes.object,
  eventsEnabled: PropTypes.bool,
  animate: PropTypes.bool,
  maxHeight: PropTypes.string,
  zIndex: PropTypes.number,
  style: PropTypes.object
};

Menu.defaultProps = {
  placement: 'bottom-start',
  animate: true,
  eventsEnabled: true,
  maxHeight: '400px',
  zIndex: 1000
};

export default Menu;
