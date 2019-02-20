/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

import { useContext } from 'react';
import { AutocompleteContext } from './Autocomplete';
import { MenuContext } from './Menu';

/**
 * utility to ensure all static elements are used within a parent Autocomplete
 */
export function useDownshiftContext(componentName) {
  const downshift = useContext(AutocompleteContext);

  if (!downshift) {
    throw new Error(`"${componentName}" can only be rendered within the "Autocomplete" component`);
  }

  return downshift;
}

/**
 * utility to ensure all static elements are used within a parent Autocomplete.Menu component
 */
export function useMenuContext(componentName) {
  const menu = useContext(MenuContext);

  if (!menu) {
    throw new Error(
      `"${componentName}" can only be rendered within the "Autocomplete.Menu" component`
    );
  }

  return menu;
}
