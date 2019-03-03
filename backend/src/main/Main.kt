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
        header(HttpHeaders.XForwardedProto)
        header("SESSION")
        exposeHeader("SESSION")
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
    
    val mailHost: environment.config.property("authbook.mail.host").getString()
    val mailPort: environment.config.property("authbook.mail.port").getString()
    val mailUsername: environment.config.property("authbook.mail.username").getString()
    val mailPassword: environment.config.property("authbook.mail.password").getString()
    val mailAddress: environment.config.property("authbook.mail.emailAddress").getString()
    val mailDisplayName: environment.config.property("authbook.mail.displayName").getString()
    
    Mailer.initMailer(mailHost, mailPort, mailUsername, mailPassword, mailAddress, mailDisplayName)
    
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
