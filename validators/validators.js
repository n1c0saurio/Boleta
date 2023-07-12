// Related to Users...

// Regular expression for validate password requirements.
exports.validPassword =
  '^' +
  `(?=.*[a-zç])` + // contains at least one lowercase letter
  `(?=.*[A-ZÇ])` + // contains at least one uppercase letter
  `(?=.*\d)` + // contains at least one number
  `(?=.*[¡!¿?'"@#$€%^&*()_[\]{},.·;:~<>|/\\+=-])` + // contains special character
  `[A-Za-zçÇ\d¡!¿?'"@#$€%^&*()_[\]{},.·;:~<>|/\\+=-]{8,}` + // min 8 character
  '$';

// Related to Logs...

// List of actions that can be recorded in a log
exports.actions = {
    signUp: {
      key: 'signUp',
      name: 'Registro'
    },
    loggin: {
      key: 'loggin',
      name: 'Inicio de sesión'
    },
    logout: {
      key: 'logout',
      name: 'Cierre de sesión'
    },
    failedLoggin: {
      key: 'failedLoggin',
      name: 'Acceso fallido'
    },
    failedSignUp: {
      key: 'failedSignUp',
      name: 'Registro fallido'
    },
    userBlocked: {
      key: 'userBlocked',
      name: 'Usuario bloqueado'
    },
    userUnblocked: {
      key: 'userUnblocked',
      name: 'Usuario desbloqueado'
    },
    roleUpdated: {
      key: 'roleUpdated',
      name: 'Rol actualizado'
    },
    accountDeleted: {
      key: 'accountDeleted',
      name: 'Cuenta eliminada'
    },
    error404: {
      key: 'error404',
      name: 'Error 404'
    }
  };
  