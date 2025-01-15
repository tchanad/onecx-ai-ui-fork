import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { AIKnowledgeDocument } from '../../../shared/generated'
import { aIKnowledgeDocumentFeature } from '../../aiknowledge-document.reducers'
import { initialState } from './aiknowledge-document-details.reducers'
import { AIKnowledgeDocumentDetailsViewModel } from './aiknowledge-document-details.viewmodel'

export const aIKnowledgeDocumentDetailsSelectors = createChildSelectors(
  aIKnowledgeDocumentFeature.selectDetails,
  initialState
)

export const selectAIKnowledgeDocumentDetailsViewModel = createSelector(
  aIKnowledgeDocumentDetailsSelectors.selectDetails,
  (details: AIKnowledgeDocument | undefined): AIKnowledgeDocumentDetailsViewModel => ({
    details
  })
)
