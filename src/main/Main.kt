package xyz.youngbin.authbook

import io.ktor.application.*
import io.ktor.features.*
import io.ktor.html.*
import io.ktor.routing.*
import kotlinx.html.*
import io.ktor.sessions.Sessions

fun Application.main() {
    install(DefaultHeaders)
    install(CallLogging)
    install(Authentication) {
        
    }
    install(Sessions) {
        header<AuthbookSession>("SESSION", storage = SessionStorageMemory())
    }
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