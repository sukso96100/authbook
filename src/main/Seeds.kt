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

data class AddSeedForm(
    val seedName: String,
    val url: String,
    val accountUserName: String,
    val seedInfo: String,
    val seedHash: String)

fun Route.seeds(){
    route("/seeds"){
        
        // Sign Up Function
        get("/all"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@get call.respondText("Session is empty")
            val seeds = DbQueries.getUserSeeds(session.useruid)
            call.respond(seeds.toList())
        }
        
        post("/add"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@get call.respondText("Session is empty")
            val params = call.receive<AddSeedForm>()
            DbQueries.addUserSeed(session.useruid, params)
        }
        
        post("/edit"){
            
        }
        
        delete("/delete"){
            
        }
    }
        
}

