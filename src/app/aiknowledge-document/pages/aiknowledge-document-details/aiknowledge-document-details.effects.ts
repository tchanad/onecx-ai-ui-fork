import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import { filterForNavigatedTo } from '@onecx/ngrx-accelerator'
import { PortalMessageService } from '@onecx/portal-integration-angular'
import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs'
import { selectRouteParam } from 'src/app/shared/selectors/router.selectors'
import { AIKnowledgeDocumentBffService } from '../../../shared/generated'
import { AIKnowledgeDocumentDetailsActions } from './aiknowledge-document-details.actions'
import { AIKnowledgeDocumentDetailsComponent } from './aiknowledge-document-details.component'

@Injectable()
export class AIKnowledgeDocumentDetailsEffects {
  constructor(
    private actions$: Actions,
    private aIKnowledgeDocumentService: AIKnowledgeDocumentBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService
  ) { }

  navigatedToDetailsPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AIKnowledgeDocumentDetailsComponent),
      concatLatestFrom(() => this.store.select(selectRouteParam('id'))),
      map(([, id]) => {
        return AIKnowledgeDocumentDetailsActions.navigatedToDetailsPage({
          id
        })
      })
    )
  })

  loadAIKnowledgeDocumentById$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AIKnowledgeDocumentDetailsActions.navigatedToDetailsPage),
      switchMap(({ id }) =>
        this.aIKnowledgeDocumentService.getAIKnowledgeDocumentById(id ?? '').pipe(
          map(({ result }) =>
            AIKnowledgeDocumentDetailsActions.aiknowledgeDocumentDetailsReceived({
              details: result
            })
          ),
          catchError((error) =>
            of(
              AIKnowledgeDocumentDetailsActions.aiknowledgeDocumentDetailsLoadingFailed({
                error
              })
            )
          )
        )
      )
    )
  })

  loadAIKnowledgeDocumentDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AIKnowledgeDocumentDetailsActions.loadAiknowledgeDocumentDetails),
      tap(() => console.log('Loading AIKnowledgeDocument details...')),
      mergeMap((action) =>
        this.aIKnowledgeDocumentService.getAIKnowledgeDocumentById(action.id).pipe(
          map((response) => {
            console.log('AIKnowledgeDocument details loaded:', response.result);
            return AIKnowledgeDocumentDetailsActions.aiknowledgeDocumentDetailsReceived({
              details: response.result,
            });
          }),
          catchError((error) => {
            console.log('Error loading AIKnowledgeDocument details:', error);
            return of(
              AIKnowledgeDocumentDetailsActions.aiknowledgeDocumentDetailsLoadingFailed({
                error: error.message,
              })
            );
          })
        )
      )
    )
  )

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AIKnowledgeDocumentDetailsActions.aiknowledgeDocumentDetailsLoadingFailed,
      key: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.ERROR_MESSAGES.DETAILS_LOADING_FAILED'
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
