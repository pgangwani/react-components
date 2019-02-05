/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React, { useRef } from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/react/demo';
import README from '../README.md';

import {
  usePagination,
  StyledPagination,
  StyledPreviousPage,
  StyledNextPage,
  StyledPage,
  StyledGap
} from './index';

storiesOf('Pagination / Examples', module)
  .add('Default usage', () => <Button>Hello Button</Button>)
  .add('Custom Example 1', () => <Button>Hello Button</Button>)
  .add('Custom Example 2', () => <Button>Hello Button</Button>);

storiesOf('Pagination / Hooks', module).add('usePagination()', () => {
  const HookExample = () => {
    const prevPageRef = useRef();
    const nextPageRef = useRef();
    const page1Ref = useRef();
    const page2Ref = useRef();
    const page3Ref = useRef();

    const {
      selectedIndex,
      focusedIndex,
      getContainerProps,
      getPageProps,
      getPreviousPageProps,
      getNextPageProps
    } = usePagination({ refs: [prevPageRef, page1Ref, page2Ref, page3Ref, nextPageRef] });

    return (
      <StyledPagination {...getContainerProps()}>
        <StyledPreviousPage
          {...getPreviousPageProps({
            ref: prevPageRef,
            current: selectedIndex === 0,
            focused: focusedIndex === 0
          })}
        >
          {'<'}
        </StyledPreviousPage>
        <StyledPage
          {...getPageProps({
            ref: page1Ref,
            page: '1',
            current: selectedIndex === 1,
            focused: focusedIndex === 1
          })}
        >
          1
        </StyledPage>
        <StyledPage
          {...getPageProps({
            ref: page2Ref,
            page: '2',
            current: selectedIndex === 2,
            focused: focusedIndex === 2
          })}
        >
          2
        </StyledPage>
        <StyledPage
          {...getPageProps({
            ref: page3Ref,
            page: '3',
            current: selectedIndex === 3,
            focused: focusedIndex === 3
          })}
        >
          3
        </StyledPage>
        <StyledNextPage
          {...getNextPageProps({
            ref: nextPageRef,
            current: selectedIndex === 4,
            focused: focusedIndex === 4
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
