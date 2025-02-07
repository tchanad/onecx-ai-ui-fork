import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Action, BreadcrumbService, ObjectDetailItem } from '@onecx/portal-integration-angular'
import { map, Observable } from 'rxjs'

import { ActivatedRoute } from '@angular/router'
import { AIKnowledgeDocumentStatusEnum } from 'src/app/shared/generated'
import { selectAIKnowledgeDocumentDetailsViewModel } from './aiknowledge-document-details.selectors'
import { AIKnowledgeDocumentDetailsViewModel } from './aiknowledge-document-details.viewmodel'

@Component({
  selector: 'app-aiknowledge-document-details',
  templateUrl: './aiknowledge-document-details.component.html',
  styleUrls: ['./aiknowledge-document-details.component.scss']
})
export class AIKnowledgeDocumentDetailsComponent implements OnInit {
  viewModel$: Observable<AIKnowledgeDocumentDetailsViewModel> = this.store.select(
    selectAIKnowledgeDocumentDetailsViewModel
  )

  headerLabels$: Observable<ObjectDetailItem[]> = this.viewModel$.pipe(
    map((vm) => {
      const labels: ObjectDetailItem[] = [
        {
          label: 'Name',
          value: vm.details?.name || ''
        },
        {
          label: 'DocumentRefId',
          value: vm.details?.documentRefId || ''
        },
        {
          label: 'Status',
          value: vm.details?.status || ''
        }
      ]
      return labels
    })
  )

  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map(() => {
      const actions: Action[] = [
        {
          titleKey: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.GENERAL.BACK',
          labelKey: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.GENERAL.BACK',
          show: 'always',
          actionCallback: () => {
            window.history.back()
          }
        }
      ]
      return actions
    })
  )

  statusValues = Object.values(AIKnowledgeDocumentStatusEnum)

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.BREADCRUMB',
        routerLink: '/aiknowledge-document'
      }
    ])
  }
}
