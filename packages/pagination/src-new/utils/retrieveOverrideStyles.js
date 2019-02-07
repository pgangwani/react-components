/**
 * Copyright Zendesk, Inc.
 *
 * Use of this source code is governed under the Apache License, Version 2.0
 * found at http://www.apache.org/licenses/LICENSE-2.0.
 */

// eslint-disable-next-line require-jsdoc
export default function retrieveOverrideStyles(props) {
  if (props._internalOverrideStyling) {
    return props._internalOverrideStyling;
  }

  return '';
}
