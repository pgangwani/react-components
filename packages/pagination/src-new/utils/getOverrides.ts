/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

/* eslint-disable require-jsdoc */

import { isStyledComponent } from 'styled-components';

function getOverride(override: any) {
  if (override && typeof override === 'object') {
    return override.render;
  }

  return undefined;
}

function getOverrideProps(override: any) {
  if (override && typeof override === 'object') {
    return override.props || {};
  }

  return {};
}

export default function getOverrides<T>(override: any, defaultComponent: T) {
  const component: typeof defaultComponent = getOverride(override) || defaultComponent;
  const props = getOverrideProps(override);

  if (override && override.css && isStyledComponent(defaultComponent)) {
    props._internalOverrideStyling = override.css;
  }

  return [component, props];
}
