/* eslint-disable no-multi-str */
const i18nEnUS = {
    translation: {
        'common': {
            'ok': 'OK',
            'yes': 'Yes',
            'no': 'No',
            'next': 'Next',
            'prev': 'Previous',
            'submit': 'Submit',
            'cancel': 'Cancel',
            'close': 'Close',
            'delete': 'Delete',
            'username': 'Username',
            'password': 'Password',
            'pwcheck': 'Password Check',
            'serverurl': 'Server URL',
            'email': 'Email Address',
            'ver_code': 'Verification code',
            'dspname': 'Display name(nickname, real name, etc...)',
            'configure': 'Configure',
            'enckey': 'Encryption key',
            'enckey_check': 'Encryption key check',
            'acc_name': 'Website/Service Name',
            'url': 'URL',
            'info': 'Information',
            'otpkey': 'OTP Key'
        },
        'menu': {
            'accounts': 'My Accounts',
            'settings': 'Settings',
            'about': 'About',
            'logout': 'Logout',
        },
        'login': {
            'login': 'Log In',
            'signup': 'Sign Up',
            'signup_done': 'Almost Done!',
            'signup_done_msg': 'We just sent an email that includes email verification code.\n \
                          To use your account, verify your email with the code on your first login.',
            'forgot': 'Forgot password',
            'recover': 'Password recivery',
            'recover_init': 'Did you received a verification code for recovering your password via email?',
            'recover_request': 'Submit email address of your authbook account to get a verification code.',
            'recover_requested': 'Now, check your inbox and prepare your verification code.\n \
                            Couldn\'t received? You can move to previous step and request again.\n \
                            Click \'Next\' if you are ready.',
            'recover_verify': 'Use the verification code you received to recover password.',
            'recover_verified': 'Done! You can now use your new password.',
            'new_pw': 'New password',
            'new_pw_chk': 'Confirm new password',
            'server_config': 'Configure server',
            'server_config_desc': 'Type the url of Authbook server instance. It must be HTTPS.',
        },
        'home': {
            'decrypt_desc': 'Type your encryption key to decrypt your accounts.',
            'decrypt': 'Decrypt',
            'add': 'Add account',
            'enc_done': 'Encryption key has been configured.',
            'added': 'New account has been added.',
            'updated': 'Account updated',
            'deleted': 'Account deleted',
            'copied': 'Copied!',
            'addnew': 'Add new account',
            'acc_details': 'Account details',
            'acc_edit': 'Edit account',
            'acc_edit_otpkey_desc': 'Leave this field empty to current otp key.',
            'conf_enckey': 'Configure your encryption key',
            'conf_enckey_desc': 'Encryption key will be used to encrypt your account OTP data.\n \
                            Please note that if you forgot your encryption key, you can\'t recover it.'
        },
        'email': {
            'title': 'Update/Verify Email',
            'init': 'Did you received a verification code for verifying your email address?',
            'request': 'Submit the new email address that will replace the current one.',
            'requested': 'Now, check your inbox and prepare your verification code.\n \
                            Couldn\'t received? You can move to previous step and request again.\n \
                            Click "Next" if you are ready.',
            'verify': 'Use the verification code you received to verify your email address.',
            'done': 'Done! Your email is now updated and verified.',
            'new': 'New email address'
        },
        'settings': {
            'acc_info': 'Account information',
            'acc_settings': 'Account settings',
            'change_email': 'Change Email Address',
            'change_email_desc': 'Click to change your email address',
            'change_pw': 'Change password',
            'change_pw_desc': 'Change the password of your account',
            'change_enckey': 'Change Encryption Key',
            'change_enckey_desc': 'Change the key that encryptes OTP data.',
            'close_acc': 'Close my account',
            'close_acc_desc': 'Delete your data and account from the server.'

        }
    },
};
export default i18nEnUS;
