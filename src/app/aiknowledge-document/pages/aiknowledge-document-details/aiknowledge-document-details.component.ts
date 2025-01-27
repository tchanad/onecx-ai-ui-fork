import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Action, BreadcrumbService, ObjectDetailItem } from '@onecx/portal-integration-angular'
import { map, Observable } from 'rxjs'

import { PrimeIcons } from 'primeng/api'
import { selectAIKnowledgeDocumentDetailsViewModel } from './aiknowledge-document-details.selectors'
import { AIKnowledgeDocumentDetailsViewModel } from './aiknowledge-document-details.viewmodel'
import { ActivatedRoute } from '@angular/router'
import { AIKnowledgeDocumentDetailsActions } from './aiknowledge-document-details.actions'
import { AIKnowledgeDocumentStatusEnum } from 'src/app/shared/generated'
import { FormControl, FormGroup, Validators } from '@angular/forms'

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
          value: vm.details?.name || '',
        },
        {
          label: 'DocumentRefId',
          value: vm.details?.id || '',
        },
        {
          label: 'Status',
          value: vm.details?.status || '',
        },
        //ACTION D1: Add header values here
      ]
      return labels
    })
  )

  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          titleKey: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.GENERAL.BACK',
          labelKey: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.GENERAL.BACK',
          show: 'always',
          actionCallback: () => {
            window.history.back()
          }
        },
        {
          titleKey: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.GENERAL.MORE',
          icon: PrimeIcons.ELLIPSIS_V,
          show: 'always',
          btnClass: '',
          actionCallback: () => {
            // TODO: add callback
          }
        }
      ]
      return actions
    })
  )

  public formGroup: FormGroup;
  statusValues = Object.values(AIKnowledgeDocumentStatusEnum);

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService,
    private route: ActivatedRoute
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl(null, [Validators.maxLength(255), Validators.required]),
      status: new FormControl('', [Validators.required]),
      // ACTION C3: Add form fields
    })
  }

  ngOnInit(): void {
    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_DOCUMENT_DETAILS.BREADCRUMB',
        routerLink: '/aiknowledge-document'
      }
    ]);
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.store.dispatch(AIKnowledgeDocumentDetailsActions.loadAiknowledgeDocumentDetails({ id: params['id'] }));
      }
    })
  }
}
