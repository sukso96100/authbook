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
import java.util.Date

data class SignUpForm(
    val username: String?,
    val email: String?,
    val displayName: String?,
    val password: String?,
    val passwordCheck: String?)

fun Route.auth(){
    route("/auth"){
        
        // Sign Up Function
        post("/signup"){
            val params = call.receive<SignUpForm>()
            val username = params.username ?: return@post call.respondText("username is empty")
            val email = params.email ?: return@post call.respondText("email is empty")
            val displayName = params.displayName ?: return@post call.respondText("display name is empty")
            val password = params.password ?: return@post call.respondText("password is empty")
            val passwordCheck = params.passwordCheck ?: return@post call.respondText("password check is empty")
            
            when {
                // Validate sign up form
                password.length < 8 -> call.respondText("Password must be at least 8 digits")
                password != passwordCheck -> call.respondText("You have to type same value for password and password check.")
                username.length < 4 -> call.respondText("Username must be longer then 4 letters")
                displayName.length < 3 -> call.respondText("Display name must be longer then 3 letters")
                !emailRegex.matches(email) -> call.respondText("Email address is not valid.")
                UserQuery.findByUsername(username).count() > 0 -> call.respondText("Username ${username} is already in use")
                UserQuery.findByEmail(email).count() > 0 -> call.respondText("Email ${email} is already in use")
                else -> {
                    // Sign up form validated! create new user with the form data
                    val passwordHash = hash(password)
                    UserQuery.signUp(username, email, displayName, passwordHash)
                    
                    // Set Session
                    call.sessions.set(AuthbookSession(username, call.request.origin.remoteHost, Date()))
                    
                    // Respond to the client
                    call.respondText("Signed Up! You can now log in with the new account.")
                }
            
            
            }
        }
        
        post("/login"){
            
        }
        
        get("/logout"){
            
        }
    }
}
