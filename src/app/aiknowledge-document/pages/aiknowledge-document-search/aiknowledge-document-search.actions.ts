import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { DataTableColumn } from '@onecx/angular-accelerator'
import { AIKnowledgeDocument } from '../../../shared/generated'
import { AIKnowledgeDocumentSearchCriteria } from './aiknowledge-document-search.parameters'

export const AIKnowledgeDocumentSearchActions = createActionGroup({
  source: 'AIKnowledgeDocumentSearch',
  events: {
    'Delete AIKnowledge Document button clicked': props<{
      id: number | string
    }>(),
    'Delete AIKnowledge Document cancelled': emptyProps(),
    'Delete AIKnowledge Document succeeded': emptyProps(),
    'Delete AIKnowledge Document failed': props<{
      error: string | null
    }>(),

    'Create AIKnowledge Document button clicked': emptyProps(),
    'Edit AIKnowledge Document button clicked': props<{
      id: number | string
    }>(),
    'Create AIKnowledge Document cancelled': emptyProps(),
    'Update AIKnowledge Document cancelled': emptyProps(),
    'Create AIKnowledge Document succeeded': emptyProps(),
    'Update AIKnowledge Document succeeded': emptyProps(),
    'Create AIKnowledge Document failed': props<{
      error: string | null
    }>(),
    'Update AIKnowledge Document failed': props<{
      error: string | null
    }>(),

    'Details button clicked': props<{
      id: number | string
    }>(),

    'Search button clicked': props<{
      searchCriteria: AIKnowledgeDocumentSearchCriteria
    }>(),
    'Reset button clicked': emptyProps(),
    'AIKnowledge Document search results received': props<{
      results: AIKnowledgeDocument[]
      totalNumberOfResults: number
    }>(),
    'AIKnowledge Document search results loading failed': props<{ error: string | null }>(),
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