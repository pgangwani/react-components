import { configure, addDecorator } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withInfo } from '@storybook/addon-info';
import centered from '@storybook/addon-centered';

// automatically import all files ending in *.stories.js
const req = require.context('../packages/pagination/src-new', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

addDecorator(
  withOptions({
    name: 'Zendesk Garden',
    url: 'https://github.com/zendeskgarden/react-components'
  })
);
addDecorator(centered);
addDecorator(withInfo());

configure(loadStories, module);
