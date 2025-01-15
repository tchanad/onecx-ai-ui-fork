import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { aIKnowledgeDocumentFeature } from '../../aiknowledge-document.reducers'
import { initialState } from './aiknowledge-document-search.reducers'
import { AIKnowledgeDocumentSearchViewModel } from './aiknowledge-document-search.viewmodel'

export const aIKnowledgeDocumentSearchSelectors = createChildSelectors(
  aIKnowledgeDocumentFeature.selectSearch,
  initialState
)

export const selectResults = createSelector(
  aIKnowledgeDocumentSearchSelectors.selectResults,
  (results): RowListGridData[] => {
    return results.map((item) => ({
      imagePath: '',
      id: item.id ? `${item.id}` : '',
      name: item.name ? `${item.name}` : '',
      status: item.status ? `${item.status}` : '',
      // ...item
      // ACTION S7: Here you can create a mapping of the items and their corresponding translation strings
    }))
  }
)

export const selectDisplayedColumns = createSelector(
  aIKnowledgeDocumentSearchSelectors.selectColumns,
  aIKnowledgeDocumentSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (displayedColumns?.map((d) => columns.find((c) => c.id === d)).filter((d) => d) as DataTableColumn[]) ?? []
  }
)

export const selectAIKnowledgeDocumentSearchViewModel = createSelector(
  aIKnowledgeDocumentSearchSelectors.selectColumns,
  aIKnowledgeDocumentSearchSelectors.selectCriteria,
  selectResults,
  selectDisplayedColumns,
  aIKnowledgeDocumentSearchSelectors.selectViewMode,
  aIKnowledgeDocumentSearchSelectors.selectChartVisible,
  (columns, searchCriteria, results, displayedColumns, viewMode, chartVisible): AIKnowledgeDocumentSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  })
)
