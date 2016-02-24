import { createAction } from 'redux-actions'

export const checkActionTypes = function (actions, actionName, actionType) {
  it(`Should be exported ${actionName} action as a function.`, function () {
    expect(actions[actionName]).to.be.a('function')
  });

  it(`Should return an action with type "${actionType}"`, function () {
    expect(actions[actionName]()).to.have.property('type', actionType)
  });
};

export const checkCreatingAction = function (actions, actionName, actionType, props) {
  it(`Should create an action to ${actionName}`, () => {
    let expectedAction = createAction(actionType, {});
    expect(actions[actionName].apply(this, props)).to.deep.equal(expectedAction.apply(this, props))
  });
};
