package xyz.youngbin.authbook

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.html.*
import io.ktor.routing.*
import kotlinx.html.*

fun Route.auth(){
    route("/auth"){
        
        // Sign Up Function
        post("/signup"){
            val params = call.receive<Parameters>()
            
            val username = params["username"]
            val email = params["email"]
            val displayName = params["display_name"]
            val password = params["password"]
            val passwordChech = params["password_check"]
            
            when {
                password.length < 8 -> call.respondText("Password must be at least 8 digits")
                username.length < 4 -> call.respondText("Username must be longer then 4 letters")
            
            val passwordHash = hash(password)
        }
        post("/login"){}
        get("/logout"){}
    }
}