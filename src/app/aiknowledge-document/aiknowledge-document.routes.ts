import { Routes } from '@angular/router'
import { AIKnowledgeDocumentDetailsComponent } from './pages/aiknowledge-document-details/aiknowledge-document-details.component'
import { AIKnowledgeDocumentSearchComponent } from './pages/aiknowledge-document-search/aiknowledge-document-search.component'

export const routes: Routes = [
  { path: 'details/:id', component: AIKnowledgeDocumentDetailsComponent, pathMatch: 'full' },
  { path: '', component: AIKnowledgeDocumentSearchComponent, pathMatch: 'full' }
]