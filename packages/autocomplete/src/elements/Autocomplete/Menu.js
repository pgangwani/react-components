/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useRef, useLayoutEffect, createContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Popper } from 'react-popper';
import { MenuView } from '@zendeskgarden/react-menus';

import { StyledMenuOverflow, StyledMenuWrapper } from './styled-elements';
import { useDownshiftContext } from './utils';

export const MenuContext = createContext(0);

/**
 * Component for use within the Autocomplete component
 */
export default function Menu({ children, maxHeight, zIndex, style, ...props }) {
  const {
    getMenuProps,
    isOpen,
    inputWrapperRef,
    itemsRef,
    previousItemRef,
    nextItemIndexesRef
  } = useDownshiftContext('Menu');
  const currentIndexRef = useRef(0);
  const popperScheduleUpdateRef = useRef(null);

  // Ensure all items are rendered before resetting
  useLayoutEffect(() => {
    currentIndexRef.current = 0;
    previousItemRef.current = null;
    itemsRef.current = [];
    nextItemIndexesRef.current = {};
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
