export default (actionToReducerMap) => {
  return function switchAction(state, action = {}) {
    const reducer = actionToReducerMap[action.type];
    return reducer ? this::reducer(state, action.payload || {}) : state;
  };
};
