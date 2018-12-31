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
            val displayName = params[]"display_name"]
            val password = params["password"]
        }
        post("/login"){}
        get("/logout"){}
    }
}