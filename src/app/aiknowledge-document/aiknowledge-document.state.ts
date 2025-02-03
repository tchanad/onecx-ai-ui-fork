import { AIKnowledgeDocumentDetailsState } from './pages/aiknowledge-document-details/aiknowledge-document-details.state'
import { AIKnowledgeDocumentSearchState } from './pages/aiknowledge-document-search/aiknowledge-document-search.state'
export interface AIKnowledgeDocumentState {
  details: AIKnowledgeDocumentDetailsState

  search: AIKnowledgeDocumentSearchState
}