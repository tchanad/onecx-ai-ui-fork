import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { AIKnowledgeVectorDbSearchCriteria } from './ai-knowledge-vector-db-search.parameters'

export interface AIKnowledgeVectorDbSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: AIKnowledgeVectorDbSearchCriteria
  results: RowListGridData[]
  displayedColumns: DataTableColumn[]
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
}
