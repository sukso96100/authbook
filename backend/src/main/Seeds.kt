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

fun Route.seeds(){
    route("/seeds"){
        
        // Sign Up Function
        get("/all"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@get call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@get call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            val seeds = DbQueries.getUserSeeds(user)
            seeds ?: call.respondText("Empty")
            call.respond(seeds)
        }
        
        post("/add"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@post call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@post call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            if(user.seedKeyHash.isEmpty()) return@post call.respond(HttpStatusCode.Forbidden, ResponseWithCode(2, "Please set seed encryption key first."))
            
            val params = call.receive<AddSeedForm>()
            if(params.seedName.isNullOrEmpty() || params.seedValue.isNullOrEmpty())
                return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(3, "You must enter name of the account and otp key value!."))
            if(!DbQueries.checkSeedKey(user, params.seedKey)) 
                return@post call.respond(HttpStatusCode.BadRequest, ResponseWithCode(4, "You have typed wrong seed key."))
            DbQueries.addUserSeed(user, params)
            val seeds = DbQueries.getUserSeeds(user)
            seeds ?: call.respondText("Empty")
            call.respond(seeds)
        }
        
        put("/edit"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            if(user.seedKeyHash.isEmpty()) return@put call.respond(HttpStatusCode.Forbidden, ResponseWithCode(2, "Please set seed encryption key first."))
            
            val params = call.receive<UpdateSeedForm>()
            if(
                params.seedKey.isNullOrEmpty() || !DbQueries.checkSeedKey(user, params.seedKey)) 
                return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(3, "You have typed wrong seed key."))
            DbQueries.updateUserSeed(user, params) ?: return@put call.respond(HttpStatusCode.NotFound, ResponseWithCode(4, "Seed not found."))
            call.respondText("Seed updated.")
        }
        
        delete("/delete"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@delete call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@delete call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            if(user.seedKeyHash.isEmpty()) return@delete call.respond(HttpStatusCode.Forbidden, ResponseWithCode(2, "Please set seed encryption key first."))
            val params = call.receive<DeleteSeedForm>()
            
            if(DbQueries.deleteSeed(user, params.id)){
                call.respondText("Seed deleted")
            }else{
                call.respond(HttpStatusCode.NotFound, ResponseWithCode(3, "Seed not found."))
            }
        }
        
        put("/set_seedkey"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            val params = call.receive<SetSeedKeyForm>()
            if(params.seedKey != params.seedKeyCheck) return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(2, "Seed Key not matches"))
            DbQueries.setSeedKey(user, params.seedKey)
            call.respondText("Seed key configured") 
        }
        
        put("change_seedkey"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            val params = call.receive<ChangeSeedKeyForm>()
            if(!DbQueries.checkSeedKey(user, params.prevKey))
                return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(2,"You have typed wrong seed key."))
            DbQueries.changeSeedKey(user, params.prevKey, params.newKey)
            call.respondText("Seed key chanegd")
        }
    }
        
}

