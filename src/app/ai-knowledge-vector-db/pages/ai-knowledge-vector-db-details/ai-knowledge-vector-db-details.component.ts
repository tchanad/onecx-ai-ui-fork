import { Component, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Action, BreadcrumbService } from '@onecx/portal-integration-angular'
import { map, Observable } from 'rxjs'

import { PrimeIcons } from 'primeng/api'
import { selectAIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.selectors'
import { AIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.viewmodel'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AIKnowledgeVectorDbSearchActions } from '../ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.actions'

@Component({
  selector: 'app-ai-knowledge-vector-db-details',
  templateUrl: './ai-knowledge-vector-db-details.component.html',
  styleUrls: ['./ai-knowledge-vector-db-details.component.scss']
})
export class AIKnowledgeVectorDbDetailsComponent implements OnInit {
  viewModel$!: Observable<AIKnowledgeVectorDbDetailsViewModel> 
  headerActions$!: Observable<Action[]>
  public AIKnowledgeVectorDbSearchFormGroup!: FormGroup
  public formGroup: FormGroup

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl(null, [Validators.maxLength(255)]),
      description: new FormControl(null, [Validators.maxLength(255)]),
      vdb: new FormControl(null, [Validators.maxLength(255)]),
      vdbCollection: new FormControl(null, [Validators.maxLength(255)])
    })
  }

  ngOnInit(): void {
    this.viewModel$ = this.store.select(selectAIKnowledgeVectorDbDetailsViewModel)
  
    this.headerActions$ = this.viewModel$.pipe(
      map((vm) => {
        const actions: Action[] = [
          {
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.BACK',
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.BACK',
            show: 'always',
            icon: PrimeIcons.ARROW_LEFT,
            actionCallback: () => {
              window.history.back()
            }
          },
          {
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.EDIT',
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.EDIT',
            show: 'always',
            icon: PrimeIcons.PENCIL,
            actionCallback: () => {
              this.edit(vm.details?.id ?? '')
            }
          },
          {
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.DELETE',
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.DELETE',
            icon: PrimeIcons.TRASH,
            show: 'asOverflow',
            btnClass: '',
            actionCallback: () => {
              this.delete(vm.details?.id ?? '')
            }
          }
        ]
        return actions
      })
    )

    this.viewModel$.subscribe((AIKnVec) => {
      this.formGroup.patchValue({
        name: AIKnVec.details?.name ?? '',
        description: AIKnVec.details?.description,
        vdb: AIKnVec.details?.vdb,
        vdbCollection: AIKnVec.details?.vdbCollection
      })
    })

    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.BREADCRUMB',
        routerLink: '/ai-knowledge-vector-db'
      }
    ])
  }

  edit(id : string ) {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.editAiKnowledgeVectorDbButtonClicked({ id }))
  }

  delete(id : string ) {
      this.store.dispatch(AIKnowledgeVectorDbSearchActions.deleteAiKnowledgeVectorDbButtonClicked({ id }))
  }
}
