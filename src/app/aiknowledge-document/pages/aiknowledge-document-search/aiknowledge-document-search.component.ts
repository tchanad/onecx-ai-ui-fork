import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { isValidDate } from '@onecx/accelerator'
import { Action, BreadcrumbService, DataTableColumn, ExportDataService } from '@onecx/portal-integration-angular'
import { PrimeIcons } from 'primeng/api'
import { map, Observable } from 'rxjs'
import { AIKnowledgeDocumentSearchActions } from './aiknowledge-document-search.actions'
import {
  AIKnowledgeDocumentSearchCriteria,
  aIKnowledgeDocumentSearchCriteriasSchema
} from './aiknowledge-document-search.parameters'
import { selectAIKnowledgeDocumentSearchViewModel } from './aiknowledge-document-search.selectors'
import { AIKnowledgeDocumentSearchViewModel } from './aiknowledge-document-search.viewmodel'

@Component({
  selector: 'app-aiknowledge-document-search',
  templateUrl: './aiknowledge-document-search.component.html',
  styleUrls: ['./aiknowledge-document-search.component.scss']
})
export class AIKnowledgeDocumentSearchComponent implements OnInit {
  viewModel$: Observable<AIKnowledgeDocumentSearchViewModel> = this.store.select(
    selectAIKnowledgeDocumentSearchViewModel
  )

  // ACTION S10: Update header actions
  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          labelKey: 'A_IKNOWLEDGE_DOCUMENT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          icon: PrimeIcons.DOWNLOAD,
          titleKey: 'A_IKNOWLEDGE_DOCUMENT_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          show: 'asOverflow',
          actionCallback: () => this.exportItems()
        },
        {
          labelKey: vm.chartVisible
            ? 'A_IKNOWLEDGE_DOCUMENT_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'A_IKNOWLEDGE_DOCUMENT_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          icon: PrimeIcons.EYE,
          titleKey: vm.chartVisible
            ? 'A_IKNOWLEDGE_DOCUMENT_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'A_IKNOWLEDGE_DOCUMENT_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          show: 'asOverflow',
          actionCallback: () => this.toggleChartVisibility()
        }
      ]
      return actions
    })
  )

  // ACTION S9: Please select the column to be displayed in the diagram
  diagramColumnId = 'id'
  diagramColumn$ = this.viewModel$.pipe(
    map((vm) => vm.columns.find((e) => e.id === this.diagramColumnId) as DataTableColumn)
  )

  public aIKnowledgeDocumentSearchFormGroup: FormGroup = this.formBuilder.group({
    ...(Object.fromEntries(aIKnowledgeDocumentSearchCriteriasSchema.keyof().options.map((k) => [k, null])) as Record<
      keyof AIKnowledgeDocumentSearchCriteria,
      unknown
    >)
  } satisfies Record<keyof AIKnowledgeDocumentSearchCriteria, unknown>)

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public readonly locale: string,
    private readonly exportDataService: ExportDataService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        titleKey: 'A_IKNOWLEDGE_DOCUMENT_SEARCH.BREADCRUMB',
        labelKey: 'A_IKNOWLEDGE_DOCUMENT_SEARCH.BREADCRUMB',
        routerLink: '/aiknowledge-document'
      }
    ])
    this.viewModel$.subscribe((vm) => this.aIKnowledgeDocumentSearchFormGroup.patchValue(vm.searchCriteria))
  }

  search(formValue: FormGroup) {
    const searchCriteria = Object.entries(formValue.getRawValue()).reduce(
      (acc: Partial<AIKnowledgeDocumentSearchCriteria>, [key, value]) => ({
        ...acc,
        [key]: isValidDate(value)
          ? new Date(
              Date.UTC(
                value.getFullYear(),
                value.getMonth(),
                value.getDate(),
                value.getHours(),
                value.getMinutes(),
                value.getSeconds()
              )
            )
          : value || undefined
      }),
      {}
    )
    this.store.dispatch(AIKnowledgeDocumentSearchActions.searchButtonClicked({ searchCriteria }))
  }

  resetSearch() {
    this.store.dispatch(AIKnowledgeDocumentSearchActions.resetButtonClicked())
  }

  exportItems() {
    this.store.dispatch(AIKnowledgeDocumentSearchActions.exportButtonClicked())
  }

  viewModeChanged(viewMode: 'basic' | 'advanced') {
    this.store.dispatch(
      AIKnowledgeDocumentSearchActions.viewModeChanged({
        viewMode: viewMode
      })
    )
  }

  onDisplayedColumnsChange(displayedColumns: DataTableColumn[]) {
    this.store.dispatch(AIKnowledgeDocumentSearchActions.displayedColumnsChanged({ displayedColumns }))
  }

  toggleChartVisibility() {
    this.store.dispatch(AIKnowledgeDocumentSearchActions.chartVisibilityToggled())
  }
}
