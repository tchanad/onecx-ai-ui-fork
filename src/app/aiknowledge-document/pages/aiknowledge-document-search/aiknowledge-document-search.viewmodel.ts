import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { AIKnowledgeDocumentSearchCriteria } from './aiknowledge-document-search.parameters'

export interface AIKnowledgeDocumentSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: AIKnowledgeDocumentSearchCriteria
  results: RowListGridData[]
  displayedColumns: DataTableColumn[]
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
}