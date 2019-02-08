/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import useSelection, { IUseSelectionOptions } from './useSelection';

export interface IGetPageProps {
  page?: number;
  current?: boolean;
}

/**
 * A React Hook used to create accessible widgets with the Pagination Interaction Pattern
 *
 * https://www.w3.org/TR/wai-aria-practices/#Listbox
 */
export default function usePagination(options: IUseSelectionOptions) {
  const {
    selectedItem,
    focusedItem,
    getContainerProps: getControlledContainerProps,
    getItemProps
  } = useSelection(options);

  const getContainerProps = (props = {}) => {
    return {
      'aria-label': 'Pagination navigation',
      ...props
    };
  };

  const getPreviousPageProps = (props = {}) => {
    return {
      'aria-label': 'Previous Page',
      ...props
    };
  };

  const getNextPageProps = (props = {}) => {
    return {
      'aria-label': 'Next Page',
      ...props
    };
  };

  const getPageProps = ({ page, current, ...other }: IGetPageProps = {}) => {
    let ariaLabel = `Page ${page}`;

    if (current) {
      ariaLabel = `Current page, Page ${page}`;
    }

    return {
      'aria-label': ariaLabel,
      current,
      ...other
    };
  };

  return {
    selectedItem,
    focusedItem,
    getContainerProps: (props: any) => getControlledContainerProps(getContainerProps(props)),
    getPageProps: (props: any) => getItemProps(getPageProps(props)),
    getPreviousPageProps: (props: any) => getItemProps(getPreviousPageProps(props)),
    getNextPageProps: (props: any) => getItemProps(getNextPageProps(props))
  };
}
