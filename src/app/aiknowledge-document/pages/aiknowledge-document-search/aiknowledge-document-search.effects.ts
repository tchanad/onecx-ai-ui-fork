import { Injectable, SkipSelf } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import {
  filterForNavigatedTo,
  filterOutOnlyQueryParamsChanged,
  filterOutQueryParamsHaveNotChanged
} from '@onecx/ngrx-accelerator'
import { ExportDataService, PortalMessageService } from '@onecx/portal-integration-angular'
import equal from 'fast-deep-equal'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { AIKnowledgeDocumentBffService } from '../../../shared/generated'
import { AIKnowledgeDocumentSearchActions } from './aiknowledge-document-search.actions'
import { AIKnowledgeDocumentSearchComponent } from './aiknowledge-document-search.component'
import { aIKnowledgeDocumentSearchCriteriasSchema } from './aiknowledge-document-search.parameters'
import {
  aIKnowledgeDocumentSearchSelectors,
  selectAIKnowledgeDocumentSearchViewModel
} from './aiknowledge-document-search.selectors'

@Injectable()
export class AIKnowledgeDocumentSearchEffects {
  constructor(
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private aIKnowledgeDocumentService: AIKnowledgeDocumentBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService,
    private readonly exportDataService: ExportDataService
  ) { }

  syncParamsToUrl$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          AIKnowledgeDocumentSearchActions.searchButtonClicked,
          AIKnowledgeDocumentSearchActions.resetButtonClicked
        ),
        concatLatestFrom(() => [
          this.store.select(aIKnowledgeDocumentSearchSelectors.selectCriteria),
          this.route.queryParams
        ]),
        tap(([, criteria, queryParams]) => {
          const results = aIKnowledgeDocumentSearchCriteriasSchema.safeParse(queryParams)
          if (!results.success || !equal(criteria, results.data)) {
            const params = {
              ...criteria
              //TODO: Move to docs to explain how to only put the date part in the URL in case you have date and not datetime
              //exampleDate: criteria.exampleDate?.toISOString()?.slice(0, 10)
            }
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: params,
              replaceUrl: true,
              onSameUrlNavigation: 'ignore'
            })
          }
        })
      )
    },
    { dispatch: false }
  )

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIKnowledgeDocumentSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, aIKnowledgeDocumentSearchCriteriasSchema, false),
      concatLatestFrom(() => this.store.select(aIKnowledgeDocumentSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  performSearch(searchCriteria: Record<string, any>) {
    return this.aIKnowledgeDocumentService
      .searchAIKnowledgeDocuments({
        ...Object.entries(searchCriteria).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value instanceof Date ? value.toISOString() : value
          }),
          {}
        )
      })
      .pipe(
        map(({ results, totalNumberOfResults }) =>
          AIKnowledgeDocumentSearchActions.aiknowledgeDocumentSearchResultsReceived({
            results,
            totalNumberOfResults
          })
        ),
        catchError((error) =>
          of(
            AIKnowledgeDocumentSearchActions.aiknowledgeDocumentSearchResultsLoadingFailed({
              error
            })
          )
        )
      )
  }

  rehydrateChartVisibility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIKnowledgeDocumentSearchComponent),
      filterOutOnlyQueryParamsChanged(this.router),
      map(() =>
        AIKnowledgeDocumentSearchActions.chartVisibilityRehydrated({
          visible: localStorage.getItem('aIKnowledgeDocumentChartVisibility') === 'true'
        })
      )
    )
  })

  saveChartVisibility$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIKnowledgeDocumentSearchActions.chartVisibilityToggled),
        concatLatestFrom(() => this.store.select(aIKnowledgeDocumentSearchSelectors.selectChartVisible)),
        tap(([, chartVisible]) => {
          localStorage.setItem('aIKnowledgeDocumentChartVisibility', String(chartVisible))
        })
      )
    },
    { dispatch: false }
  )

  exportData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIKnowledgeDocumentSearchActions.chartVisibilityToggled),
        concatLatestFrom(() => this.store.select(selectAIKnowledgeDocumentSearchViewModel)),
        map(([, viewModel]) => {
          this.exportDataService.exportCsv(viewModel.displayedColumns, viewModel.results, 'AIKnowledgeDocument.csv')
        })
      )
    },
    { dispatch: false }
  )

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AIKnowledgeDocumentSearchActions.aiknowledgeDocumentSearchResultsLoadingFailed,
      key: 'A_IKNOWLEDGE_DOCUMENT_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
    }
  ]

  displayError$ = createEffect(
    () => {
      return this.actions$.pipe(
        tap((action) => {
          const e = this.errorMessages.find((e) => e.action.type === action.type)
          if (e) {
            this.messageService.error({ summaryKey: e.key })
          }
        })
      )
    },
    { dispatch: false }
  )
}
