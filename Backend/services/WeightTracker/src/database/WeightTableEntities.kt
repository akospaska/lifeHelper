package com.KtorTutorial.database

import org.ktorm.entity.Entity
import org.ktorm.schema.*

object DBWeightTable : Table<DBWeightEntity>("weight") {
    val id = int("id").primaryKey().bindTo { it.id }
    val weight = float("weight").bindTo { it.weight }
    val createdBy = int("createdBy").bindTo { it.createdBy }
    val isDeleted = boolean("isDeleted").bindTo { it.isDeleted }
}

interface DBWeightEntity : Entity<DBWeightEntity> {
    companion object : Entity.Factory<DBWeightEntity>()
    val id: Int
    val weight: Float
    val createdBy: Int
    val isDeleted: Boolean
}


