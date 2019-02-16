package xyz.youngbin.authbook

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
    val email: String)
    
// Seeds

data class AddSeedForm(
    val seedName: String,
    val url: String,
    val accountUserName: String,
    val seedInfo: String,
    val seedValue: String,
    val seedKey: String)

data class SetSeedKeyForm(val seedKey: String)

data class ChangeSeedKeyForm(val prevKey: String, val newKey: String)

data class UpdateSeedForm(
    val id: Int,
    val seedName: String,
    val url: String,
    val accountUserName: String,
    val seedInfo: String,
    val seedValue: String,
    val seedKey: String)

data class DeleteSeedForm(val id: Int)
