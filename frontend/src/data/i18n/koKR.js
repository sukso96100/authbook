const i18nKoKR = {
    translation: {
        'common': {
            'ok': '확인',
            'yes': '예',
            'no': '아니오',
            'next': '다음',
            'prev': '이전',
            'submit': '제출',
            'cancel': '취소',
            'close': '닫기',
            'delete': '제거',
            'username': '사용자 이름',
            'password': '암호',
            'pwcheck': '암호 확인',
            'serverurl': '서버 URL',
            'email': '이메일 주소',
            'ver_code': '인증 코드',
            'dspname': '표시 이름(별명, 실명 등)',
            'configure': '구성',
            'enckey': '암호화 키',
            'enckey_check': '암호화 키 확인',
            'acc_name': '웹사이트/서비스 이름',
            'url': 'URL',
            'info': '정보',
            'otpkey': 'OTP 키'
        },
        'menu': {
            'accounts': '내 계정',
            'settings': '설정',
            'about': '정보',
            'logout': '로그아웃',
        },
        'login': {
            'login': '로그인',
            'signup': '회원 가입',
            'signup_done': '거의 다 되었습니다!',
            'signup_done_msg': '입력하신 메일주소로 인증 코드가 포함된 메일을 보내드렸습니다.\n \
                        첫 로그인 후 인증 코드로 인증 후 이용하시기 바랍니다.',
            'forgot': '암호 분실',
            'recover': '암호 복구',
            'recover_init': '암호 복구를 위한 인증코드를 메일로 받으셨습니까?',
            'recover_request': '인증 코드를 얻기 위해 Authbook 계정의 이메일 주소를 입력하세요.',
            'recover_requested': '메일함을 확인하여 인증코드를 준비하세요.\n \
                            아직 받지 못했다면, 이전 단계에서 다시 요청하세요.\n \
                            준비가 되었다면, \'다음\'을 눌러서 계속하세요',
            'recover_verify': '앞서 받은 인증코드로 암호를 복구하세요.',
            'recover_verified': '이제 새 암호로 로그인 가능합니다.',
            'new_pw': '새 암호',
            'new_pw_chk': '새 암호 확인',
            'server_config': '서버 구성',
            'server_config_desc': 'Authbook 서버 인스턴스의 서버 URL을 입력하세요. 꼭 HTTPS여야 합니다.',
        },
        'home': {
            'decrypt_desc': '계정 정보를 복호화 하기 위해 암호화 키를 입력하세요.',
            'decrypt': '복호화',
            'add': '계정 추가',
            'enc_done': '암호화 키가 구성되었습니다.',
            'added': '새 계정이 추가되었습니다.',
            'updated': '계정이 업데이트 되었습니다.',
            'deleted': '계정이 제거되었습니다.',
            'copied': '복사되었습니다!',
            'addnew': '새 계정 추가',
            'acc_details': '계정 상세 정보',
            'acc_edit': '계정 수정',
            'acc_edit_otpkey_desc': '사용중인 OTP 키를 유지하려면 이 칸을 비워두세요.',
            'conf_enckey': '암호화 키 구성',
            'conf_enckey_desc': '암호화 키는 OTP 데이터 암호화에 사용됩니다.\n \
                            분실 하시는 경우 복구할 수 없습니다.'
        },
        'email': {
            'title': '이메일 갱신/인증',
            'init': '이메일로 이메일 주소 인증을 위한 인증코드를 받으셨나요?',
            'request': '지금 사용중인 이메일 주소를 대체할 새 이메일 주소를 입력하세요.',
            'requested': '받은 편지함을 확인하여 인증코드를 준비하세요.\n \
                            받지 못했다면, 이전 단계로 이동하여 다시 요청할 수 있습니다..\n \
                            준비가 되었다면, "다음" 버튼을 누르세요.',
            'verify': '이메일 주소를 인증하려면 앞서 받은 인증코드를 입력하세요.',
            'done': '이메일 주소가 갱신 및 인증 되었습니다.',
            'new': '새 이메일 주소'
        },
        'settings': {
            'acc_info': '계정 정보',
            'acc_settings': '계정 설정',
            'change_email': '이메일 주소 변경',
            'change_email_desc': '계정에 연결된 이메일 주소 변경',
            'change_pw': '암호 변경',
            'change_pw_desc': '계정 로그인 암호 바꾸기',
            'change_enckey': '암호화 키 변경',
            'change_enckey_desc': 'OTP 데이터 암호화에 쓸 키 변경',
            'close_acc': '회원 탈퇴',
            'close_acc_desc': '서버에서 내 계정과 데이터 모두 지우기'

        }
    },
};
export default i18nKoKR;
