import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { DataTableColumn } from '@onecx/angular-accelerator'
import { AIKnowledgeDocument } from '../../../shared/generated'
import { AIKnowledgeDocumentSearchCriteria } from './aiknowledge-document-search.parameters'

export const AIKnowledgeDocumentSearchActions = createActionGroup({
  source: 'AIKnowledgeDocumentSearch',
  events: {
    'Delete aiknowledge document button clicked': props<{
      id: number | string
    }>(),
    'Delete aiknowledge document cancelled': emptyProps(),
    'Delete aiknowledge document succeeded': emptyProps(),
    'Delete aiknowledge document failed': props<{
      error: string | null
    }>(),

    'Create aiknowledge document button clicked': emptyProps(),
    'Edit aiknowledge document button clicked': props<{
      id: number | string
    }>(),
    'Create aiknowledge document cancelled': emptyProps(),
    'Update aiknowledge document cancelled': emptyProps(),
    'Create aiknowledge document succeeded': emptyProps(),
    'Update aiknowledge document succeeded': emptyProps(),
    'Create aiknowledge document failed': props<{
      error: string | null
    }>(),
    'Update aiknowledge document failed': props<{
      error: string | null
    }>(),

    'Details button clicked': props<{
      id: number | string
    }>(),

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
