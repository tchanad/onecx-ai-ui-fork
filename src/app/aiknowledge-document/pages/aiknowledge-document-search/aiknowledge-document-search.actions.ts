import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { DataTableColumn } from '@onecx/angular-accelerator'
import { AIKnowledgeDocument } from '../../../shared/generated'
import { AIKnowledgeDocumentSearchCriteria } from './aiknowledge-document-search.parameters'

export const AIKnowledgeDocumentSearchActions = createActionGroup({
  source: 'AIKnowledgeDocumentSearch',
  events: {
    'Search button clicked': props<{
      searchCriteria: AIKnowledgeDocumentSearchCriteria
    }>(),
    'Reset button clicked': emptyProps(),
    'aiknowledge document search results received': props<{
      results: AIKnowledgeDocument[]
      totalNumberOfResults: number
    }>(),
    'aiknowledge document search results loading failed': props<{ error: string | null }>(),
    'Displayed columns changed': props<{
      displayedColumns: DataTableColumn[]
    }>(),
    'Chart visibility rehydrated': props<{
      visible: boolean
    }>(),
    'Chart visibility toggled': emptyProps(),
    'View mode changed': props<{
      viewMode: 'basic' | 'advanced'
    }>(),
    'Export button clicked': emptyProps()
  }
})
