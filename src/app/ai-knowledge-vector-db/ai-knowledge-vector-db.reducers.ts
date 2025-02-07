import { combineReducers, createFeature } from '@ngrx/store'
import { AIKnowledgeVectorDbState } from './ai-knowledge-vector-db.state'
import { AIKnowledgeVectorDbDetailsReducer } from './pages/ai-knowledge-vector-db-details/ai-knowledge-vector-db-details.reducers'
import { AIKnowledgeVectorDbSearchReducer } from './pages/ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.reducers'

export const AIKnowledgeVectorDbFeature = createFeature({
  name: 'AIKnowledgeVectorDb',
  reducer: combineReducers<AIKnowledgeVectorDbState>({
    details: AIKnowledgeVectorDbDetailsReducer,
    search: AIKnowledgeVectorDbSearchReducer
  })
})
