import { createFeatureSelector } from '@ngrx/store'
import { aIKnowledgeDocumentFeature } from './aiknowledge-document.reducers'
import { AIKnowledgeDocumentState } from './aiknowledge-document.state'

export const selectAIKnowledgeDocumentFeature = createFeatureSelector<AIKnowledgeDocumentState>(
  aIKnowledgeDocumentFeature.name
)
