import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeDocumentDetailsActions } from './aiknowledge-document-details.actions'
import { AIKnowledgeDocumentDetailsState } from './aiknowledge-document-details.state'

export const initialState: AIKnowledgeDocumentDetailsState = {
  details: undefined
}

export const aIKnowledgeDocumentDetailsReducer = createReducer(
  initialState,
  on(
    AIKnowledgeDocumentDetailsActions.aiknowledgeDocumentDetailsReceived,
    (state: AIKnowledgeDocumentDetailsState, { details }): AIKnowledgeDocumentDetailsState => ({
      ...state,
      details
    })
  ),
  on(
    AIKnowledgeDocumentDetailsActions.aiknowledgeDocumentDetailsLoadingFailed,
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
