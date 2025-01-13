import { combineReducers, createFeature } from '@ngrx/store'
import { AIKnowledgeDocumentState } from './aiknowledge-document.state'

export const aIKnowledgeDocumentFeature = createFeature({
  name: 'aIKnowledgeDocument',
  reducer: combineReducers<AIKnowledgeDocumentState>({})
})
