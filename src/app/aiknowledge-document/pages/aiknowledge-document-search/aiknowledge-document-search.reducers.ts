import { routerNavigatedAction, RouterNavigatedAction } from '@ngrx/router-store'
import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeDocumentSearchActions } from './aiknowledge-document-search.actions'
import { aIKnowledgeDocumentSearchColumns } from './aiknowledge-document-search.columns'
import { aIKnowledgeDocumentSearchCriteriasSchema } from './aiknowledge-document-search.parameters'
import { AIKnowledgeDocumentSearchState } from './aiknowledge-document-search.state'

export const initialState: AIKnowledgeDocumentSearchState = {
  columns: aIKnowledgeDocumentSearchColumns,
  results: [],
  displayedColumns: null,
  viewMode: 'basic',
  chartVisible: false,
  searchLoadingIndicator: false,
  criteria: {}
}

export const aIKnowledgeDocumentSearchReducer = createReducer(
  initialState,
  on(routerNavigatedAction, (state: AIKnowledgeDocumentSearchState, action: RouterNavigatedAction) => {
    const results = aIKnowledgeDocumentSearchCriteriasSchema.safeParse(action.payload.routerState.root.queryParams)
    if (results.success) {
      return {
        ...state,
        criteria: results.data,
        searchLoadingIndicator: Object.keys(action.payload.routerState.root.queryParams).length != 0
      }
    }
    return state
  }),
  on(
    AIKnowledgeDocumentSearchActions.resetButtonClicked,
    (state: AIKnowledgeDocumentSearchState): AIKnowledgeDocumentSearchState => ({
      ...state,
      results: initialState.results,
      criteria: {}
    })
  ),
  on(
    AIKnowledgeDocumentSearchActions.searchButtonClicked,
    (state: AIKnowledgeDocumentSearchState, { searchCriteria }): AIKnowledgeDocumentSearchState => ({
      ...state,
      searchLoadingIndicator: true,
      criteria: searchCriteria
    })
  ),
  on(
    AIKnowledgeDocumentSearchActions.aiknowledgeDocumentSearchResultsReceived,
    (state: AIKnowledgeDocumentSearchState, { results }): AIKnowledgeDocumentSearchState => ({
      ...state,
      results
    })
  ),
  on(
    AIKnowledgeDocumentSearchActions.aiknowledgeDocumentSearchResultsLoadingFailed,
    (state: AIKnowledgeDocumentSearchState): AIKnowledgeDocumentSearchState => ({
      ...state,
      results: []
    })
  ),
  on(
    AIKnowledgeDocumentSearchActions.chartVisibilityRehydrated,
    (state: AIKnowledgeDocumentSearchState, { visible }): AIKnowledgeDocumentSearchState => ({
      ...state,
      chartVisible: visible
    })
  ),
  on(
    AIKnowledgeDocumentSearchActions.chartVisibilityToggled,
    (state: AIKnowledgeDocumentSearchState): AIKnowledgeDocumentSearchState => ({
      ...state,
      chartVisible: !state.chartVisible
    })
  ),
  on(
    AIKnowledgeDocumentSearchActions.viewModeChanged,
    (state: AIKnowledgeDocumentSearchState, { viewMode }): AIKnowledgeDocumentSearchState => ({
      ...state,
      viewMode: viewMode
    })
  ),
  on(
    AIKnowledgeDocumentSearchActions.displayedColumnsChanged,
    (state: AIKnowledgeDocumentSearchState, { displayedColumns }): AIKnowledgeDocumentSearchState => ({
      ...state,
      displayedColumns: displayedColumns.map((v) => v.id)
    })
  )
)
