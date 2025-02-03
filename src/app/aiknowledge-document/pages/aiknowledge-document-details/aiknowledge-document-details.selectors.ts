import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { AIKnowledgeDocument } from '../../../shared/generated'
import { AIKnowledgeDocumentFeature } from '../../aiknowledge-document.reducers'
import { initialState } from './aiknowledge-document-details.reducers'
import { AIKnowledgeDocumentDetailsViewModel } from './aiknowledge-document-details.viewmodel'

export const AIKnowledgeDocumentDetailsSelectors = createChildSelectors(
  AIKnowledgeDocumentFeature.selectDetails,
  initialState
)

export const selectAIKnowledgeDocumentDetailsViewModel = createSelector(
  AIKnowledgeDocumentDetailsSelectors.selectDetails,
  (details: AIKnowledgeDocument | undefined): AIKnowledgeDocumentDetailsViewModel => ({
    details
  })
)