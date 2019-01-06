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

lateinit var hashKey: ByteArray
lateinit var hmacKey: SecretKeySpec

fun Application.main() {
    install(DefaultHeaders)
    install(CallLogging)
    install(Authentication) {
        
    }
    install(Sessions) {
        header<AuthbookSession>("SESSION", storage = SessionStorageMemory())
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
    initDatabase(dbAddress, dbUser, dbPassword)
    
    hashKey = environment.config.property("authbook.secret").getString().toByteArray()
    hmacKey = SecretKeySpec(hashKey, "HmacSHA512")
    
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
        auth()
        
    }
}
