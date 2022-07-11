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

    fun getWeightById(id: Int):DBWeightEntity?

    fun addWeight(accountId:Int, weight:Float) : RespondeResult
}






data class GetWeightByIdResultType(var weight: Float, val id: Int, val createdBy:Int, val isDeleted:Boolean)



