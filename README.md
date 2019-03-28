# Authbook

![App Preview](login.png)
![App Preview](accounts.png)
![App Preview](settings.png)
Authbook is a self-hosted OTP Web app software.  
The backend is built with Kotlin, Ktor and Exposed framework and the frontend is built with Javascipt, React and MDC(Material Design Components)

This project is in development stage and it isn't fullly functional yet.

[See demo here](https://authbook.youngbin.xyz)

## To Do
- [x] Signup(with email verification)
- [x] Password recovery
- [x] Login
- [x] Add/Remove OTP Seed
- [x] Show list of OTP Seeds
- [x] Edit OTP Seed
- [ ] Store Seed data offline
- [ ] Localization
- [ ] Deploy manual

## Deploy

### Frontend

Start test server
```bash
cd frontend
npm install
npm start
```

Generate production build
```bash
cd frontend
npm install
npm build
```

### Backend
- Prepare Java and Mysql server instance
- Edit `backend/resources/application.conf` or setup environment variables(see `application.conf` for required environment variables)

Run server instantly
```
./gradlew :run
```

Build docker image(See [here](https://github.com/GoogleContainerTools/jib/tree/master/jib-gradle-plugin) for more detailed guides)
```
./gradlew jib
```
 
## Author
Youngbin Han(sukso96100@gmail.com)
