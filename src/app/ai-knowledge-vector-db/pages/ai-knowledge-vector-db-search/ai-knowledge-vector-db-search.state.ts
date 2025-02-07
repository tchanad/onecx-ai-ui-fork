import { DataTableColumn } from '@onecx/portal-integration-angular'
import { AIKnowledgeVectorDb } from 'src/app/shared/generated'
import { AIKnowledgeVectorDbSearchCriteria } from './ai-knowledge-vector-db-search.parameters'

export interface AIKnowledgeVectorDbSearchState {
  columns: DataTableColumn[]
  results: AIKnowledgeVectorDb[]
  displayedColumns: string[] | null
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
  searchLoadingIndicator: boolean
  criteria: AIKnowledgeVectorDbSearchCriteria
}
