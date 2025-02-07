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
import { AIKnowledgeDocument, CreateAIKnowledgeDocument, UpdateAIKnowledgeDocument } from 'src/app/shared/generated'
import { selectUrl } from 'src/app/shared/selectors/router.selectors'
import { AIKnowledgeDocumentBffService } from '../../../shared/generated'
import { AIKnowledgeDocumentSearchActions } from './aiknowledge-document-search.actions'
import { AIKnowledgeDocumentSearchComponent } from './aiknowledge-document-search.component'
import { AIKnowledgeDocumentSearchCriteriasSchema } from './aiknowledge-document-search.parameters'
import {
  AIKnowledgeDocumentSearchSelectors,
  selectAIKnowledgeDocumentSearchViewModel
} from './aiknowledge-document-search.selectors'
import { AIKnowledgeDocumentCreateUpdateComponent } from './dialogs/aiknowledge-document-create-update/aiknowledge-document-create-update.component'

@Injectable()
export class AIKnowledgeDocumentSearchEffects {
  constructor(
    private portalDialogService: PortalDialogService,
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
          this.store.select(AIKnowledgeDocumentSearchSelectors.selectCriteria),
          this.route.queryParams
        ]),
        tap(([, criteria, queryParams]) => {
          const results = AIKnowledgeDocumentSearchCriteriasSchema.safeParse(queryParams)
          if (!results.success || !equal(criteria, results.data)) {
            const params = {
              ...criteria
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
        ofType(AIKnowledgeDocumentSearchActions.detailsButtonClicked),
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
        AIKnowledgeDocumentSearchActions.createAIKnowledgeDocumentSucceeded,
        AIKnowledgeDocumentSearchActions.updateAIKnowledgeDocumentSucceeded
      ),
      concatLatestFrom(() => this.store.select(AIKnowledgeDocumentSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  editButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeDocumentSearchActions.editAIKnowledgeDocumentButtonClicked),
      concatLatestFrom(() => this.store.select(AIKnowledgeDocumentSearchSelectors.selectResults)),
      map(([action, results]) => {
        return results.find((item) => item.id == action.id)
      }),
      mergeMap((itemToEdit) => {
        return this.portalDialogService.openDialog<AIKnowledgeDocument | undefined>(
          'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.UPDATE.HEADER',
          {
            type: AIKnowledgeDocumentCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit
              }
            }
          },
          'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.UPDATE.FORM.SAVE',
          'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.UPDATE.FORM.CANCEL',
          {
            baseZIndex: 100
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIKnowledgeDocumentSearchActions.updateAIKnowledgeDocumentCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const itemToEditId = dialogResult.result.id
        const itemToEdit = {
          aIKnowledgeDocumentData: dialogResult.result
        } as UpdateAIKnowledgeDocument
        return this.aIKnowledgeDocumentService.updateAIKnowledgeDocument(itemToEditId, itemToEdit).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.UPDATE.SUCCESS'
            })
            return AIKnowledgeDocumentSearchActions.updateAIKnowledgeDocumentSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.UPDATE.ERROR'
        })
        return of(
          AIKnowledgeDocumentSearchActions.updateAIKnowledgeDocumentFailed({
            error
          })
        )
      })
    )
  })

  createButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeDocumentSearchActions.createAIKnowledgeDocumentButtonClicked),
      switchMap(() => {
        return this.portalDialogService.openDialog<AIKnowledgeDocument | undefined>(
          'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.CREATE.HEADER',
          {
            type: AIKnowledgeDocumentCreateUpdateComponent,
            inputs: {
              vm: {
                itemToEdit: {}
              }
            }
          },
          'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.CREATE.FORM.SAVE',
          'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.CREATE.FORM.CANCEL',
          {
            baseZIndex: 100
          }
        )
      }),
      switchMap((dialogResult) => {
        if (!dialogResult || dialogResult.button == 'secondary') {
          return of(AIKnowledgeDocumentSearchActions.createAIKnowledgeDocumentCancelled())
        }
        if (!dialogResult?.result) {
          throw new Error('DialogResult was not set as expected!')
        }
        const toCreateItem = {
          aIKnowledgeDocumentData: dialogResult.result
        } as CreateAIKnowledgeDocument
        return this.aIKnowledgeDocumentService.createAIKnowledgeDocument(toCreateItem).pipe(
          map(() => {
            this.messageService.success({
              summaryKey: 'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.CREATE.SUCCESS'
            })
            return AIKnowledgeDocumentSearchActions.createAIKnowledgeDocumentSucceeded()
          })
        )
      }),
      catchError((error) => {
        this.messageService.error({
          summaryKey: 'AI_KNOWLEDGE_DOCUMENT_CREATE_UPDATE.CREATE.ERROR'
        })
        return of(
          AIKnowledgeDocumentSearchActions.createAIKnowledgeDocumentFailed({
            error
          })
        )
      })
    )
  })

  refreshSearchAfterDelete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeDocumentSearchActions.deleteAIKnowledgeDocumentSucceeded),
      concatLatestFrom(() => this.store.select(AIKnowledgeDocumentSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  deleteButtonClicked$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeDocumentSearchActions.deleteAIKnowledgeDocumentButtonClicked),
      concatLatestFrom(() => this.store.select(AIKnowledgeDocumentSearchSelectors.selectResults)),
      map(([action, results]) => {
        console.log('Action:', action)
        console.log('Results:', results)
        return results.find((item) => item.id == action.id)
      }),
      mergeMap((itemToDelete) => {
        console.log('Item to delete:', itemToDelete)
        return this.portalDialogService
          .openDialog<unknown>(
            'AI_KNOWLEDGE_DOCUMENT_DELETE.HEADER',
            'AI_KNOWLEDGE_DOCUMENT_DELETE.MESSAGE',
            {
              key: 'AI_KNOWLEDGE_DOCUMENT_DELETE.CONFIRM',
              icon: PrimeIcons.CHECK
            },
            {
              key: 'AI_KNOWLEDGE_DOCUMENT_DELETE.CANCEL',
              icon: PrimeIcons.TIMES
            }
          )
          .pipe(
            map((state): [DialogState<unknown>, AIKnowledgeDocument | undefined] => {
              console.log('Dialog STATE:', state)
              console.log('Item to delete after dialog:', itemToDelete)
              return [state, itemToDelete]
            })
          )
      }),
      switchMap(([dialogResult, itemToDelete]) => {
        console.log('Dialog result:', dialogResult)
        console.log('Item to delete after dialog:', itemToDelete)
        if (!dialogResult || dialogResult.button == 'secondary') {
          console.log('Dialog result:', dialogResult)
          console.log('Item to delete after dialog:', itemToDelete)
          return of(AIKnowledgeDocumentSearchActions.deleteAIKnowledgeDocumentCancelled())
        }
        if (!itemToDelete) {
          throw new Error('Item to delete not found!')
        }

        return this.aIKnowledgeDocumentService.deleteAIKnowledgeDocument(itemToDelete.id).pipe(
          map(() => {
            console.log('Dialog result SUCCESS:', dialogResult)
            console.log('Item to delete after dialog:', itemToDelete)
            this.messageService.success({
              summaryKey: 'AI_KNOWLEDGE_DOCUMENT_DELETE.SUCCESS'
            })
            return AIKnowledgeDocumentSearchActions.deleteAIKnowledgeDocumentSucceeded()
          }),
          catchError((error) => {
            console.log('Error:', error)
            this.messageService.error({
              summaryKey: 'AI_KNOWLEDGE_DOCUMENT_DELETE.ERROR'
            })
            return of(
              AIKnowledgeDocumentSearchActions.deleteAIKnowledgeDocumentFailed({
                error
              })
            )
          })
        )
      })
    )
  })

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIKnowledgeDocumentSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, AIKnowledgeDocumentSearchCriteriasSchema, false),
      concatLatestFrom(() => this.store.select(AIKnowledgeDocumentSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  performSearch(searchCriteria: Record<string, unknown>) {
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
          AIKnowledgeDocumentSearchActions.aIKnowledgeDocumentSearchResultsReceived({
            results,
            totalNumberOfResults
          })
        ),
        catchError((error) =>
          of(
            AIKnowledgeDocumentSearchActions.aIKnowledgeDocumentSearchResultsLoadingFailed({
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
        concatLatestFrom(() => this.store.select(AIKnowledgeDocumentSearchSelectors.selectChartVisible)),
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
        ofType(AIKnowledgeDocumentSearchActions.exportButtonClicked),
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
      action: AIKnowledgeDocumentSearchActions.aIKnowledgeDocumentSearchResultsLoadingFailed,
      key: 'AI_KNOWLEDGE_DOCUMENT_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
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