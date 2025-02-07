import { createActionGroup, props } from '@ngrx/store'
import { AIKnowledgeVectorDb } from '../../../shared/generated'

export const AIKnowledgeVectorDbDetailsActions = createActionGroup({
  source: 'AIKnowledgeVectorDbDetails',
  events: {
    'navigated to details page': props<{
      id: string | undefined
    }>(),
    'ai knowledge vector db details received': props<{
      details: AIKnowledgeVectorDb
    }>(),
    'ai knowledge vector db details loading failed': props<{ error: string | null }>()
  }
})
