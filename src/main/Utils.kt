package xyz.youngbin.authbook

import javax.crypto.*
import javax.crypto.spec.*
import io.ktor.application.*

val emailRegex = Regex("""/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g""")

fun hash(password: String): String {
    val hmac = Mac.getInstance("HmacSHA512")
    hmac.init(hmacKey)
    return hmac.doFinal(password.toByteArray(Charsets.UTF_8)).toString()
}