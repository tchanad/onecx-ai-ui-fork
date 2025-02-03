import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { AIKnowledgeDocumentFeature } from '../../aiknowledge-document.reducers'
import { initialState } from './aiknowledge-document-search.reducers'
import { AIKnowledgeDocumentSearchViewModel } from './aiknowledge-document-search.viewmodel'

export const AIKnowledgeDocumentSearchSelectors = createChildSelectors(
  AIKnowledgeDocumentFeature.selectSearch,
  initialState
)

export const selectResults = createSelector(
  AIKnowledgeDocumentSearchSelectors.selectResults,
  (results): RowListGridData[] => {
    return results.map((item) => ({
      imagePath: '',
      id: item.id ? `${item.id}` : '',
      name: item.name ? `${item.name}` : '',
      documentRefId: item.documentRefId ? `${item.documentRefId}` : '',
      status: item.status ? `${item.status}` : '',
    }))
  }
)

export const selectDisplayedColumns = createSelector(
  AIKnowledgeDocumentSearchSelectors.selectColumns,
  AIKnowledgeDocumentSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (displayedColumns?.map((d) => columns.find((c) => c.id === d)).filter((d) => d) as DataTableColumn[]) ?? []
  }
)

export const selectAIKnowledgeDocumentSearchViewModel = createSelector(
  AIKnowledgeDocumentSearchSelectors.selectColumns,
  AIKnowledgeDocumentSearchSelectors.selectCriteria,
  selectResults,
  selectDisplayedColumns,
  AIKnowledgeDocumentSearchSelectors.selectViewMode,
  AIKnowledgeDocumentSearchSelectors.selectChartVisible,
  (columns, searchCriteria, results, displayedColumns, viewMode, chartVisible): AIKnowledgeDocumentSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  })
)