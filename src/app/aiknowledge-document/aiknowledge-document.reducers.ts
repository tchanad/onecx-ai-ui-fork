import { combineReducers, createFeature } from '@ngrx/store'
import { AIKnowledgeDocumentState } from './aiknowledge-document.state'
import { aIKnowledgeDocumentDetailsReducer } from './pages/aiknowledge-document-details/aiknowledge-document-details.reducers'
import { aIKnowledgeDocumentSearchReducer } from './pages/aiknowledge-document-search/aiknowledge-document-search.reducers'

export const aIKnowledgeDocumentFeature = createFeature({
  name: 'aIKnowledgeDocument',
  reducer: combineReducers<AIKnowledgeDocumentState>({
    details: aIKnowledgeDocumentDetailsReducer,
    search: aIKnowledgeDocumentSearchReducer
  })
})
