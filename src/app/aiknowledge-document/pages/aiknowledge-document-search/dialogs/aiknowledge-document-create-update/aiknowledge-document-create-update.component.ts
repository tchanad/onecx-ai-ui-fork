import { Component, EventEmitter, Input, OnInit } from '@angular/core'
import { DialogButtonClicked, DialogPrimaryButtonDisabled, DialogResult } from '@onecx/portal-integration-angular'

import { FormControl, FormGroup, Validators } from '@angular/forms'
import { map } from 'rxjs'
import { AIKnowledgeDocument, AIKnowledgeDocumentStatusEnum } from 'src/app/shared/generated'

import { AIKnowledgeDocumentCreateUpdateViewModel } from './aiknowledge-document-create-update.viewmodel'

@Component({
  selector: 'app-aiknowledge-document-create-update',
  templateUrl: './aiknowledge-document-create-update.component.html',
  styleUrls: ['./aiknowledge-document-create-update.component.scss']
})
export class AIKnowledgeDocumentCreateUpdateComponent
  implements
  DialogPrimaryButtonDisabled,
  DialogResult<AIKnowledgeDocument | undefined>,
  DialogButtonClicked<AIKnowledgeDocumentCreateUpdateComponent>,
  OnInit {
  @Input() public vm: AIKnowledgeDocumentCreateUpdateViewModel = {
    itemToEdit: undefined
  }

  public formGroup: FormGroup

  primaryButtonEnabled = new EventEmitter<boolean>()
  dialogResult: AIKnowledgeDocument | undefined = undefined
  statusValues = Object.values(AIKnowledgeDocumentStatusEnum)

  constructor() {
    this.formGroup = new FormGroup({
      name: new FormControl(null, [Validators.maxLength(255), Validators.required]),
      documentRefId: new FormControl(null, [Validators.maxLength(255), Validators.required]),
    })
    this.formGroup.statusChanges
      .pipe(
        map((status) => {
          return status === 'VALID'
        })
      )
      .subscribe(this.primaryButtonEnabled)
  }

  ocxDialogButtonClicked() {
    this.dialogResult = {
      ...this.vm.itemToEdit,
      ...this.formGroup.value
    }
  }

  ngOnInit() {
    if (this.vm.itemToEdit) {
      this.formGroup.patchValue({
        ...this.vm.itemToEdit
      })
    }
  }
}