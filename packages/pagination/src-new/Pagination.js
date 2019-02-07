/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import getOverrides from './utils/getOverrides';
import usePagination from './usePagination';
import {
  StyledPagination,
  StyledPreviousPage,
  StyledPage,
  StyledNextPage,
  StyledGap
} from './styled-elements';

/**
 * Example Pagination component with hooks 🎣
 */
function Pagination({
  currentPage = 1,
  totalPages = 25,
  pagePadding = 2,
  overrides = {},
  onChange
}) {
  const [OverridePagination, overridePaginationProps] = getOverrides(
    overrides.Pagination,
    StyledPagination
  );
  const [OverridePreviousPage, overridePreviousPageProps] = getOverrides(
    overrides.PreviousPage,
    StyledPreviousPage
  );
  const [OverridePage, overridePageProps] = getOverrides(overrides.Page, StyledPage);
  const [OverrideNextPage, overrideNextPageProps] = getOverrides(
    overrides.NextPage,
    StyledNextPage
  );
  const [OverrideGap, overrideGapProps] = getOverrides(overrides.Gap, StyledGap);

  const previousPageRef = useRef();
  const nextPageRef = useRef();

  const [controlledFocusedItem, setControlledFocusedItem] = useState();

  const [isPrevHidden, setIsPrevHidden] = useState(false);
  const [isNextHidden, setIsNextHidden] = useState(false);

  const {
    selectedItem,
    focusedItem,
    getContainerProps,
    getNextPageProps,
    getPreviousPageProps,
    getPageProps
  } = usePagination({
    selectedItem: currentPage,
    focusedItem: controlledFocusedItem,
    onFocus: newFocusedItem => setControlledFocusedItem(newFocusedItem),
    onSelect: newSelectedItem => {
      let modifiedNewSelectedItem = newSelectedItem;

      if (newSelectedItem === 'prev' && selectedItem > 1) {
        modifiedNewSelectedItem = selectedItem - 1;
      } else if (modifiedNewSelectedItem === 'next' && selectedItem < totalPages) {
        modifiedNewSelectedItem = selectedItem + 1;
      }

      if (modifiedNewSelectedItem !== selectedItem) {
        onChange && onChange(modifiedNewSelectedItem);
      }
    }
  });

  useEffect(
    () => {
      if (currentPage === 1) {
        setIsPrevHidden(true);

        if (focusedItem === 'prev') {
          setControlledFocusedItem(1);
        }
      } else {
        setIsPrevHidden(false);
      }

      if (currentPage === totalPages) {
        setIsNextHidden(true);

        if (focusedItem === 'next') {
          setControlledFocusedItem(totalPages);
        }
      } else {
        setIsNextHidden(false);
      }
    },
    [currentPage]
  );

  const createPage = page => {
    const pageRef = React.createRef();

    return (
      <OverridePage
        {...getPageProps({
          ...overridePageProps,
          current: page === selectedItem,
          focused: page === focusedItem,
          key: `page-${page}`,
          item: page,
          page,
          ref: pageRef,
          focusRef: pageRef
        })}
      >
        {page}
      </OverridePage>
    );
  };

  const renderPages = () => {
    const pages = [];

    for (let pageIndex = 1; pageIndex <= totalPages; pageIndex++) {
      // Always display the current page
      if (pageIndex === selectedItem) {
        pages.push(createPage(pageIndex));
        continue;
      }

      // Always display the first and last page
      if (pageIndex === 1 || pageIndex === totalPages) {
        pages.push(createPage(pageIndex));
        continue;
      }

      // Display pages used for padding around the current page
      if (pageIndex >= selectedItem - pagePadding && pageIndex <= selectedItem + pagePadding) {
        pages.push(createPage(pageIndex));
        continue;
      }

      // Handle case where front gap should not be displayed
      if (selectedItem <= pagePadding + 3 && pageIndex <= pagePadding * 2 + 3) {
        pages.push(createPage(pageIndex));
        continue;
      }

      // Handle case where back gap should not be displayed
      if (
        selectedItem >= totalPages - pagePadding - 2 &&
        pageIndex >= totalPages - pagePadding * 2 - 4
      ) {
        pages.push(createPage(pageIndex));
        continue;
      }

      // Render Gap and determine next starting pageIndex
      if (pageIndex < selectedItem) {
        pages.push(
          <OverrideGap key={`gap-${pageIndex}`} {...overrideGapProps}>
            ...
          </OverrideGap>
        );

        if (selectedItem >= totalPages - pagePadding - 2) {
          pageIndex = totalPages - pagePadding * 2 - 3;
        } else {
          pageIndex = selectedItem - pagePadding - 1;
        }
      } else {
        pages.push(
          <OverrideGap key={`gap-${pageIndex}`} {...overrideGapProps}>
            ...
          </OverrideGap>
        );
        pageIndex = totalPages - 1;
      }
    }

    return pages;
  };

  const renderPrevPage = () => {
    const sharedProps = { ref: previousPageRef, key: 'previous-page' };

    if (isPrevHidden) {
      return <StyledPreviousPage {...sharedProps} hidden />;
    }

    return (
      <OverridePreviousPage
        {...getPreviousPageProps({
          ...overridePreviousPageProps,
          ...sharedProps,
          current: selectedItem === 'prev',
          focused: focusedItem === 'prev',
          item: 'prev',
          focusRef: previousPageRef
        })}
      />
    );
  };

  const renderNextPage = () => {
    const sharedProps = { ref: nextPageRef, key: 'next-page' };

    if (isNextHidden) {
      return <StyledNextPage {...sharedProps} hidden />;
    }

    return (
      <OverrideNextPage
        {...getNextPageProps({
          ...overrideNextPageProps,
          current: selectedItem === 'next',
          focused: focusedItem === 'next',
          item: 'next',
          focusRef: nextPageRef,
          ...sharedProps
        })}
      />
    );
  };

  return (
    <OverridePagination {...getContainerProps(overridePaginationProps)}>
      {renderPrevPage()}
      {renderPages()}
      {renderNextPage()}
    </OverridePagination>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  pagePadding: PropTypes.number,
  onChange: PropTypes.func,
  overrides: PropTypes.object
};

export default Pagination;
