package com.KtorTutorial.repository.SqlInventoryRepository

import com.KtorTutorial.database.DBWeightEntity
import com.KtorTutorial.enteties.InventoryItem
import com.KtorTutorial.enteties.RespondeResult

interface InventoryRepository {

    fun getAllInventoryItems(): List<InventoryItem>

    fun getInventoryItem(id: Int): InventoryItem?

    fun addNewInventoryItem(name: String): RespondeResult

    fun modifyCount(id: Int, direction: String): Boolean

    fun deleteInventryItem(id: Int): Boolean

    fun getWeightListByAccountId(accountId: Int): List<DBWeightEntity>

    fun addWeight(accountId:Int, weight:Float) : RespondeResult
}





data class GetWeightByIdResult( val id: Int, val weight: Float)





