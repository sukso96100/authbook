import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en-US",
        debug: true,
        detection: {
            order: ['navigator']
        },
        resources: {
            "en-US": {
                translation: {
                    "common": {
                        "ok": "OK",
                        "yes" : "Yes",
                        "no" : "No",
                        "next" : "Next",
                        "prev" : "Previous",
                        "submit" : "Submit",
                        "username" : "Username",
                        "password" : "Password",
                        "pwcheck" : "Password Check",
                        "serverurl" : "Server URL",
                        "email" : "Email Address",
                        "ver_code" : "Verification code",
                        "dspname" : "Display name(nickname, real name, etc...)",
                        "configure" : "Configure"
                    },
                    "menu": {
                        "accounts" : "My Accounts",
                        "settings" : "Settings",
                        "about" : "About",
                        "logout" : "Logout"
                    },
                    "login": {
                        "login" : "Log In",
                        "signup" : "Sign Up",
                        "signup_done": "Almost Done!",
                        "signup_done_msg": "We just sent an email that includes email verification code.\n \
                            To use your account, verify your email with the code on your first login.",
                        "forgot": "Forgot password",
                        "recover" : "Password recivery",
                        "recover_init" : "Did you received a verification code for recovering your password via email?",
                        "recover_request" : "Submit email address of your authbook account to get a verification code.",
                        "recover_requested" : "Now, check your inbox and prepare your verification code.\n \
                            Couldn't received? You can move to previous step and request again.\n \
                            Click 'Next' if you are ready.",
                        "recover_verify" : "Use the verification code you received to recover password.",
                        "recover_verified" : "Done! You can now use your new password.",
                        "new_pw" : "New password",
                        "new_pw_chk" : "Confirm new password",
                        "server_config" : "Configure server",
                        "server_config_desc" : "Type the url of Authbook server instance. It must be HTTPS."
                    }
                }
            },

            "ko-KR": {
                translation: {
                    "common": {
                        "ok": "확인",
                        "yes" : "예",
                        "no" : "아니오",
                        "next" : "다음",
                        "prev" : "이전",
                        "submit" : "제출",
                        "username" : "사용자 이름",
                        "password" : "암호",
                        "pwcheck" : "암호 확인",
                        "serverurl" : "서버 URL",
                        "email" : "이메일 주소",
                        "ver_code" : "인증 코드",
                        "dspname" : "표시 이름(별명, 실명 등)",
                        "configure" : "구성"
                    },
                    "menu": {
                        "accounts" : "내 계정",
                        "settings" : "설정",
                        "about" : "정보",
                        "logout" : "로그아웃"
                    },
                    "login": {
                        "login" : "로그인",
                        "signup" : "회원 가입",
                        "signup_done": "거의 다 되었습니다!",
                        "signup_done_msg": "입력하신 메일주소로 인증 코드가 포함된 메일을 보내드렸습니다.\n \
                        첫 로그인 후 인증 코드로 인증 후 이용하시기 바랍니다.",
                        "forgot": "암호 분실",
                        "recover" : "암호 복구",
                        "recover_init" : "암호 복구를 위한 인증코드를 메일로 받으셨습니까?",
                        "recover_request" : "인증 코드를 얻기 위해 Authbook 계정의 이메일 주소를 입력하세요.",
                        "recover_requested" : "메일함을 확인하여 인증코드를 준비하세요.\n \
                            아직 받지 못했다면, 이전 단계에서 다시 요청하세요.\n \
                            준비가 되었다면, '다음'을 눌러서 계속하세요",
                        "recover_verify" : "앞서 받은 인증코드로 암호를 복구하세요.",
                        "recover_verified" : "이제 새 암호로 로그인 가능합니다.",
                        "new_pw" : "새 암호",
                        "new_pw_chk" : "새 암호 확인",
                        "server_config" : "서버 구성",
                        "server_config_desc" : "Authbook 서버 인스턴스의 서버 URL을 입력하세요. 꼭 HTTPS여야 합니다."
                }
            },

            interpolation: {
                escapeValue: false
            }
        }
    }
    });

export default i18n; 