React Redux Connect Context
===========================
Enhanced version of redux' connect, that puts all action creators into the child context of the component.

Example
-------

```js
import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';

import connectContext from 'react-redux-connect-context';

function click() {
  return {
    type: 'CLICK',
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({click}, dispatch);
}

@connectContext(mapStateToProps, mapDispatchToProps)
class Parent extends Component {
  render() {
    return <Child />;
  }
}

class Child extends Component {
  contextTypes: {
    click: PropTypes.func,
  }

  render() {
    <button onClick={this.context.click}/>
  }
}
```
