package com.KtorTutorial.database

import com.KtorTutorial.enteties.RespondeResult
import org.ktorm.database.Database
import org.ktorm.dsl.*
import org.ktorm.entity.firstOrNull
import org.ktorm.entity.sequenceOf
import org.ktorm.entity.toList

class DatabaseManager {
    private val hostname = "localhost"
    private val databaseName = "db"
    private val username = "user"
    private val password = "password"

    private val ktormDatabase: Database

    init {
        println("jdbc:mysql://$hostname:3306/$databaseName?user=$username&password=$password&useSSL=false")
        val jdbcUrl = "jdbc:mysql://$hostname:3306/$databaseName?user=$username&password=$password&useSSL=false&serverTimezone=UTC"
        ktormDatabase = Database.connect(jdbcUrl)
    }

// inventory

    fun getInventoryItem(id: Int): DBInventoryEntity? {
        return ktormDatabase.sequenceOf(DBInventoryAll).firstOrNull { it.id eq id }
    }

    fun addNewInventoryItem(name: String): RespondeResult {
        val something = ktormDatabase.insert(DBInventoryAll) {
            set(DBInventoryAll.name, name)
        }
        return when (something) {
            1 -> RespondeResult(true)
            else -> RespondeResult(false)
        }
    }

    fun modifyCount(id: Int, requestDirection: String): Boolean {
        val direction: Int = when (requestDirection) {
            "+" -> 1
            else -> -1
        }
        val updateRows = ktormDatabase.update(DBInventoryAll) {
            set(DBInventoryAll.count, DBInventoryAll.count plus direction)
            where {
                it.id eq id
            }
        }
        return updateRows > 0
    }
    fun deleteInventryItem(id: Int): Boolean {
        val deletedRows = ktormDatabase.delete(DBInventoryAll) {
            it.id eq id
        }
        return deletedRows > 0
    }













    fun getWeightById(id: Int): DBWeightEntity? {
        return ktormDatabase.sequenceOf(DBWeightTable).firstOrNull { it.id eq id }
    }

    fun addWeight( accountId:Int, weight: Float): RespondeResult {
        val something = ktormDatabase.insert(DBWeightTable) {
            set(DBWeightTable.weight, weight)
            set(DBWeightTable.createdBy, accountId)
        }
        println("I am after the insert----------------")
        println(something)
        return when (something) {
            1 -> RespondeResult(true)
            else -> RespondeResult(false)
        }
    }


}

