import PropTypes from 'prop-types';
import styled from 'styled-components';
import classNames from 'classnames';
import CalloutStyles from '@zendesk/garden-css-callouts';
import { utils } from '@zendeskgarden/react-theming';

const Close = styled.button.attrs({
  className: props => classNames(CalloutStyles['c-callout__close'], {
    [CalloutStyles['is-focused']]: props.focused,
    [CalloutStyles['is-hovered']]: props.hovered
  })
})`
  ${props => utils.retrieveTheme('callout.close', props)}
`;

Close.propTypes = {
  focused: PropTypes.bool,
  hovered: PropTypes.bool
};

/** @component */
export default Close;

