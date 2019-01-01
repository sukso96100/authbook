package xyz.youngbin.authbook
import org.jetbrains.exposed.sql.*

// User Session Model
data class AuthbookSession(val sessionId: String)

// Users Table Object
object Users : Table() {
    val username = varchar("username", 40).primaryKey()
    val email = varchar("email", 128).uniqueIndex()
    val displayName = varchar("display_name", 256)
    val passwordHash = varchar("password_hash", 64)
}

// OTP Seeds Table Object
object OtpSeeds : IntIdTable() {
    val seedId = integer("seed_id").uniqueIndex()
    val seedName = varchar("seed_name", 256)
    val url = varchar("url", 512)
    val accountUserName = varchar("account_user_name", 128)
    val seedInfo = varchar("seed_info", 2048)
    val seedHash = varchar("seed_hash", 512)
    val seedOwner = varchar("seed_owner", 40) references Users.username
}

companion object UserQuery{
    fun findByUsername(username: String): Query{
        return Users.select { Users.username eq username }
    }
    
    fun findByEmail(email: String){
        return Users.select { Users.email eq email }
    }
    
    fun signUp(username: String, email: String, 
               displayName: String, passwordHash: String){
        Users.insertAndGetId {
            it[username] = username
            it[email] = email
            it[displayName] = displayName
            it[passwordHash] = passwordHash
        }
    }
}