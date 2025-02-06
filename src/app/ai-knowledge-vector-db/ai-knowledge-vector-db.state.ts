import { AIKnowledgeVectorDbDetailsState } from './pages/ai-knowledge-vector-db-details/ai-knowledge-vector-db-details.state'
import { AIKnowledgeVectorDbSearchState } from './pages/ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.state'
export interface AIKnowledgeVectorDbState {
  details: AIKnowledgeVectorDbDetailsState
  search: AIKnowledgeVectorDbSearchState
}
