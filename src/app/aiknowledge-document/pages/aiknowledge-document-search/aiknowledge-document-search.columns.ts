import { ColumnType, DataTableColumn } from '@onecx/angular-accelerator'

export const aIKnowledgeDocumentSearchColumns: DataTableColumn[] = [{
    id: 'name',
    columnType: ColumnType.STRING,
    nameKey: 'A_IKNOWLEDGE_DOCUMENT_SEARCH.COLUMNS.NAME',
    filterable: true,
    sortable: true,
    predefinedGroupKeys: [
        'A_IKNOWLEDGE_DOCUMENT_SEARCH.PREDEFINED_GROUP.DEFAULT',
        'A_IKNOWLEDGE_DOCUMENT_SEARCH.PREDEFINED_GROUP.EXTENDED',
        'A_IKNOWLEDGE_DOCUMENT_SEARCH.PREDEFINED_GROUP.FULL',
    ],
}]
// ACTION S6: Define search results columns
