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
            val username = params.username ?: return@post call.respondText("username is empty", status = HttpStatusCode.BadRequest)
            val email = params.email ?: return@post call.respondText("email is empty", status = HttpStatusCode.BadRequest)
            val displayName = params.displayName ?: return@post call.respondText("display name is empty", status = HttpStatusCode.BadRequest)
            val password = params.password ?: return@post call.respondText("password is empty", status = HttpStatusCode.BadRequest)
            val passwordCheck = params.passwordCheck ?: return@post call.respondText("password check is empty", status = HttpStatusCode.BadRequest)
            
            when {
                // Validate sign up form
                password.length < 8 -> call.respondText("Password must be at least 8 digits", status = HttpStatusCode.BadRequest)
                password != passwordCheck -> call.respondText("You have to type same value for password and password check.", status = HttpStatusCode.BadRequest)
                username.length < 4 -> call.respondText("Username must be longer then 4 letters", status = HttpStatusCode.BadRequest)
                displayName.length < 3 -> call.respondText("Display name must be longer then 3 letters", status = HttpStatusCode.BadRequest)
                !emailRegex.matches(email) -> call.respondText("Email address is not valid.", status = HttpStatusCode.BadRequest)
                DbQueries.findByUsername(username) != null -> return@post call.respondText("Username ${username} is already in use", status = HttpStatusCode.BadRequest)
                DbQueries.findByEmail(email) != null -> return@post call.respondText("Email ${email} is already in use", status = HttpStatusCode.BadRequest)
                else -> {
                    // Sign up form validated! create new user with the form data
                    val passwordHash = BCrypt.hashpw(password, BCrypt.gensalt())
                    val newUser = DbQueries.signUp(username, email, displayName, passwordHash)

                    val rawCode = (0 .. 99999999).random().toString()
                    val code = "${"0".repeat(8 - rawCode.length)}${rawCode}"
                    val now = DateTime()

                    // Send verification code via email
                    val result = Mailer.sendVerification(newUser, VerificationTypes.Email,
                        code, now.toString())
                    
                    if(result){
                        // Store verification information
                        DbQueries.genVerification(newUser, VerificationTypes.Email, BCrypt.hashpw(code, BCrypt.gensalt()), now)
                    }
                    
                    // Set Session
                    call.sessions.set(AuthbookSession(
                        newUser.id.value,
                        newUser.username, 
                        call.request.origin.remoteHost, 
                        DateTime().toString()))
                    
                    // Respond to the client
                    call.respondText("Signed Up! You can now log in with the new account. Please verify your email when your are loggin in.")
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

                        // Respond to the client
                        call.respond(UserData(user.username, user.displayName, user.email, !user.seedKeyHash.isEmpty(), false))
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

        post("/recover"){
            
        }
        
        put("/verify"){
            
        }
    }
}