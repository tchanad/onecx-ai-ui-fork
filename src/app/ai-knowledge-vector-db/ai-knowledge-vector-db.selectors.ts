import { createFeatureSelector } from '@ngrx/store'
import { AIKnowledgeVectorDbFeature } from './ai-knowledge-vector-db.reducers'
import { AIKnowledgeVectorDbState } from './ai-knowledge-vector-db.state'

export const selectAIKnowledgeVectorDbFeature = createFeatureSelector<AIKnowledgeVectorDbState>(
  AIKnowledgeVectorDbFeature.name
)
