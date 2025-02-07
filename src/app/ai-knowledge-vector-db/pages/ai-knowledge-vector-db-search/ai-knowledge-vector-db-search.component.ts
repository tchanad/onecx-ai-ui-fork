import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { isValidDate } from '@onecx/accelerator'
import {
  Action,
  BreadcrumbService,
  DataTableColumn,
  ExportDataService,
  RowListGridData
} from '@onecx/portal-integration-angular'
import { PrimeIcons } from 'primeng/api'
import { map, Observable } from 'rxjs'
import { AIKnowledgeVectorDbSearchActions } from './ai-knowledge-vector-db-search.actions'
import {
  AIKnowledgeVectorDbSearchCriteria,
  AIKnowledgeVectorDbSearchCriteriasSchema
} from './ai-knowledge-vector-db-search.parameters'
import { selectAIKnowledgeVectorDbSearchViewModel } from './ai-knowledge-vector-db-search.selectors'
import { AIKnowledgeVectorDbSearchViewModel } from './ai-knowledge-vector-db-search.viewmodel'

@Component({
  selector: 'app-ai-knowledge-vector-db-search',
  templateUrl: './ai-knowledge-vector-db-search.component.html',
  styleUrls: ['./ai-knowledge-vector-db-search.component.scss']
})
export class AIKnowledgeVectorDbSearchComponent implements OnInit {
  viewModel$!: Observable<AIKnowledgeVectorDbSearchViewModel> 
  headerActions$!: Observable<Action[]>
  public AIKnowledgeVectorDbSearchFormGroup!: FormGroup
  diagramColumnId = 'vdb'
  diagramColumn$!: Observable<DataTableColumn>

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public readonly locale: string,
    private readonly exportDataService: ExportDataService
  ) {}

  ngOnInit() {
    this.viewModel$ = this.store.select(selectAIKnowledgeVectorDbSearchViewModel)
    this.headerActions$ = this.viewModel$.pipe(
      map((vm) => {
        const actions: Action[] = [
          {
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.ACTION.CREATE',
            icon: PrimeIcons.PLUS,
            show: 'always',
            actionCallback: () => this.create()
          },
          {
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
            icon: PrimeIcons.DOWNLOAD,
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
            show: 'asOverflow',
            actionCallback: () => this.exportItems()
          },
          {
            labelKey: vm.chartVisible
              ? 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.HIDE_CHART'
              : 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.SHOW_CHART',
            icon: PrimeIcons.EYE,
            titleKey: vm.chartVisible
              ? 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.HIDE_CHART'
              : 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.SHOW_CHART',
            show: 'asOverflow',
            actionCallback: () => this.toggleChartVisibility()
          }
        ]
        return actions
      })
    )
    
    this.diagramColumn$ = this.viewModel$.pipe(
      map((vm) => vm.columns.find((e) => e.id === this.diagramColumnId) as DataTableColumn)
    )

    this.AIKnowledgeVectorDbSearchFormGroup = this.formBuilder.group({
      ...(Object.fromEntries(AIKnowledgeVectorDbSearchCriteriasSchema.keyof().options.map((k) => [k, null])) as Record<
        keyof AIKnowledgeVectorDbSearchCriteria,
        unknown
      >)
    } satisfies Record<keyof AIKnowledgeVectorDbSearchCriteria, unknown>)

    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.BREADCRUMB',
        routerLink: '/ai-knowledge-vector-db'
      }
    ])
    this.viewModel$.subscribe((vm) => this.AIKnowledgeVectorDbSearchFormGroup.patchValue(vm.searchCriteria))
  }

  search(formValue: FormGroup) {
    const searchCriteria = Object.entries(formValue.getRawValue()).reduce(
      (acc: Partial<AIKnowledgeVectorDbSearchCriteria>, [key, value]) => ({
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
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.searchButtonClicked({ searchCriteria }))
  }

  details({ id }: RowListGridData) {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.detailsButtonClicked({ id }))
  }

  create() {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.createAiKnowledgeVectorDbButtonClicked())
  }

  edit({ id }: RowListGridData) {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.editAiKnowledgeVectorDbButtonClicked({ id }))
  }

  delete({ id }: RowListGridData) {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.deleteAiKnowledgeVectorDbButtonClicked({ id }))
  }

  resetSearch() {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.resetButtonClicked())
  }

  exportItems() {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.exportButtonClicked())
  }

  viewModeChanged(viewMode: 'basic' | 'advanced') {
    this.store.dispatch(
      AIKnowledgeVectorDbSearchActions.viewModeChanged({
        viewMode: viewMode
      })
    )
  }

  onDisplayedColumnsChange(displayedColumns: DataTableColumn[]) {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.displayedColumnsChanged({ displayedColumns }))
  }

  toggleChartVisibility() {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.chartVisibilityToggled())
  }
}
