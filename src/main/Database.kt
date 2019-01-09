package xyz.youngbin.authbook

import io.ktor.application.*
import io.ktor.features.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.joda.time.*


// User Session Model
data class AuthbookSession(
    val username: String,
    val ipAddress: String,
    val createdAt: DateTime = DateTime.now())

// Users Table Object
object Users : Table() {
    val username = varchar("username", 40).primaryKey()
    val email = varchar("email", 128).uniqueIndex()
    val displayName = varchar("display_name", 256)
    val passwordHash = varchar("password_hash", 64)
}

// OTP Seeds Table Object
object OtpSeeds : Table() {
    val seedId = integer("seed_id").autoIncrement().primaryKey()
    val seedName = varchar("seed_name", 256).uniqueIndex()
    val url = varchar("url", 512)
    val accountUserName = varchar("account_user_name", 128)
    val seedInfo = varchar("seed_info", 2048)
    val seedHash = varchar("seed_hash", 512)
    val seedOwner = varchar("seed_owner", 40) references Users.username
}
object DbQueries{
    fun initDatabase(dbAddress: String, dbUser: String, dbPassword: String){
        // Connect with database
        Database.connect("jdbc:${dbAddress}", 
                     driver = "com.mysql.jdbc.Driver", 
                     user = dbUser, 
                     password = dbPassword) 
        transaction {
            SchemaUtils.create (Users, OtpSeeds)
        }
    }

    fun findByUsername(username: String): Query{
            return transaction{
                Users.select { Users.username eq username }
            }
        }
    fun findByEmail(email: String): Query{
            return transaction{
                Users.select { Users.email eq email }
            }
        }
    fun isUsernameInUse(username: String): Boolean{
        return transaction{ findByUsername(username).count() > 0 }
    }
    fun isEmailInUse(email: String): Boolean{
        return transaction{ findByEmail(email).count() > 0 }
    }
     fun signUp(newUsername: String, newEmail: String, 
               newDisplayName: String, newPasswordHash: String){
        transaction{
             Users.insert {
                it[username] = newUsername
                it[email] = newEmail
                it[displayName] = newDisplayName
                it[passwordHash] = newPasswordHash
            }
        }
    }
}

