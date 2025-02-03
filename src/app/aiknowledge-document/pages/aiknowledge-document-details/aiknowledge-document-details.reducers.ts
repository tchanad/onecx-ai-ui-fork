import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeDocumentDetailsActions } from './aiknowledge-document-details.actions'
import { AIKnowledgeDocumentDetailsState } from './aiknowledge-document-details.state'

export const initialState: AIKnowledgeDocumentDetailsState = {
  details: undefined
}

export const AIKnowledgeDocumentDetailsReducer = createReducer(
  initialState,
  on(
    AIKnowledgeDocumentDetailsActions.aIKnowledgeDocumentDetailsReceived,
    (state: AIKnowledgeDocumentDetailsState, { details }): AIKnowledgeDocumentDetailsState => ({
      ...state,
      details
    })
  ),
  on(
    AIKnowledgeDocumentDetailsActions.aIKnowledgeDocumentDetailsLoadingFailed,
    (state: AIKnowledgeDocumentDetailsState): AIKnowledgeDocumentDetailsState => ({
      ...state,
      details: undefined
    })
  ),
  on(
    AIKnowledgeDocumentDetailsActions.navigatedToDetailsPage,
    (): AIKnowledgeDocumentDetailsState => ({
      ...initialState
    })
  )
)