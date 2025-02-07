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
import {
  DialogState,
  ExportDataService,
  PortalDialogService,
  PortalMessageService
} from '@onecx/portal-integration-angular'
import equal from 'fast-deep-equal'
import { PrimeIcons } from 'primeng/api'
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs'
import {
  AIKnowledgeVectorDb,
  CreateAIKnowledgeVectorDb,
  UpdateAIKnowledgeVectorDb
} from 'src/app/shared/generated'
import { selectUrl } from 'src/app/shared/selectors/router.selectors'
import { AIKnowledgeVectorDbBffService } from '../../../shared/generated'
import { AIKnowledgeVectorDbSearchActions } from './ai-knowledge-vector-db-search.actions'
import { AIKnowledgeVectorDbSearchComponent } from './ai-knowledge-vector-db-search.component'
import { AIKnowledgeVectorDbSearchCriteriasSchema } from './ai-knowledge-vector-db-search.parameters'
import {
  AIKnowledgeVectorDbSearchSelectors,
  selectAIKnowledgeVectorDbSearchViewModel
} from './ai-knowledge-vector-db-search.selectors'
import { AIKnowledgeVectorDbCreateUpdateComponent } from './dialogs/ai-knowledge-vector-db-create-update/ai-knowledge-vector-db-create-update.component'

@Injectable()
export class AIKnowledgeVectorDbSearchEffects {
  constructor(
    private portalDialogService: PortalDialogService,
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private AIKnowledgeVectorDbService: AIKnowledgeVectorDbBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService,
    private readonly exportDataService: ExportDataService
  ) {}

  syncParamsToUrl$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          AIKnowledgeVectorDbSearchActions.searchButtonClicked,
          AIKnowledgeVectorDbSearchActions.resetButtonClicked
        ),
        concatLatestFrom(() => [
          this.store.select(AIKnowledgeVectorDbSearchSelectors.selectCriteria),
          this.route.queryParams
        ]),
        tap(([, criteria, queryParams]) => {
          const results = AIKnowledgeVectorDbSearchCriteriasSchema.safeParse(queryParams)
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

  detailsButtonClicked$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIKnowledgeVectorDbSearchActions.detailsButtonClicked),
        concatLatestFrom(() => this.store.select(selectUrl)),
        tap(([action, currentUrl]) => {
          const urlTree = this.router.parseUrl(currentUrl)
          urlTree.queryParams = {}
          urlTree.fragment = null
          this.router.navigate([urlTree.toString(), 'details', action.id])
        })
      )
    },
    { dispatch: false }
  )

  refreshSearchAfterCreateUpdate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        AIKnowledgeVectorDbSearchActions.createAiKnowledgeVectorDbSucceeded,
        AIKnowledgeVectorDbSearchActions.updateAiKnowledgeVectorDbSucceeded
      ),
      concatLatestFrom(() => this.store.select(AIKnowledgeVectorDbSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  editButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeVectorDbSearchActions.editAiKnowledgeVectorDbButtonClicked),
      concatLatestFrom(() => this.store.select(AIKnowledgeVectorDbSearchSelectors.selectResults)),
      map(([action, results]) => {
        return results.find((item) => item.id == action.id)
      }),
      mergeMap((itemToEdit) => {
        return this.portalDialogService.openDialog<AIKnowledgeVectorDb | undefined>(
          'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.UPDATE.HEADER',
          {
            type: AIKnowledgeVectorDbCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit
              }
            }
          },
          'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.UPDATE.FORM.SAVE',
          'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.UPDATE.FORM.CANCEL',
          {
            baseZIndex: 100
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIKnowledgeVectorDbSearchActions.updateAiKnowledgeVectorDbCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const itemToEditId = dialogResult.result.id
        const itemToEdit = {
          dataObject: dialogResult.result
        } as UpdateAIKnowledgeVectorDb
        return this.AIKnowledgeVectorDbService.updateAIKnowledgeVectorDb(itemToEditId, itemToEdit).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.UPDATE.SUCCESS'
            })
            return AIKnowledgeVectorDbSearchActions.updateAiKnowledgeVectorDbSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.UPDATE.ERROR'
        })
        return of(
          AIKnowledgeVectorDbSearchActions.updateAiKnowledgeVectorDbFailed({
            error
          })
        )
      })
    )
  })

  createButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeVectorDbSearchActions.createAiKnowledgeVectorDbButtonClicked),
      switchMap(() => {
        return this.portalDialogService.openDialog<AIKnowledgeVectorDb | undefined>(
          'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.CREATE.HEADER',
          {
            type: AIKnowledgeVectorDbCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit: {}
              }
            }
          },
          'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.CREATE.FORM.SAVE',
          'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.CREATE.FORM.CANCEL',
          {
            baseZIndex: 100
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIKnowledgeVectorDbSearchActions.createAiKnowledgeVectorDbCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const toCreateItem = {
          dataObject: dialogResult.result
        } as CreateAIKnowledgeVectorDb
        return this.AIKnowledgeVectorDbService.createAIKnowledgeVectorDb(toCreateItem).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.CREATE.SUCCESS'
            })
            return AIKnowledgeVectorDbSearchActions.createAiKnowledgeVectorDbSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_KNOWLEDGE_VECTOR_DB_CREATE_UPDATE.CREATE.ERROR'
        })
        return of(
          AIKnowledgeVectorDbSearchActions.createAiKnowledgeVectorDbFailed({
            error
          })
        )
      })
    )
  })

  refreshSearchAfterDelete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeVectorDbSearchActions.deleteAiKnowledgeVectorDbSucceeded),
      concatLatestFrom(() => this.store.select(AIKnowledgeVectorDbSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  deleteButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeVectorDbSearchActions.deleteAiKnowledgeVectorDbButtonClicked),
      concatLatestFrom(() => this.store.select(AIKnowledgeVectorDbSearchSelectors.selectResults)),
      map(([action, results]) => {
        return results.find((item) => item.id == action.id)
      }),
      mergeMap((itemToDelete) => {
        return this.portalDialogService
          .openDialog<unknown>(
            'AI_KNOWLEDGE_VECTOR_DB_DELETE.HEADER',
            'AI_KNOWLEDGE_VECTOR_DB_DELETE.MESSAGE',
            {
              key: 'AI_KNOWLEDGE_VECTOR_DB_DELETE.CONFIRM',
              icon: PrimeIcons.CHECK
            },
            {
              key: 'AI_KNOWLEDGE_VECTOR_DB_DELETE.CANCEL',
              icon: PrimeIcons.TIMES
            }
          )
          .pipe(
            map((state): [DialogState<unknown>, AIKnowledgeVectorDb | undefined] => {
              return [state, itemToDelete]
            })
          )
      }),
      switchMap(([dialogResult, itemToDelete]) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIKnowledgeVectorDbSearchActions.deleteAiKnowledgeVectorDbCancelled())
        }
        if (!itemToDelete) {
          throw new Error('Item to delete not found!')
        }

        return this.AIKnowledgeVectorDbService.deleteAIKnowledgeVectorDb(itemToDelete.id).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_KNOWLEDGE_VECTOR_DB_DELETE.SUCCESS'
            })
            return AIKnowledgeVectorDbSearchActions.deleteAiKnowledgeVectorDbSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_KNOWLEDGE_VECTOR_DB_DELETE.ERROR'
        })
        return of(
          AIKnowledgeVectorDbSearchActions.deleteAiKnowledgeVectorDbFailed({
            error
          })
        )
      })
    )
  })

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIKnowledgeVectorDbSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, AIKnowledgeVectorDbSearchCriteriasSchema, false),
      concatLatestFrom(() => this.store.select(AIKnowledgeVectorDbSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  performSearch(searchCriteria: Record<string, any>) {
    return this.AIKnowledgeVectorDbService
      .searchAIKnowledgeVectorDbs({
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
          AIKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsReceived({
            results,
            totalNumberOfResults
          })
        ),
        catchError((error) =>
          of(
            AIKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsLoadingFailed({
              error
            })
          )
        )
      )
  }

  rehydrateChartVisibility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIKnowledgeVectorDbSearchComponent),
      filterOutOnlyQueryParamsChanged(this.router),
      map(() =>
        AIKnowledgeVectorDbSearchActions.chartVisibilityRehydrated({
          visible: localStorage.getItem('AIKnowledgeVectorDbChartVisibility') === 'true'
        })
      )
    )
  })

  saveChartVisibility$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIKnowledgeVectorDbSearchActions.chartVisibilityToggled),
        concatLatestFrom(() => this.store.select(AIKnowledgeVectorDbSearchSelectors.selectChartVisible)),
        tap(([, chartVisible]) => {
          localStorage.setItem('AIKnowledgeVectorDbChartVisibility', String(chartVisible))
        })
      )
    },
    { dispatch: false }
  )

  exportData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AIKnowledgeVectorDbSearchActions.exportButtonClicked),
        concatLatestFrom(() => this.store.select(selectAIKnowledgeVectorDbSearchViewModel)),
        map(([, viewModel]) => {
          this.exportDataService.exportCsv(viewModel.displayedColumns, viewModel.results, 'AIKnowledgeVectorDb.csv')
        })
      )
    },
    { dispatch: false }
  )

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AIKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsLoadingFailed,
      key: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
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
