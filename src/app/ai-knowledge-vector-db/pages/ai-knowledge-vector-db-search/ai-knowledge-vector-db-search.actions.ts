import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { DataTableColumn } from '@onecx/angular-accelerator'
import { AIKnowledgeVectorDb } from '../../../shared/generated'
import { AIKnowledgeVectorDbSearchCriteria } from './ai-knowledge-vector-db-search.parameters'

export const AIKnowledgeVectorDbSearchActions = createActionGroup({
  source: 'AIKnowledgeVectorDbSearch',
  events: {
    'Delete ai knowledge vector db button clicked': props<{
      id: number | string
    }>(),
    'Delete ai knowledge vector db cancelled': emptyProps(),
    'Delete ai knowledge vector db succeeded': emptyProps(),
    'Delete ai knowledge vector db failed': props<{
      error: string | null
    }>(),

    'Create ai knowledge vector db button clicked': emptyProps(),
    'Edit ai knowledge vector db button clicked': props<{
      id: number | string
    }>(),
    'Create ai knowledge vector db cancelled': emptyProps(),
    'Update ai knowledge vector db cancelled': emptyProps(),
    'Create ai knowledge vector db succeeded': emptyProps(),
    'Update ai knowledge vector db succeeded': emptyProps(),
    'Create ai knowledge vector db failed': props<{
      error: string | null
    }>(),
    'Update ai knowledge vector db failed': props<{
      error: string | null
    }>(),

    'Details button clicked': props<{
      id: number | string
    }>(),

    'Search button clicked': props<{
      searchCriteria: AIKnowledgeVectorDbSearchCriteria
    }>(),
    'Reset button clicked': emptyProps(),
    'ai knowledge vector db search results received': props<{
      results: AIKnowledgeVectorDb[]
      totalNumberOfResults: number
    }>(),
    'ai knowledge vector db search results loading failed': props<{ error: string | null }>(),
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
