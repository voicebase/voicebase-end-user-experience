import { createAction } from 'redux-actions'
import configureMockStore from 'redux-mock-store';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';

export const checkActionTypes = function (actions, actionName, actionType) {
  checkIsFunction(actions, actionName);
  checkType(actions, actionType, actionName);
};

export const checkIsFunction = function (actions, actionName) {
  it(`Should be exported ${actionName} action as a function.`, function () {
    expect(actions[actionName]).to.be.a('function')
  });
};

export const checkType = function (actions, actionType, actionName) {
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

export const checkApiAction = function (actions, actionName, actionType, params, isError, done) {
  let xhr = sinon.useFakeXMLHttpRequest();
  var requests = [];

  xhr.onCreate = function (xhr) {
    requests.push(xhr);
  };

  const middlewares = [thunk, promiseMiddleware()];
  const mockStore = configureMockStore(middlewares);

  // create actions callback
  const pendingAction = (incomingAction) => {
    setTimeout(() => {
      expect(incomingAction.type).to.equal(actionType + '_PENDING');
      requests[0].respond((isError) ? 500 : 200);
    }, 0);
  };
  const successAction = (incomingAction) => {
    let type = (isError) ? '_REJECTED' : '_FULFILLED';
    expect(incomingAction.type).to.equal(actionType + type);
  };

  // create mock store
  const store = mockStore(undefined, [pendingAction, successAction], done);
  // call action;
  store.dispatch(actions[actionName].apply(this, params));
};

export const checkAsyncAction = function (actions, actionName, actionType, params, done) {
  const middlewares = [thunk, promiseMiddleware()];
  const mockStore = configureMockStore(middlewares);

  // create actions callback
  const pendingAction = (incomingAction) => {
    expect(incomingAction.type).to.equal(actionType + '_PENDING');
  };
  const successAction = (incomingAction) => {
    expect(incomingAction.type).to.equal(actionType + '_FULFILLED');
  };

  // create mock store
  const store = mockStore(undefined, [pendingAction, successAction], done);
  // call action;
  store.dispatch(actions[actionName].apply(this, params));
};
