import { Routes } from '@angular/router'
import { AIKnowledgeVectorDbDetailsComponent } from './pages/ai-knowledge-vector-db-details/ai-knowledge-vector-db-details.component'
import { AIKnowledgeVectorDbSearchComponent } from './pages/ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.component'

export const routes: Routes = [
  { path: 'details/:id', component: AIKnowledgeVectorDbDetailsComponent, pathMatch: 'full' },
  { path: '', component: AIKnowledgeVectorDbSearchComponent, pathMatch: 'full' }
]
