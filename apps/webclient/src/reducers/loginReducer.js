import Immutable from 'immutable';
const {
    TOGGLE_SNACKBAR,
    LOGIN_CREDENTIAL_CHANGE,
    LOGIN_CREDENTIAL_TYPE_EMAIL,
    LOGIN_CREDENTIAL_TYPE_PASSWORD,
    LOGIN_VALIDATION_ERROR,
    CLEAR_LOGIN_ERROR_IF_EXISTS,
    LOGIN_BY_EMAIL_PENDING,
    LOGIN_BY_EMAIL_REJECTED,
    LOGIN_BY_EMAIL_FULFILLED,
 } = require('../actions/login_actions');
const {
    INVALID_EMAIL_ERROR,
    PASSWORDS_DONT_MATCH_ERROR,
} = require('../actions/generic_errors');
const { SIGNUP_BY_EMAIL_FULFILLED } = require('../actions/signup_actions');

module.exports = function loginReducer(state = Immutable.fromJS({}), action) {
    switch (action.type) {
        case LOGIN_BY_EMAIL_PENDING: {
            return state.set('requestPending', true);
        }
        case LOGIN_BY_EMAIL_REJECTED: {
            const responseObject = JSON.parse(action.payload.statusText);
            let immutState = state.set('requestPending', false);
            if (responseObject && responseObject.message) {
                return immutState
                        .setIn([ 'loginErrors', 'emailErrorText' ], responseObject.message);
            } else {
                return immutState;
            }
        }
        case LOGIN_BY_EMAIL_FULFILLED: {
            return state
                    .set('requestPending', false)
                    .delete('loginErrors')
                    .delete('loginCreds');
        }
        case SIGNUP_BY_EMAIL_FULFILLED: {
            return state
                    .updateIn([ 'snackbar', 'open' ], (prevValue) => !prevValue )
                    .setIn([ 'snackbar', 'message' ], "Account creation successful");
        }
        case TOGGLE_SNACKBAR: {
            return state
                    .updateIn([ 'snackbar', 'open' ], prevValue => !prevValue);
        }
        case LOGIN_CREDENTIAL_CHANGE: {
            const credType = action.payload.type;
            if (credType === LOGIN_CREDENTIAL_TYPE_EMAIL) {
                return state
                        .setIn([ 'loginCreds', 'email' ], action.payload.newValue);
            } else if (credType === LOGIN_CREDENTIAL_TYPE_PASSWORD) {
                return state
                        .setIn([ 'loginCreds', 'password' ], action.payload.newValue);
            } else {
                console.log("Unmatched type");
                return state;
            }
        }
        case LOGIN_VALIDATION_ERROR: {
            if (action.payload === INVALID_EMAIL_ERROR) {
                return state
                        .setIn([ 'loginErrors', 'emailErrorText' ], "Invalid Email Format");
            } else {
                console.log("Unmatched error");
                return state;
            }
        }
        case CLEAR_LOGIN_ERROR_IF_EXISTS: {
            if (action.payload === INVALID_EMAIL_ERROR) {
                return state
                        .deleteIn([ 'loginErrors', 'emailErrorText' ]);
            } else {
                console.log("Unmatched error");
                return state;
            }
        }
        default:
            return state;
    }
};
