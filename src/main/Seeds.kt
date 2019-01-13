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
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            val seeds = DbQueries.getUserSeeds(session.useruid)
            call.respond(seeds.toList())
        }
        
        post("/add"){
            
        }
        
        post("/edit"){
            
        }
        
        delete("/delete"){
            
        }
    }
        
}

