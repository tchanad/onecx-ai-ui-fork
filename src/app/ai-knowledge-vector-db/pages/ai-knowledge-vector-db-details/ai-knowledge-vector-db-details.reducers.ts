import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeVectorDbDetailsActions } from './ai-knowledge-vector-db-details.actions'
import { AIKnowledgeVectorDbDetailsState } from './ai-knowledge-vector-db-details.state'

export const initialState: AIKnowledgeVectorDbDetailsState = {
  details: undefined
}

export const AIKnowledgeVectorDbDetailsReducer = createReducer(
  initialState,
  on(
    AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsReceived,
    (state: AIKnowledgeVectorDbDetailsState, { details }): AIKnowledgeVectorDbDetailsState => ({
      ...state,
      details
    })
  ),
  on(
    AIKnowledgeVectorDbDetailsActions.aiKnowledgeVectorDbDetailsLoadingFailed,
    (state: AIKnowledgeVectorDbDetailsState): AIKnowledgeVectorDbDetailsState => ({
      ...state,
      details: undefined
    })
  ),
  on(
    AIKnowledgeVectorDbDetailsActions.navigatedToDetailsPage,
    (): AIKnowledgeVectorDbDetailsState => ({
      ...initialState
    })
  )
)
