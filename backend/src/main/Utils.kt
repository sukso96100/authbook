package xyz.youngbin.authbook

import javax.crypto.*
import javax.crypto.spec.*
import java.util.Formatter
import java.security.SecureRandom
import javax.crypto.spec.*
import java.io.ByteArrayOutputStream

val emailRegex = Regex("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$")

fun genVerificationCode(): String{
    val codeBuilder = StringBuilder()
    for(i in 0 .. 7){
        codeBuilder.append((0 .. 9).random().toString())
    }
    val code = codeBuilder.toString()
    return code
}


object Crypto{
    // https://www.baeldung.com/java-cipher-class
    // https://stackoverflow.com/questions/44878997/handling-of-iv-and-salt-in-java-encryption-and-decryption
    // https://github.com/phxql/kotlin-crypto-example/blob/master/src/main/kotlin/de/mkammerer/Crypto.kt
    fun encryptWithKey(key: String, toEncrypt: String): ByteArray{

        // Generate salt
        val secRandom = SecureRandom()
        val salt = ByteArray(16)
        secRandom.nextBytes(salt)
        // val iv = ByteArray(16)
        // secRandom.nextBytes(iv)

        // generate secret with key and salt
        val secretKey = generateSecretKey(key, salt)

        val cipher = Cipher.getInstance("AES/CBC/PKCS5Padding")
        // cipher.init(Cipher.ENCRYPT_MODE, secretKey, IvParameterSpec(iv))
        cipher.init(Cipher.ENCRYPT_MODE, secretKey)

        // // get IV from cipher
        val params = cipher.getParameters() 
        // print(params) // null
        val specs = params.getParameterSpec(IvParameterSpec::class.java)
        val iv = specs.getIV()

        // encrypt the data
        val encrypted = cipher.doFinal(toEncrypt.toByteArray(Charsets.UTF_8))
        val outputStream = ByteArrayOutputStream()
        outputStream.write(salt)
        outputStream.write(iv)
        outputStream.write(encrypted)
        return outputStream.toByteArray()
    }

    fun decryptWithKey(key: String, toDecrypt: ByteArray): String{
        // Cut out salt, iv and content from the encrypted data
        val salt = toDecrypt.copyOfRange(0, 16)
        val iv = toDecrypt.copyOfRange(16, 32)
        val content = toDecrypt.copyOfRange(32, toDecrypt.size)

        // generate secret with key and salt
        val secretKey = generateSecretKey(key, salt)

        val cipher = Cipher.getInstance("AES/ECB/PKCS5Padding")
        cipher.init(Cipher.DECRYPT_MODE, secretKey, IvParameterSpec(iv))
        val decrypted = cipher.doFinal(content)
        return String(decrypted, Charsets.UTF_8)
    }

    fun generateSecretKey(key: String, salt: ByteArray): SecretKeySpec{
        // generate secret with key and salt
        val factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512")
        val spec = PBEKeySpec(key.toCharArray(), salt, 20000, 256)
        val tmp = factory.generateSecret(spec)
        return SecretKeySpec(tmp.getEncoded(), "AES")
    }
}
