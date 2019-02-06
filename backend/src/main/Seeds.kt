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

data class ChangeSeedKeyForm(val prevKey: String, val newKey: String)

data class UpdateSeedForm(
    val id: Int,
    val seedName: String,
    val url: String,
    val accountUserName: String,
    val seedInfo: String,
    val seedValue: String,
    val seedKey: String)

data class DeleteSeedForm(val id: Int)


fun Route.seeds(){
    route("/seeds"){
        
        // Sign Up Function
        get("/all"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@get call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@get call.respondText("User not found")
            val seeds = DbQueries.getUserSeeds(user)
            seeds ?: call.respondText("Empty")
            call.respond(seeds)
        }
        
        post("/add"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@post call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@post call.respondText("User not found")
            
            val params = call.receive<AddSeedForm>()
            if(!DbQueries.checkSeedKey(user, params.seedKey)) return@post call.respondText("You have typed wrong seed key.")
            DbQueries.addUserSeed(user, params)
            val seeds = DbQueries.getUserSeeds(user)
            seeds ?: call.respondText("Empty")
            call.respond(seeds)
        }
        
        put("/edit"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@put call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@put call.respondText("User not found")
            
            val params = call.receive<UpdateSeedForm>()
            if(!DbQueries.checkSeedKey(user, params.seedKey)) return@put call.respondText("You have typed wrong seed key.")
            DbQueries.updateUserSeed(user, params) ?: return@put call.respondText("Seed not found.")
            call.respondText("Seed updated.")
        }
        
        delete("/delete"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@delete call.respondText("Session is empty")
            val user = DbQueries.findById(session.useruid) ?: return@delete call.respondText("User not found")
            val params = call.receive<DeleteSeedForm>()
            
            if(DbQueries.deleteSeed(user, params.id)){
                call.respondText("Seed deleted")
            }else{
                call.respondText("Seed not found")
            }
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
            if(!DbQueries.checkSeedKey(user, params.prevKey)) return@put call.respondText("You have typed wrong seed key.")
            DbQueries.changeSeedKey(user, params.prevKey, params.newKey)
            call.respondText("Seed key chanegd")
        }
    }
        
}

