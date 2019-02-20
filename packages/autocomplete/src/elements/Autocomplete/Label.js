/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import React from 'react';
import { Label } from '@zendeskgarden/react-textfields';

import { useDownshiftContext } from './utils';

/**
 * Label for use within the Autocomplete component
 */
export default function AutocompleteLabel(props) {
  const { getLabelProps, setIsHovered } = useDownshiftContext('Label');

  return (
    <Label
      {...getLabelProps({
        ...props,
        onMouseEnter: () => {
          setIsHovered(true);
        },
        onMouseLeave: () => {
          setIsHovered(false);
        }
      })}
    />
  );
}
