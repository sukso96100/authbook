package xyz.youngbin.authbook

import javax.crypto.*
import javax.crypto.spec.*
import io.ktor.application.*
import java.util.Formatter
import io.ktor.util.hex
import javax.crypto.*

val emailRegex = Regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")

fun hash(password: String): String {
    val hmac = Mac.getInstance("HmacSHA512")
    hmac.init(hmacKey)
    return hex(hmac.doFinal(password.toByteArray(Charsets.UTF_8)))
}
//https://www.baeldung.com/java-cipher-class
fun encryptWithKey(keyBytes: ByteArray, vararg toEncrypt: String): List<ByteArray>{
    val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
    val secretKey = SecretKeySpec(keyBytes, "AES");
    cipher.init(Cipher.ENCRYPT_MODE, secretKey);
    return toEncrypt.map{ cipher.doFinal(it.toByteArray()) }
}

fun decryptWithKey(keyBytes: ByteArray, vararg toDecrypt: String): List<ByteArray>{
    val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
    val secretKey = SecretKeySpec(keyBytes, "AES")
    cipher.init(Cipher.DECRYPT_MODE, secretKey)
    return toDecrypt.map{ cipher.doFinal(it.toByteArray()) }
}