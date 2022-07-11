package com.KtorTutorial.database

import org.ktorm.entity.Entity
import org.ktorm.schema.Table
import org.ktorm.schema.int
import org.ktorm.schema.varchar

object DBInventoryAll : Table<DBInventoryEntity>("inventorytutorial") {
    val id = int("id").primaryKey().bindTo { it.id }
    val name = varchar("name").bindTo { it.name }
    val count = int("count").bindTo { it.count }
}

interface DBInventoryEntity : Entity<DBInventoryEntity> {
    companion object : Entity.Factory<DBInventoryEntity>()
    val id: Int
    val name: String
    val count: Int
}


