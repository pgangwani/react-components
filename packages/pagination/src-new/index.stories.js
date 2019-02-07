/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useState, useRef } from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number, boolean } from '@storybook/addon-knobs';
import README from '../README.md';

import {
  Pagination,
  usePagination,
  useSelection,
  StyledPagination,
  StyledPreviousPage,
  StyledNextPage,
  StyledPage,
  StyledGap
} from './index';

storiesOf('Pagination / Examples', module)
  .addDecorator(withKnobs)
  .add('Default usage', () => {
    const DefaultPaginationExample = () => {
      const [currentPage, setCurrentPage] = useState(1);

      const CustomGap = () => {
        return (
          <span role="img" aria-label="It's a hook!" style={{ marginLeft: 8, marginRight: 8 }}>
            🎣
          </span>
        );
      };

      const overrides = {};

      if (boolean('Show Pagination Override', false)) {
        overrides.Pagination = {
          css: `border: ${currentPage > 5 ? 'red' : 'blue'} 4px solid`
        };
      }

      if (boolean('Show Custom Render Override', false)) {
        overrides.Gap = {
          render: CustomGap
        };
      }

      return (
        <Pagination
          currentPage={currentPage}
          onChange={setCurrentPage}
          totalPages={number('totalPages', 25)}
          pagePadding={number('pagePadding', 2)}
          overrides={overrides}
        />
      );
    };

    return <DefaultPaginationExample />;
  });

storiesOf('Pagination / Hooks', module)
  .add('useSelection()', () => {
    const SelectionHookExample = () => {
      const refs = [useRef(), useRef(), useRef()];

      const [controlledSelectedItem, setControlledSelectedItem] = useState(1);
      const [controlledFocusedItem, setControlledFocusedItem] = useState(1);

      const { selectedItem, getContainerProps, getItemProps } = useSelection({
        selectedItem: controlledSelectedItem,
        focusedItem: controlledFocusedItem,
        onFocus: setControlledFocusedItem,
        onSelect: setControlledSelectedItem,
        direction: 'vertical'
      });

      const isSelected = index => index === selectedItem;

      return (
        <ul {...getContainerProps()}>
          {refs.map((ref, index) => (
            <li {...getItemProps({ item: index, ref, focusRef: ref })}>
              Item {index} {isSelected(index) && ' - Selected'}
            </li>
          ))}
        </ul>
      );
    };

    return <SelectionHookExample />;
  })
  .add('usePagination()', () => {
    const HookExample = () => {
      const [controlledSelectedItem, setControlledSelectedItem] = useState();
      const [controlledFocusedItem, setControlledFocusedItem] = useState();
      const prevPageRef = useRef();
      const nextPageRef = useRef();
      const page1Ref = useRef();
      const page2Ref = useRef();
      const page3Ref = useRef();

      const {
        selectedItem,
        focusedItem,
        getContainerProps,
        getPageProps,
        getPreviousPageProps,
        getNextPageProps
      } = usePagination({
        selectedItem: controlledSelectedItem,
        focusedItem: controlledFocusedItem,
        onSelect: item => setControlledSelectedItem(item),
        onFocus: item => setControlledFocusedItem(item)
      });

      return (
        <StyledPagination {...getContainerProps()}>
          <StyledPreviousPage
            {...getPreviousPageProps({
              ref: prevPageRef,
              focusRef: prevPageRef,
              item: 'prev',
              current: selectedItem === 'prev',
              focused: focusedItem === 'prev'
            })}
          >
            {'<'}
          </StyledPreviousPage>
          <StyledPage
            {...getPageProps({
              ref: page1Ref,
              focusRef: page1Ref,
              page: '1',
              item: '1',
              current: selectedItem === '1',
              focused: focusedItem === '1'
            })}
          >
            1
          </StyledPage>
          <StyledPage
            {...getPageProps({
              ref: page2Ref,
              focusRef: page2Ref,
              page: '2',
              item: '2',
              current: selectedItem === '2',
              focused: focusedItem === '2'
            })}
          >
            2
          </StyledPage>
          <StyledPage
            {...getPageProps({
              ref: page3Ref,
              focusRef: page3Ref,
              page: '3',
              item: '3',
              current: selectedItem === '3',
              focused: focusedItem === '3'
            })}
          >
            3
          </StyledPage>
          <StyledNextPage
            {...getNextPageProps({
              ref: nextPageRef,
              focusRef: nextPageRef,
              item: 'next',
              current: selectedItem === 'next',
              focused: focusedItem === 'next'
            })}
          >
            {'>'}
          </StyledNextPage>
        </StyledPagination>
      );
    };

    return <HookExample />;
  });

storiesOf('Pagination / Styled Elements', module)
  .addParameters({
    info: {
      text: README
    }
  })
  .add(
    'default usages',
    () => (
      <StyledPagination>
        <StyledPreviousPage>{'<'}</StyledPreviousPage>
        <StyledPage>1</StyledPage>
        <StyledGap>...</StyledGap>
        <StyledPage>12</StyledPage>
        <StyledPage>13</StyledPage>
        <StyledPage>14</StyledPage>
        <StyledPage current>15</StyledPage>
        <StyledPage focused>16</StyledPage>
        <StyledPage>17</StyledPage>
        <StyledPage>18</StyledPage>
        <StyledGap>...</StyledGap>
        <StyledPage>25</StyledPage>
        <StyledNextPage>{'>'}</StyledNextPage>
      </StyledPagination>
    ),
    {
      info: 'test'
    }
  );
