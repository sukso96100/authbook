package xyz.youngbin.authbook
import org.jetbrains.exposed.sql.*

// User Session Model
data class AuthbookSession(val sessionId: String)

// Users Table
object Users : Table() {
    val username = varchar("username", 40).primaryKey()
    val email = varchar("email", 128).uniqueIndex()
    val displayName = varchar("display_name", 256)
    val passwordHash = varchar("password_hash", 64)
}

// OTP Seeds Tab
object OtpSeeds : Table() {
    val seedId = integer("seed_id").primaryKey()
    val seedName = varchar("seed_name", 256)
    val url = varchar("url", 512)
    val accountUserName = varchar("account_user_name", 128)
    val seedInfo = varchar("seed_info", 2048)
    val seedHash = varchar("seed_hash", 512)
    val seedOwner = varchar("seed_owner", 40) references Users.username
}