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

data class SignUpForm(
    val username: String?,
    val email: String?,
    val displayName: String?,
    val password: String?,
    val passwordCheck: String?)

data class LoginForm(
    val username: String?,
    val password: String?)

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
                DbQueries.findByUsername(username) != null -> return@post call.respondText("Username ${username} is already in use")
                DbQueries.findByEmail(email) != null -> return@post call.respondText("Email ${email} is already in use")
                else -> {
                    // Sign up form validated! create new user with the form data
                    val passwordHash = hash(password)
                    val newUser = DbQueries.signUp(username, email, displayName, passwordHash)
                    
                    // Set Session
                    call.sessions.set(AuthbookSession(
                        newUser.id.value,
                        newUser.username, 
                        call.request.origin.remoteHost, 
                        DateTime.now().toString()))
                    
                    // Respond to the client
                    call.respondText("Signed Up! You can now log in with the new account.")
                }
            
            
            }
        }
        
        post("/login"){
            val params = call.receive<LoginForm>()
            val username = params.username ?: return@post call.respondText("username is empty")
            val password = params.password ?: return@post call.respondText("password is empty")
            when {
                // Validate login up form
                username.length < 4 -> call.respondText("Username must be longer then 4 letters")
                password.length < 8 -> call.respondText("Password must be at least 8 digits")
                else -> {
                    val user = DbQueries.findByUsername(username) ?: return@post call.respondText("User not found")
                    val passwordHash = hash(password)
                    if(user.passwordHash == passwordHash){
                        // Set Session
                        call.sessions.set(AuthbookSession(
                            user.id.value,
                            user.username, 
                            call.request.origin.remoteHost, 
                            DateTime.now().toString()))

                        // Respond to the client
                        call.respondText("Logged In!")
                    }else{
                        // Respond to the client
                        call.respondText("Password dose not matches!")
                    }
                }
            }
        }
        
        get("/logout"){
            // Clear session when logging out
            call.sessions.clear<AuthbookSession>()
        }
    }
}
