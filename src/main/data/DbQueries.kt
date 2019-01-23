package xyz.youngbin.authbook

import io.ktor.application.*
import io.ktor.features.*
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction
import org.jetbrains.exposed.dao.*
import org.joda.time.*


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
    
    // Set (or change) the key for encrypting seeds.
    // then re-encrypt all seeds for the user. 
    fun setSeedKey(useruid: Int, seedKeyHash: String){
        
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

