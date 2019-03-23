package xyz.youngbin.authbook

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.html.*
import io.ktor.routing.*
import kotlinx.html.*
import io.ktor.request.*
import io.ktor.response.*
import io.ktor.sessions.*
import io.ktor.util.*
import io.ktor.http.*
import io.ktor.gson.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.joda.time.*
import org.mindrot.jbcrypt.BCrypt
import org.joda.time.*

fun Route.auth(){
    route("/auth"){
        
        // Sign Up Function
        post("/signup"){
            val params = call.receive<SignUpForm>()
            val username = params.username ?: return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(0, "username is empty"))
            val email = params.email ?: return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(1, "email is empty"))
            val displayName = params.displayName ?: return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(2, "display name is empty"))
            val password = params.password ?: return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(3, "password is empty"))
            val passwordCheck = params.passwordCheck ?: return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(4, "password check is empty"))
            
            when {
                // Validate sign up form
                password.length < 8 -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(5, "Password must be at least 8 digits"))
                password != passwordCheck -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(6, "You have to type same value for password and password check."))
                username.length < 4 -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(7, "Username must be longer then 4 letters"))
                displayName.length < 3 -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(8, "Display name must be longer then 3 letters"))
                !emailRegex.matches(email) -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(9, "Email address is not valid."))
                DbQueries.findByUsername(username) != null -> return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(10, "Username ${username} is already in use"))
                DbQueries.findByEmail(email) != null -> return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(11, "Email ${email} is already in use"))
                else -> {
                    // Sign up form validated! create new user with the form data
                    val passwordHash = BCrypt.hashpw(password, BCrypt.gensalt())
                    val newUser = DbQueries.signUp(username, email, displayName, passwordHash)
                    val code = genVerificationCode()
                    val now = DateTime()


                    // Send verification code via email
                    val result = Mailer.sendVerification(newUser, email, VerificationTypes.Email, code, now.toString())
                    
                    if(result){
                        // Store verification information
                        DbQueries.genVerification(newUser, VerificationTypes.Email, BCrypt.hashpw(code, BCrypt.gensalt()), now, email)
                    }
                    
                    // Set Session
                    call.sessions.set(AuthbookSession(
                        newUser.id.value,
                        newUser.username, 
                        call.request.origin.remoteHost, 
                        DateTime().toString()))
                    
                    // Respond to the client
                    call.respondText("Signed Up! You can now log in with the new account. Please verify your email when loggin in.")
                }
            }
        }
        
        post("/login"){
            val params = call.receive<LoginForm>()
            val username = params.username ?: return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(0, "username is empty"))
            val password = params.password ?: return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(1, "password is empty"))
            when {
                // Validate login up form
                username.length < 4 -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(2, "Username must be longer then 4 letters"))
                password.length < 8 -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(3, "Password must be at least 8 digits"))
                else -> {
                    val user = DbQueries.findByUsername(username) ?: return@post call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(4, "User not found"))
                    if(BCrypt.checkpw(password, user.passwordHash)){
                        // Set Session
                        call.sessions.set(AuthbookSession(
                            user.id.value,
                            user.username, 
                            call.request.origin.remoteHost, 
                            DateTime.now().toString()))
                        
                        val isEmailVerified = DbQueries.isEmailVerified(user)

                        // Respond to the client
                        call.respond(UserData(user.username, user.displayName, user.email, !user.seedKeyHash.isEmpty(), isEmailVerified))
                    }else{
                        // Respond to the client
                        call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(5, "Password dose not matches!"))
                    }
                }
            }
        }
        
        get("/logout"){
            // Clear session when logging out
            call.sessions.clear<AuthbookSession>()
        }
        
        post("/request_recover"){
            val params = call.receive<EmailSubmitForm>()
            val email = params.email ?: return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(0, "email is empty"))
            if(!emailRegex.matches(email)) return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(1, "Email address is not valid."))
            val user = DbQueries.findByEmail(email) ?: return@post call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(2, "User not found"))
            
            val code = genVerificationCode()
            val codeHash = BCrypt.hashpw(code, BCrypt.gensalt())
            val now = DateTime()

                    // Send verification code via email
            val result = Mailer.sendVerification(user, email, VerificationTypes.Password, code, now.toString())
                    
            if(result){
                        // Store verification information
                DbQueries.genVerification(user, VerificationTypes.Password, codeHash, now)
            }
            call.respondText("A verification code for password recovery has sent to your mail.")
        }

        put("/recover"){
            val params = call.receive<PasswordRecoverForm>()
            val username = params.username ?: return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(0, "username is empty"))
            val user = DbQueries.findByUsername(username) ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            val newPassword = params.newPassword ?: return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(2, "You didn't type new password"))
            val newPasswordCheck = params.newPasswordCheck ?: return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(3, "You didn't type new password check"))
            val verificationCode = params.verificationCode ?: return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(4, "You didn't type verification code"))
            
            when{
                newPassword.length < 8 -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(5, "Password must be at least 8 digits"))
                newPassword != newPasswordCheck -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(6, "You have to type same value for password and password check."))
                username.length < 4 -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(7, "Username must be longer then 4 letters"))
                else -> {
                    val result = DbQueries.verify(user, VerificationTypes.Password, verificationCode, newPassword)
                    if(result){
                        call.respondText("Your can now log in with the new password.")
                    }else{
                        call.respond(HttpStatusCode.BadRequest, ResponseWithCode(8, "Verification code dose not matches"))
                    } 
                }
            }
            
        }
        
        post("/change_email"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@post call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@post call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            val params = call.receive<EmailSubmitForm>()
            val email = params.email ?: return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(2, "email is empty"))
            if(!emailRegex.matches(email)) return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(3, "Email address is not valid."))
            
            val code = genVerificationCode()
            val codeHash = BCrypt.hashpw(code, BCrypt.gensalt())
            val now = DateTime()


            // Send verification code via email
            val result = Mailer.sendVerification(user, email, VerificationTypes.Email, code, now.toString())
                    
            if(result){
                // Store verification information
                DbQueries.genVerification(user, VerificationTypes.Email, codeHash, now, email)
            }
            call.respondText("A verification code for changing email has sent to your mail.")
        }
        
        put("/verify"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            val params = call.receive<EmailVerificationForm>()
            val verificationCode = params.verificationCode ?: return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(3, "You didn't type verification code"))
            val result = DbQueries.verify(user, VerificationTypes.Email, verificationCode)
            if(result) call.respondText("Your email is now verified.")
            else call.respond(HttpStatusCode.BadRequest, ResponseWithCode(2, "Verification code dose not matches"))
        }
        
        get("userinfo"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@get call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@get call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            val isEmailVerified = DbQueries.isEmailVerified(user)
            call.respond(UserData(user.username, user.displayName, user.email, !user.seedKeyHash.isEmpty(), isEmailVerified))
        }
    }
}