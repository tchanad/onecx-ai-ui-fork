import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import { filterForNavigatedTo } from '@onecx/ngrx-accelerator'
import { PortalMessageService } from '@onecx/portal-integration-angular'
import { catchError, map, of, switchMap, tap } from 'rxjs'
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
  ) {}

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
            AIKnowledgeDocumentDetailsActions.aIKnowledgeDocumentDetailsReceived({
              details: result
            })
          ),
          catchError((error) =>
            of(
              AIKnowledgeDocumentDetailsActions.aIKnowledgeDocumentDetailsLoadingFailed({
                error
              })
            )
          )
        )
      )
    )
  })

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AIKnowledgeDocumentDetailsActions.aIKnowledgeDocumentDetailsLoadingFailed,
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
