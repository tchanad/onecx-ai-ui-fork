import { createActionGroup, props } from '@ngrx/store'
import { AIKnowledgeDocument } from '../../../shared/generated'

export const AIKnowledgeDocumentDetailsActions = createActionGroup({
  source: 'AIKnowledgeDocumentDetails',
  events: {
    'navigated to details page': props<{
      id: string | undefined
    }>(),
    'aiknowledge document details received': props<{
      details: AIKnowledgeDocument
    }>(),
    'aiknowledge document details loading failed': props<{ error: string | null }>(),
    'load aiknowledge document details': props<{
      id: string
    }>()
  }
})
