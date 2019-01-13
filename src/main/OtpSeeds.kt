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


fun Route.seeds(){
    route("/seeds"){
        
        // Sign Up Function
        get("/all"){
           
            
            
        }
        
        post("/add"){
            
        }
        
        post("/edit"){
            
        }
        
        delete("/delete"){
            
        }
    }
        
}

