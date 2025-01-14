import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { TranslateModule } from '@ngx-translate/core'
import { addInitializeModuleGuard, PortalCoreModule } from '@onecx/portal-integration-angular'
import { CalendarModule } from 'primeng/calendar'
import { SharedModule } from '../shared/shared.module'
import { aIKnowledgeDocumentFeature } from './aiknowledge-document.reducers'
import { routes } from './aiknowledge-document.routes'
import { AIKnowledgeDocumentSearchEffects } from './pages/aiknowledge-document-search/aiknowledge-document-search.effects'
import { AIKnowledgeDocumentSearchComponent } from './pages/aiknowledge-document-search/aiknowledge-document-search.component'

@NgModule({
  declarations: [AIKnowledgeDocumentSearchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    SharedModule,
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    StoreModule.forFeature(aIKnowledgeDocumentFeature),
    EffectsModule.forFeature([AIKnowledgeDocumentSearchEffects]),
    TranslateModule
  ]
})
export class AIKnowledgeDocumentModule { }
