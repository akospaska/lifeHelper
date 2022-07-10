package com.example.plugins

import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.http.cio.*
import io.ktor.server.plugins.statuspages.*
import io.ktor.server.http.content.*
import io.ktor.server.application.*
import io.ktor.server.response.*
import io.ktor.server.request.*

fun Application.configureRouting() {
    install(StatusPages) {
        exception<AuthenticationException> { call, cause ->
            call.respond(HttpStatusCode.Unauthorized)
        }
        exception<AuthorizationException> { call, cause ->
            call.respond(HttpStatusCode.Forbidden)
        }
    
    }
    

    routing {
        get("/") {
            call.respondText("Hello World!")
        }

        post("/") {
            call.respondText("Hello World!")
        }

        get("/json/jackson") {
            call.respond(mapOf("hello" to "world"))
        }

        post("/test") {
            var request = call.receive<Request>()
            request.id = request.id + 1
            call.respond(listOf(request))
        }




    }
}
class AuthenticationException : RuntimeException()
class AuthorizationException : RuntimeException()

data class Request(var id: Int, val name: String)