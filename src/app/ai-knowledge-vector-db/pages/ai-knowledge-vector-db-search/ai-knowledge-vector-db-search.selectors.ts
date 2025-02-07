import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { AIKnowledgeVectorDbFeature } from '../../ai-knowledge-vector-db.reducers'
import { initialState } from './ai-knowledge-vector-db-search.reducers'
import { AIKnowledgeVectorDbSearchViewModel } from './ai-knowledge-vector-db-search.viewmodel'

export const AIKnowledgeVectorDbSearchSelectors = createChildSelectors(
  AIKnowledgeVectorDbFeature.selectSearch,
  initialState
)

export const selectResults = createSelector(
  AIKnowledgeVectorDbSearchSelectors.selectResults,
  (results): RowListGridData[] => {
    return results.map((item) => ({
      imagePath: '',
      id: item.id,
      name: item.name,
      description: item.description,
      vdb: item.vdb,
      vdbCollection: item.vdbCollection
    }))
  }
)

export const selectDisplayedColumns = createSelector(
  AIKnowledgeVectorDbSearchSelectors.selectColumns,
  AIKnowledgeVectorDbSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (displayedColumns?.map((d) => columns.find((c) => c.id === d)).filter((d) => d) as DataTableColumn[]) ?? []
  }
)

export const selectAIKnowledgeVectorDbSearchViewModel = createSelector(
  AIKnowledgeVectorDbSearchSelectors.selectColumns,
  AIKnowledgeVectorDbSearchSelectors.selectCriteria,
  selectResults,
  selectDisplayedColumns,
  AIKnowledgeVectorDbSearchSelectors.selectViewMode,
  AIKnowledgeVectorDbSearchSelectors.selectChartVisible,
  (columns, searchCriteria, results, displayedColumns, viewMode, chartVisible): AIKnowledgeVectorDbSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  })
)
