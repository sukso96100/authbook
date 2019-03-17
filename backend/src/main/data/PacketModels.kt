package xyz.youngbin.authbook

import org.joda.time.*

// General
data class ResponseWithCode(val code: Int, val message: String)
// User Session Model
data class AuthbookSession(
    val useruid: Int,
    val username: String,
    val ipAddress: String,
    val createdAt: String = DateTime.now().toString())

// Auth

data class SignUpForm(
    val username: String?,
    val email: String?,
    val displayName: String?,
    val password: String?,
    val passwordCheck: String?)

data class LoginForm(
    val username: String?,
    val password: String?)

data class UserData(
    val username: String,
    val displayName: String,
    val email: String,
    val isSeedKeySet: Boolean,
    val isEmailVerified: Boolean)

data class EmailVerificationForm(
    val verificationCode: String
)

data class PasswordRecoverForm(
    val username: String,
    val verificationCode: String,
    val newPassword: String,
    val newPasswordCheck: String
)

data class PwRecoverRequestForm(
    val email: String
)
    
// Seeds

data class AddSeedForm(
    val seedName: String,
    val url: String,
    val accountUserName: String,
    val seedInfo: String,
    val seedValue: String,
    val seedKey: String)

data class SetSeedKeyForm(val seedKey: String, val seedKeyCheck: String)

data class ChangeSeedKeyForm(val prevKey: String, val newKey: String)

data class UpdateSeedForm(
    val id: Int,
    val seedName: String,
    val url: String,
    val accountUserName: String,
    val seedInfo: String,
    val seedValue: String?,
    val seedKey: String)

data class DeleteSeedForm(val id: Int)

data class SeedItem(
    val id: Int,
    val seedName: String,
    val url: String,
    val accountUserName: String,
    val seedInfo: String,
    val encryptedSeed: String
)

