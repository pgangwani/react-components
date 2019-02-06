/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useRef, useEffect, useState } from 'react';
import usePagination from './usePagination';
import {
  StyledPagination,
  StyledPreviousPage,
  StyledPage,
  StyledNextPage,
  StyledGap
} from './styled-elements';
// import PropTypes from 'prop-types';

/**
 * Test docs
 */
function Pagination() {
  const previousPageRef = useRef();
  const nextPageRef = useRef();
  const numPages = 5;
  const pageRefs = [];

  for (let x = 0; x < numPages; x++) {
    pageRefs.push(React.createRef());
  }

  const [controlledFocusedIndex, setControlledFocusedIndex] = useState(0);
  const [controlledSelectedIndex, setControlledSelectedIndex] = useState(0);

  const [isPrevHidden, setIsPrevHidden] = useState(false);
  const [isNextHidden, setIsNextHidden] = useState(false);

  const previousSelectedIndex = useRef();
  const previousFocusedIndex = useRef();

  const refs = [];

  if (!isPrevHidden) {
    refs.push(previousPageRef);
  }

  refs.push(...pageRefs);

  if (!isNextHidden) {
    refs.push(nextPageRef);
  }

  const {
    selectedIndex,
    focusedIndex,
    getContainerProps,
    getNextPageProps,
    getPreviousPageProps,
    getPageProps
  } = usePagination({
    refs: [...refs],
    selectedIndex: controlledSelectedIndex,
    focusedIndex: controlledFocusedIndex,
    onFocus: newFocus => {
      // console.log(newFocus);
      setControlledFocusedIndex(newFocus);
    },
    onSelection: newSelection => {
      debugger;
      let updatedNewSelection = newSelection;

      const isPrevious = refs[newSelection].current === previousPageRef.current;
      const isNext = refs[newSelection].current === nextPageRef.current;

      if (isPrevious) {
        if (previousSelectedIndex.current > 1) {
          updatedNewSelection = previousSelectedIndex.current - 1;
        } else {
          updatedNewSelection = 0;
          setIsPrevHidden(true);
        }
      } else if (isNext) {
        if (previousSelectedIndex.current < refs.length - 3) {
          updatedNewSelection = previousSelectedIndex.current + 1;
        } else {
          updatedNewSelection = refs.length - 2;
          setIsNextHidden(true);
        }
      }

      setControlledSelectedIndex(updatedNewSelection);
    }
  });

  // console.log('Selected', selectedIndex);
  // console.log('Focused', focusedIndex);
  // console.log('Refs', refs);

  useEffect(
    () => {
      // refs.current = [];
      // if (!isPrevHidden) {
      //   refs.current.push(previousPageRef);
      // }
      // refs.current.push(...pageRefs);
      // if (!isNextHidden) {
      //   refs.current.push(nextPageRef);
      // }
      // if (!isPrevHidden || !isNextHidden) {
      //   setControlledFocusedIndex(focusedIndex - 1);
      //   setControlledSelectedIndex(selectedIndex - 1);
      // }
    },
    [isPrevHidden, isNextHidden]
  );

  useEffect(
    () => {
      previousSelectedIndex.current = selectedIndex;
      previousFocusedIndex.current = focusedIndex;
    },
    [selectedIndex, focusedIndex]
  );

  // useEffect(
  //   () => {
  //     setControlledFocusedIndex(focusedIndex);
  //   },
  //   [focusedIndex]
  // );

  // useEffect(
  //   () => {
  //     let newSelectedIndex = selectedIndex;
  //     let newFocusedIndex = focusedIndex;

  //     const isPrevious = newSelectedIndex === 0;

  //     if (isPrevious) {
  //       // debugger;
  //       if (controlledSelectedIndex > 1) {
  //         newSelectedIndex = controlledSelectedIndex - 1;
  //       } else {
  //         newSelectedIndex = 1;
  //       }
  //     }

  //     setControlledSelectedIndex(newSelectedIndex);
  //     setControlledFocusedIndex(newFocusedIndex);
  //   },
  //   [selectedIndex, focusedIndex]
  // );
  // useEffect(
  //   () => {
  //     console.log('Newly Selected:', selectedIndex);
  //     debugger;

  //     setControlledSelectedIndex(2);

  //     // if (selectedIndex === 0) {
  //     //   // Previous selected

  //     //   if (selectedIndex > 1) {
  //     //     setControlledSelectedIndex(selectedIndex - 1);
  //     //   } else {
  //     //     setControlledSelectedIndex(1);
  //     //   }
  //     // } else {
  //     //   setControlledSelectedIndex(selectedIndex);
  //     // }
  //   },
  //   [selectedIndex]
  // );

  // useEffect(
  //   () => {
  //     console.log('Newly Focused:', focusedIndex);
  //     setControlledFocusedIndex(focusedIndex);
  //   },
  //   [focusedIndex]
  // );

  const renderPages = () => {
    const pages = [];

    // console.log('rendering pages');

    for (let x = 0; x < numPages; x++) {
      pages.push(
        <StyledPage
          {...getPageProps({
            current: x + 1 === selectedIndex,
            focused: x + 1 === focusedIndex,
            key: `page-${x}`,
            page: x + 1,
            ref: pageRefs[x],
            onClick: () => {
              // console.log(selectedIndex);
              // console.log(focusedIndex);
            }
          })}
        >
          {x + 1}
        </StyledPage>
      );
    }

    return pages;
  };

  return (
    <StyledPagination {...getContainerProps()}>
      <StyledPreviousPage
        ref={previousPageRef}
        key="previous-page"
        current={selectedIndex === 0}
        focused={focusedIndex === 0}
        hidden={isPrevHidden}
        {...(isPrevHidden ? {} : getPreviousPageProps())}
      />
      {renderPages()}
      <StyledNextPage
        ref={nextPageRef}
        data-test-id={refs.length}
        key="next-page"
        current={selectedIndex === refs.length - 1}
        focused={focusedIndex === refs.length - 1}
        hidden={isNextHidden}
        {...(isNextHidden ? {} : getNextPageProps())}
      />
    </StyledPagination>
  );
}

export default Pagination;
