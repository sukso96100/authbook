const initialState = {
    userinfo: {
        displayName: "", username: "",
        email: "", encryptionKeySet: false,
        isEmailVerified: false
    }
};

export default function authbookApp(state = initialState, action) {
  switch (action.type) {
      case 'SET_USERINFO':
          return Object.assign({}, state, {
              userinfo: action.userinfo
          });
      default:
          return state;
  }
}