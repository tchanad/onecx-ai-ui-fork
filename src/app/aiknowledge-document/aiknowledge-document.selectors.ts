import { createFeatureSelector } from '@ngrx/store'
import { AIKnowledgeDocumentFeature } from './aiknowledge-document.reducers'
import { AIKnowledgeDocumentState } from './aiknowledge-document.state'

export const selectAIKnowledgeDocumentFeature = createFeatureSelector<AIKnowledgeDocumentState>(
  AIKnowledgeDocumentFeature.name
)