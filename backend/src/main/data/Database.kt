package xyz.youngbin.authbook

import io.ktor.application.*
import io.ktor.features.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.dao.*
import org.joda.time.*




// Users Table Object
object Users : IdTable<Int>() {
    override val id = integer("id").autoIncrement().entityId()
    val username = varchar("username", 40).uniqueIndex()
    val email = varchar("email", 128).uniqueIndex()
    val displayName = varchar("display_name", 256)
    val passwordHash = varchar("password_hash", 256)
    val seedKeyHash = varchar("seedkey_hash", 256).default("")
}

// Users Entity Class
class User(id: EntityID<Int>) : Entity<Int>(id) {
    companion object : EntityClass<Int, User>(Users)
    
    var username by Users.username
    var email by Users.email
    var displayName by Users.displayName
    var passwordHash by Users.passwordHash
    var seedKeyHash by Users.seedKeyHash
}

// OTP Seeds Table Object
object OtpSeeds : IdTable<Int>() {
    override val id = integer("id").autoIncrement().entityId()
    val seedName = varchar("seed_name", 256)
    val url = varchar("url", 512)
    val accountUserName = varchar("account_user_name", 128)
    val seedInfo = varchar("seed_info", 2048)
    val seedBytes = binary("seed_bytes", 512)
    val seedOwner= reference("seed_owner", Users)
}

class OtpSeed(id: EntityID<Int>) : Entity<Int>(id) {
    companion object : EntityClass<Int, OtpSeed>(OtpSeeds)
    
    var seedName by OtpSeeds.seedName
    var url by OtpSeeds.url
    var accountUserName by OtpSeeds.accountUserName
    var seedInfo by OtpSeeds.seedInfo
    var seedBytes by OtpSeeds.seedBytes
    var seedOwner by User referencedOn OtpSeeds.seedOwner
}

enum class VerificationTypes(val type: Int){
    Email(0),
    Password(1)
}

object Verifications : IdTable<Int>() {
    override val id = integer("id").autoIncrement().entityId()
    val type = enumeration("type", VerificationTypes::class)
    val codeHash = varchar("code_hash", 256)
    val requestedAt = datetime("requested_at")
    val verifiedAt = datetime("verified_at").nullable()
    val newEmail = varchar("new_email", 128).default("")
    val user = reference("user", Users)
}

class Verification(id: EntityID<Int>) : Entity<Int>(id) {
    companion object : EntityClass<Int, Verification>(Verifications)

    var type by Verifications.type 
    var codeHash by Verifications.codeHash 
    var requestedAt by Verifications.requestedAt 
    var verifiedAt: DateTime? by Verifications.verifiedAt
    var newEmail by Verifications.newEmail
    var user by User referencedOn Verifications.user
}


