package xyz.youngbin.authbook

import io.ktor.application.*
import io.ktor.features.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.dao.*
import org.joda.time.*


// User Session Model
data class AuthbookSession(
    val useruid: Int,
    val username: String,
    val ipAddress: String,
    val createdAt: String = DateTime.now().toString())

// Users Table Object
object Users : IdTable<Int>() {
    override val id = integer("id").autoIncrement().entityId()
    val username = varchar("username", 40).uniqueIndex()
    val email = varchar("email", 128).uniqueIndex()
    val displayName = varchar("display_name", 256)
    val passwordHash = varchar("password_hash", 256)
}

// Users Entity Class
class User(id: EntityID<Int>) : Entity<Int>(id) {
    companion object : EntityClass<Int, User>(Users)
    
    var username by Users.username
    var email by Users.email
    var displayName by Users.displayName
    var passwordHash by Users.passwordHash
}

// OTP Seeds Table Object
object OtpSeeds : IdTable<Int>() {
    override val id = integer("id").autoIncrement().entityId()
    val seedName = varchar("seed_name", 256)
    val url = varchar("url", 512)
    val accountUserName = varchar("account_user_name", 128)
    val seedInfo = varchar("seed_info", 2048)
    val seedHash = varchar("seed_hash", 512)
    val seedOwner= reference("seed_owner", Users)
}

class OtpSeed(id: EntityID<Int>) : Entity<Int>(id) {
    companion object : EntityClass<Int, OtpSeed>(OtpSeeds)
    
    var seedName by OtpSeeds.seedName
    var url by OtpSeeds.url
    var accountUserName by OtpSeeds.accountUserName
    var seedInfo by OtpSeeds.seedInfo
    var seedHash by OtpSeeds.seedHash
    var seedOwner by User referencedOn OtpSeeds.seedOwner
}

data class SeedItem(
    val id: Int,
    var seedName: String,
    var url: String,
    var accountUserName: String,
    var seedInfo: String,
    var seedHash: String
)


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

    fun findByUsername(username: String): User?{
            return transaction{
                User.find { Users.username eq username }.singleOrNull()
            }
        }
    fun findByEmail(email: String): User?{
            return transaction{
                User.find { Users.email eq email }.singleOrNull()
            }
        }
    
     fun signUp(newUsername: String, newEmail: String, 
               newDisplayName: String, newPasswordHash: String): User{
        return transaction{
             User.new {
                 username = newUsername
                 email = newEmail
                 displayName = newDisplayName
                 passwordHash = newPasswordHash
             }
        }
    }
    
    fun getUserSeeds(useruid: Int): List<SeedItem>{
        return transaction{
            val uid = EntityID<Int>(useruid, Users)
            val seeds = OtpSeed.find { OtpSeeds.seedOwner eq uid }
            val seedsList = mutableListOf<SeedItem>()
            seeds.forEach{
                seedsList.add(SeedItem(
                    it.id.value,
                    it.seedName,
                    it.url,
                    it.accountUserName,
                    it.seedInfo,
                    it.seedHash
                ))
            }
            seedsList
        }
    }
    
    fun addUserSeed(useruid: Int, newSeedData: AddSeedForm) {
        return transaction{
            val uid = EntityID<Int>(useruid, Users)
            User.findById(uid)?.let{
                OtpSeed.new {
                    seedName = newSeedData.seedName
                    url = newSeedData.url
                    accountUserName = newSeedData.accountUserName
                    seedInfo = newSeedData.seedInfo
                    seedHash = newSeedData.seedHash
                    seedOwner = it
                }
            }
            
        }
    }
}

