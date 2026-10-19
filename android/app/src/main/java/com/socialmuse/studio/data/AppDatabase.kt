package com.socialmuse.studio.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "drafts")
data class DraftEntity(
    @PrimaryKey val id: String,
    val title: String,
    val content: String,
    val platform: String,
    val category: String,
    val tone: String,
    val hashtagsCsv: String,
    val brandProfileId: String?,
    val isFavorite: Boolean,
    val status: String,
    val createdAt: Long,
    val updatedAt: Long,
    val characterCount: Int
)

@Dao
interface DraftDao {
    @Query("SELECT * FROM drafts ORDER BY updatedAt DESC")
    fun getAllDrafts(): Flow<List<DraftEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDraft(draft: DraftEntity)

    @Delete
    suspend fun deleteDraft(draft: DraftEntity)

    @Query("UPDATE drafts SET isFavorite = NOT isFavorite WHERE id = :id")
    suspend fun toggleFavorite(id: String)
}

@Database(entities = [DraftEntity::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun draftDao(): DraftDao
}
