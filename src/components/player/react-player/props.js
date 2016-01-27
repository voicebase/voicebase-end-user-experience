import { PropTypes } from 'react'
import {
  propTypes as _propTypes,
  defaultProps as _defaultProps
} from 'react-player/lib/props'

export const propTypes = {
  ..._propTypes,
  activePlayer: PropTypes.string
};

export const defaultProps = {
  ..._defaultProps,
  activePlayer: 'JwPlayer' // or 'FilePlayer'
};
