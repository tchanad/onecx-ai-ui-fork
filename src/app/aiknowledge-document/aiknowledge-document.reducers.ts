import { combineReducers, createFeature } from '@ngrx/store'
import { AIKnowledgeDocumentState } from './aiknowledge-document.state'
import { aIKnowledgeDocumentSearchReducer } from './pages/aiknowledge-document-search/aiknowledge-document-search.reducers'

export const aIKnowledgeDocumentFeature = createFeature({
  name: 'aIKnowledgeDocument',
  reducer: combineReducers<AIKnowledgeDocumentState>({
    search: aIKnowledgeDocumentSearchReducer
  })
})
