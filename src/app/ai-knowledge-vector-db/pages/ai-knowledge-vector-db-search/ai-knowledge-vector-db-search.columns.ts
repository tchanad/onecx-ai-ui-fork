import { ColumnType, DataTableColumn } from '@onecx/angular-accelerator'

export const AIKnowledgeVectorDbSearchColumns: DataTableColumn[] = [
    {
        columnType: ColumnType.STRING,
        id: 'name',
        nameKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.COLUMNS.NAME',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.DEFAULT',
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.EXTENDED',
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.FULL'
        ]
      },
      {
        columnType: ColumnType.STRING,
        id: 'description',
        nameKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.COLUMNS.DESCRIPTION',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.EXTENDED',
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.FULL'
        ]
      },
      {
        columnType: ColumnType.STRING,
        id: 'vdb',
        nameKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.COLUMNS.VDB',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.DEFAULT',
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.EXTENDED',
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.FULL'
        ]
      },
      {
        columnType: ColumnType.STRING,
        id: 'vdbCollection',
        nameKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.COLUMNS.VDBCOLLECTION',
        filterable: true,
        sortable: true,
        predefinedGroupKeys: [
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.DEFAULT',
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.EXTENDED',
          'AI_KNOWLEDGE_VECTOR_DB_SEARCH.PREDEFINED_GROUP.FULL'
        ]
      },
    
]

