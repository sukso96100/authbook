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
    val seedValue: String,
    val seedKey: String)
data class SetSeedKeyForm(val seedKey: String)
data class ChangeSeedKeyForm(val preKey: String, val newKey: String)
fun Route.seeds(){
    route("/seeds"){
        
        // Sign Up Function
        get("/all"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@get call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@get call.respondText("User not found")
            val seeds = DbQueries.getUserSeeds(session.useruid)
            seeds ?: call.respondText("Empty")
            call.respond(seeds)
        }
        
        post("/add"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@post call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@post call.respondText("User not found")
            val params = call.receive<AddSeedForm>()
            DbQueries.addUserSeed(user, params)
            val seeds = DbQueries.getUserSeeds(session.useruid)
            seeds ?: call.respondText("Empty")
            call.respond(seeds)
        }
        
        post("/edit"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@post call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@post call.respondText("User not found")
        }
        
        delete("/delete"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@delete call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@delete call.respondText("User not found")
        }
        
        put("/set_seedkey"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@put call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@put call.respondText("User not found")
            val params = call.receive<SetSeedKeyForm>()
            DbQueries.setSeedKey(user, params.seedKey)
            call.respondText("Seed key configured") 
        }
        put("change_seedkey"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@put call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@put call.respondText("User not found")
            val params = call.receive<ChangeSeedKeyForm>()
            val result = DbQueries.changeSeedKey(user, params.preKey, params.newKey)
            when(result){
                0 -> call.respondText("Seed key chanegd")
                1 -> call.respondText("Current seed key is not valid")
            }
        }
    }
        
}

