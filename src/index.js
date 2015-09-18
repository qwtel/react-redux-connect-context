import {PropTypes} from 'react';
import {connect} from 'react-redux';

function noop() {}

// Calling `mapDispatchToProps` with a dummy disptach function in order to get the keys out.
// Hopefully your implementation doesn't have side effects.
function getChildContextTypes(mapDispatchToProps) {
  const childContextTypes = {};

  Object.keys(mapDispatchToProps(noop))
    .forEach(key => {
      // TODO: allow objectOf(func)
      childContextTypes[key] = PropTypes.func;
    });

  return childContextTypes;
}

// Put the all action creators in props (like a the `connect` function does),
// but also "save" them in an `actionCreators` object.
function wrapDispatchToProps(mapDispatchToProps) {
  return dispatch => {
    const actionCreators = mapDispatchToProps(dispatch);
    return {
      actionCreators,
      ...actionCreators,
    };
  };
}

function overwriteChildContextTypes(component, childContextTypes) {
  Object.assign(component.childContextTypes, childContextTypes);
}

// Get the original child context and assign all the `actionCreators` we "saved" in `props` on to it.
function overwriteGetChildContext(component) {
  const originalGetChildContext = component.prototype.getChildContext;

  // using `function` so that `this` points to the actual instance of the component.
  component.prototype.getChildContext = function getChildContext() {
    return Object.assign(originalGetChildContext.call(this), this.props.actionCreators);
  };
}

/**
 * Enhanced version of redux' connect, that puts all action creators
 * into the child context of the component.
 *
 * @param mapStateToProps {Function}
 * @param mapDispatchToProps {Function} Must be free of side effects!
 * @returns {Function}
 */
export default function connectContext(mapStateToProps, mapDispatchToProps) {
  const childContextTypes = getChildContextTypes(mapDispatchToProps);
  const wrappedMapDispatchToProps = wrapDispatchToProps(mapDispatchToProps);

  return component => {
    overwriteChildContextTypes(component, childContextTypes);
    overwriteGetChildContext(component);
    return connect(mapStateToProps, wrappedMapDispatchToProps)(component);
  };
}
