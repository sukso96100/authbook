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
            val newItem = DbQueries.addUserSeed(user, params)
            call.respond(newItem)
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
            when{
                params.seedKey.length < 8 || params.seedKeyCheck.length < 8 -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(5, "seed key must be at least 8 digits"))
                params.seedKey != params.seedKeyCheck -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(2, "Seed Key not matches"))
                else -> {
                    DbQueries.setSeedKey(user, params.seedKey)
                    call.respondText("Seed key configured")
                }
            }
        }
        
        put("change_seedkey"){
            val session: AuthbookSession? = call.sessions.get<AuthbookSession>()
            session ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(0, "Session is empty"))
            val user = DbQueries.findById(session.useruid) ?: return@put call.respond(HttpStatusCode.Unauthorized, ResponseWithCode(1, "User not found"))
            val params = call.receive<PasswordChangeForm>()
            val currentPassword = params.currentPassword ?: return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(2, "current seed key is empty"))
            val newPassword = params.newPassword ?: return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(3, "You didn't type new seed key"))
            val newPasswordCheck = params.newPasswordCheck ?: return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(4, "You didn't type new seed key check"))
            
            when{
                currentPassword.length < 8 || newPassword.length < 8 -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(5, "seed key must be at least 8 digits"))
                newPassword != newPasswordCheck -> call.respond(HttpStatusCode.BadRequest, ResponseWithCode(6, "You have to type same value for seed key and seed key check."))
                else -> {
                    if(DbQueries.checkSeedKey(user, params.currentPassword)){
                        DbQueries.changeSeedKey(user, currentPassword, newPassword)
                        call.respondText("Seed key chanegd")
                    }else{
                        return@put call.respond(HttpStatusCode.BadRequest, ResponseWithCode(6,"You have typed wrong seed key."))
                    }
                }
            }
        }
    }
        
}

