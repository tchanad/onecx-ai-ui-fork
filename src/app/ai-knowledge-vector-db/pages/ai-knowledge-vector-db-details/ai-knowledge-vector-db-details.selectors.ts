import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { AIKnowledgeVectorDb } from '../../../shared/generated'
import { AIKnowledgeVectorDbFeature } from '../../ai-knowledge-vector-db.reducers'
import { initialState } from './ai-knowledge-vector-db-details.reducers'
import { AIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.viewmodel'

export const AIKnowledgeVectorDbDetailsSelectors = createChildSelectors(
  AIKnowledgeVectorDbFeature.selectDetails,
  initialState
)

export const selectAIKnowledgeVectorDbDetailsViewModel = createSelector(
  AIKnowledgeVectorDbDetailsSelectors.selectDetails,
  (details: AIKnowledgeVectorDb | undefined): AIKnowledgeVectorDbDetailsViewModel => ({
    details
  })
)
