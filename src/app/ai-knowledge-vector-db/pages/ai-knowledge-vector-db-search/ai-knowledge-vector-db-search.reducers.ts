import { routerNavigatedAction, RouterNavigatedAction } from '@ngrx/router-store'
import { createReducer, on } from '@ngrx/store'
import { AIKnowledgeVectorDbSearchActions } from './ai-knowledge-vector-db-search.actions'
import { AIKnowledgeVectorDbSearchColumns } from './ai-knowledge-vector-db-search.columns'
import { AIKnowledgeVectorDbSearchCriteriasSchema } from './ai-knowledge-vector-db-search.parameters'
import { AIKnowledgeVectorDbSearchState } from './ai-knowledge-vector-db-search.state'

export const initialState: AIKnowledgeVectorDbSearchState = {
  columns: AIKnowledgeVectorDbSearchColumns,
  results: [],
  displayedColumns: null,
  viewMode: 'basic',
  chartVisible: false,
  searchLoadingIndicator: false,
  criteria: {}
}

export const AIKnowledgeVectorDbSearchReducer = createReducer(
  initialState,
  on(routerNavigatedAction, (state: AIKnowledgeVectorDbSearchState, action: RouterNavigatedAction) => {
    const results = AIKnowledgeVectorDbSearchCriteriasSchema.safeParse(action.payload.routerState.root.queryParams)
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
    AIKnowledgeVectorDbSearchActions.resetButtonClicked,
    (state: AIKnowledgeVectorDbSearchState): AIKnowledgeVectorDbSearchState => ({
      ...state,
      results: initialState.results,
      criteria: {}
    })
  ),
  on(
    AIKnowledgeVectorDbSearchActions.searchButtonClicked,
    (state: AIKnowledgeVectorDbSearchState, { searchCriteria }): AIKnowledgeVectorDbSearchState => ({
      ...state,
      searchLoadingIndicator: true,
      criteria: searchCriteria
    })
  ),
  on(
    AIKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsReceived,
    (state: AIKnowledgeVectorDbSearchState, { results }): AIKnowledgeVectorDbSearchState => ({
      ...state,
      results
    })
  ),
  on(
    AIKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsLoadingFailed,
    (state: AIKnowledgeVectorDbSearchState): AIKnowledgeVectorDbSearchState => ({
      ...state,
      results: []
    })
  ),
  on(
    AIKnowledgeVectorDbSearchActions.chartVisibilityRehydrated,
    (state: AIKnowledgeVectorDbSearchState, { visible }): AIKnowledgeVectorDbSearchState => ({
      ...state,
      chartVisible: visible
    })
  ),
  on(
    AIKnowledgeVectorDbSearchActions.chartVisibilityToggled,
    (state: AIKnowledgeVectorDbSearchState): AIKnowledgeVectorDbSearchState => ({
      ...state,
      chartVisible: !state.chartVisible
    })
  ),
  on(
    AIKnowledgeVectorDbSearchActions.viewModeChanged,
    (state: AIKnowledgeVectorDbSearchState, { viewMode }): AIKnowledgeVectorDbSearchState => ({
      ...state,
      viewMode: viewMode
    })
  ),
  on(
    AIKnowledgeVectorDbSearchActions.displayedColumnsChanged,
    (state: AIKnowledgeVectorDbSearchState, { displayedColumns }): AIKnowledgeVectorDbSearchState => ({
      ...state,
      displayedColumns: displayedColumns.map((v) => v.id)
    })
  )
)
