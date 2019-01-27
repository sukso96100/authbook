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
import org.joda.time.*

data class AddSeedForm(
    val seedName: String,
    val url: String,
    val accountUserName: String,
    val seedInfo: String,
    val seedHash: String)
data class SetSeedKeyForm(val seedKey: String)
data class ChangeSeedKeyForm(val preKey: String, val newKey: String)
fun Route.seeds(){
    route("/seeds"){
        
        // Sign Up Function
        get("/all"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@get call.respondText("Session is empty")
            val seeds = DbQueries.getUserSeeds(session.useruid)
            seeds ?: call.respondText("Empty")
            call.respond(seeds)
        }
        
        post("/add"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@post call.respondText("Session is empty")
            val params = call.receive<AddSeedForm>()
            DbQueries.addUserSeed(session.useruid, params)
            val seeds = DbQueries.getUserSeeds(session.useruid)
            seeds ?: call.respondText("Empty")
            call.respond(seeds)
        }
        
        post("/edit"){
            
        }
        
        delete("/delete"){
            
        }
        
        put("/set_seedkey"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@post call.respondText("Session is empty")
            val params = call.receive<SetSeedKeyForm>()
            val result = DbQueries.setSeedKey(session.useruid, params.seedKey)
            if(result){ 
                call.respondText("Seed key configured")
            }else{ 
                call.respondText("set seed key failed") 
            }
        }
        put("change_seedkey"){
             val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@post call.respondText("Session is empty")
            val params = call.receive<ChangeSeedKeyForm>()
        }
    }
        
}

