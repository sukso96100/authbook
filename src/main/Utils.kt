package xyz.youngbin.authbook

import javax.crypto.*
import javax.crypto.spec.*

val hashKey = hex(environment.config.property("authbook.secret").getString())
val hmacKey = SecretKeySpec(hashKey, "HmacSHA1")

fun hash(password: String): String {
    val hmac = Mac.getInstance("HmacSHA1")
    hmac.init(hmacKey)
    return hex(hmac.doFinal(password.toByteArray(Charsets.UTF_8)))
}