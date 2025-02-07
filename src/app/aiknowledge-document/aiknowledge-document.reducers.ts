import { combineReducers, createFeature } from '@ngrx/store'
import { AIKnowledgeDocumentState } from './aiknowledge-document.state'
import { AIKnowledgeDocumentDetailsReducer } from './pages/aiknowledge-document-details/aiknowledge-document-details.reducers'
import { AIKnowledgeDocumentSearchReducer } from './pages/aiknowledge-document-search/aiknowledge-document-search.reducers'

export const AIKnowledgeDocumentFeature = createFeature({
  name: 'AIKnowledgeDocument',
  reducer: combineReducers<AIKnowledgeDocumentState>({
    details: AIKnowledgeDocumentDetailsReducer,
    search: AIKnowledgeDocumentSearchReducer
  })
})