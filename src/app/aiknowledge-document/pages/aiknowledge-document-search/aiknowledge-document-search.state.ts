import { DataTableColumn } from '@onecx/portal-integration-angular'
import { AIKnowledgeDocument } from 'src/app/shared/generated'
import { AIKnowledgeDocumentSearchCriteria } from './aiknowledge-document-search.parameters'

export interface AIKnowledgeDocumentSearchState {
  columns: DataTableColumn[]
  results: AIKnowledgeDocument[]
  displayedColumns: string[] | null
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
  searchLoadingIndicator: boolean
  criteria: AIKnowledgeDocumentSearchCriteria
}