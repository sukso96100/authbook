package xyz.youngbin.authbook
import java.util.Date

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.html.*
import io.ktor.routing.*
import kotlinx.html.*
import io.ktor.sessions.*
import io.ktor.gson.*
import io.ktor.auth.*
import javax.crypto.*
import javax.crypto.spec.*
import io.ktor.util.*
import io.ktor.http.*
import java.io.File


fun Application.main() {
    install(DefaultHeaders)
    install(CallLogging)
    install(Authentication){}
    install(CORS){
        method(HttpMethod.Options)
        method(HttpMethod.Put)
        method(HttpMethod.Delete)
        anyHost()
        header("SESSION")
    }
    install(Sessions) {
        header<AuthbookSession>("SESSION", storage = directorySessionStorage(File(".sessions"), cached = true))
    }
    install(ContentNegotiation) {
        gson {
            // setDateFormat(DateFormat.LONG)
            setPrettyPrinting()
        }
    }
    
    // Init DB Connection
    val dbAddress = environment.config.property("authbook.db.address").getString()
    val dbUser = environment.config.property("authbook.db.user").getString()
    val dbPassword = environment.config.property("authbook.db.password").getString()
    
    DbQueries.initDatabase(dbAddress, dbUser, dbPassword)
    
    routing {
        get("/") {
            call.respondHtml {
                head {
                    title { +"Authbook" }
                }
                body {
                    p {
                        +"Welcome to Authbook"
                    }
                }
            }
        }
        // static("app") {
        //     files("css") 
        // }
        auth()
        seeds()
        
    }
}
