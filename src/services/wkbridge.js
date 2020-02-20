import { defaultErrorHandler } from "openstack-uicore-foundation/lib/methods";

class DeferredPromise {
  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    this.then = this._promise.then.bind(this._promise);
    this.catch = this._promise.catch.bind(this._promise);
    this[Symbol.toStringTag] = 'Promise';
  }
}

let execId = -1;
let execCallbacks = [];

export const exec = (
    execActionCreator,
    resultActionCreator,
    command,
    errorHandler = defaultErrorHandler,
    execActionPayload = {}
) => (params = {}) => async(dispatch, state) => {

    if (execActionCreator && typeof execActionCreator === 'function')
        dispatch(execActionCreator(execActionPayload));

    execId++;
    const deferred = new DeferredPromise();
    execCallbacks[execId] = { deferred: deferred };

    window.webkit.messageHandlers.execute.postMessage({execId: execId, command: command})

    try {
        const res = await deferred;
        let json = { data: res };
        /*if (typeof resultActionCreator === 'function') {
            dispatch(resultActionCreator({response: json}));
            return resolve({response: json});
        }
        dispatch(resultActionCreator);*/

        return Promise.resolve({response: json});

    } catch(err) {
        let res = {}
        if (errorHandler) {
            errorHandler(err, res)(dispatch, state);
        }
        return Promise.reject({ err, res, dispatch, state });
    }
};

export const callback = (opts) => {
    if (opts.status == "success") {
        execCallbacks[opts.execId].deferred.resolve(opts.args);
    } else {
        execCallbacks[opts.execId].deferred.reject(opts.args);
    }
}

window.callback = callback