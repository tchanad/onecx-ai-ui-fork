import { createActionGroup, props } from '@ngrx/store'
import { AIKnowledgeDocument } from '../../../shared/generated'

export const AIKnowledgeDocumentDetailsActions = createActionGroup({
  source: 'AIKnowledgeDocumentDetails',
  events: {
    'navigated to details page': props<{
      id: string | undefined
    }>(),
    'AIKnowledge Document details received': props<{
      details: AIKnowledgeDocument
    }>(),
    'AIKnowledge Document details loading failed': props<{ error: string | null }>(),
  }
})