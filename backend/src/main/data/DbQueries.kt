package xyz.youngbin.authbook

import io.ktor.application.*
import io.ktor.features.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.dao.*
import org.joda.time.*
import org.apache.commons.codec.binary.Hex;
import org.mindrot.jbcrypt.BCrypt
//https://docs.oracle.com/javase/8/docs/api/java/util/Base64.html

object DbQueries{
    fun initDatabase(dbAddress: String, dbUser: String, dbPassword: String){
        // Connect with database
        Database.connect("jdbc:${dbAddress}", 
                     driver = "com.mysql.cj.jdbc.Driver", 
                     user = dbUser, 
                     password = dbPassword) 
        transaction {
            SchemaUtils.create (Users, OtpSeeds, Verifications)
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
    
    fun findById(useruid: Int): User?{
        return transaction{
            val uid = EntityID<Int>(useruid, Users)
            User.findById(uid)
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
    
    fun checkSeedKey(user: User, seedKey: String): Boolean{
        return transaction{
            BCrypt.checkpw(seedKey, user.seedKeyHash)
        }
    }
    
    fun getUserSeeds(user: User): List<SeedItem>{
        return transaction{
            val seeds = OtpSeed.find { OtpSeeds.seedOwner eq user.id }
            val seedsList = mutableListOf<SeedItem>()
            seeds.forEach{
                seedsList.add(SeedItem(
                    it.id.value,
                    it.seedName,
                    it.url,
                    it.accountUserName,
                    it.seedInfo,
                    Hex.encodeHexString(it.seedBytes)
                ))
            }
            seedsList
        }
    }
    
    // Set the key for encrypting otp seeds
    fun setSeedKey(user: User, seedKey: String){
        return transaction{
            user.seedKeyHash = BCrypt.hashpw(seedKey, BCrypt.gensalt())
        }
    }
    
    fun changeSeedKey(user: User, prevKey: String, newKey: String){
        return transaction{
            val seeds = OtpSeed.find{ OtpSeeds.seedOwner eq user.id }
            seeds.forEach{
                val old = Crypto.decryptWithKey(prevKey, it.seedBytes)
                it.seedBytes = Crypto.encryptWithKey(newKey, old)
            }
            user.seedKeyHash = BCrypt.hashpw(newKey, BCrypt.gensalt())
        }
    }
    
    fun addUserSeed(user: User, newSeedData: AddSeedForm) {
        val newSeedBytes = Crypto.encryptWithKey(newSeedData.seedKey, newSeedData.seedValue)
        return transaction{
            OtpSeed.new {
                seedName = newSeedData.seedName
                url = newSeedData.url
                accountUserName = newSeedData.accountUserName
                seedInfo = newSeedData.seedInfo
                seedBytes = newSeedBytes 
                seedOwner = user
            }
        }
    }
    
    fun updateUserSeed(user: User, updatedSeed: UpdateSeedForm): OtpSeed? {
        
        return transaction{
            val id = EntityID<Int>(updatedSeed.id, OtpSeeds)
            var seed = OtpSeed.findById(id)
            when(seed?.seedOwner?.username){
                user?.username ->{
                    seed?.seedName = updatedSeed.seedName
                    seed?.url = updatedSeed.url
                    seed?.accountUserName = updatedSeed.accountUserName
                    seed?.seedInfo = updatedSeed.seedInfo
                    updatedSeed.seedValue?.let{
                        seedValue ->
                        val newSeedBytes = Crypto.encryptWithKey(updatedSeed.seedKey, seedValue)
                        seed?.seedBytes = newSeedBytes
                    }
                }
                else -> seed = null
            }
            seed
        }
    }
    
    fun deleteSeed(user: User, seedId: Int): Boolean{
        return transaction{
            var result = true
            val id = EntityID<Int>(seedId, OtpSeeds)
            var seed = OtpSeed.findById(id)
            when(seed?.seedOwner?.username){
                user?.username -> seed?.delete()
                else -> seed = null
            }
            seed ?: run{ result = false } 
            result
        }
    }

    fun genVerification(target: User, mType: VerificationTypes, newCodeHash: String, reqAt: DateTime, mNewEmail: String=""){
        return transaction{
            var result = Verification.find{
                (Verifications.type eq mType) and
                (Verifications.verifiedAt.isNull()) and
                (Verifications.user eq target.id)
            }.singleOrNull()

            result?.let{
                item: Verification ->
                item.codeHash = newCodeHash
                item.requestedAt = reqAt
                item.newEmail = mNewEmail
            } ?: Verification.new {
                    type = mType
                    codeHash = newCodeHash
                    requestedAt = reqAt
                    verifiedAt = null
                    newEmail = mNewEmail
                    user = target
                }
            
        }
    }
    
    fun verify(target: User, vType: VerificationTypes, code: String, newPassword: String=""): Boolean{
        return transaction{
            var verifyResult = false
            var result = Verification.find{
                (Verifications.type eq vType) and
                (Verifications.verifiedAt.isNull()) and
                (Verifications.user eq target.id)
            }.singleOrNull()
            
            result?.let{
                item: Verification ->
                    if(BCrypt.checkpw(code, item.codeHash)){
                        when(vType){
                            VerificationTypes.Email -> {
                                target.email = item.newEmail
                            }
                            VerificationTypes.Password -> {
                                target.passwordHash = BCrypt.hashpw(newPassword, BCrypt.gensalt())
                            }
                        }
                        item.verifiedAt = DateTime()
                        verifyResult = true
                    }
                }
            verifyResult
        }
    }
}

