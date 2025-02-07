import { ComponentHarness } from '@angular/cdk/testing'
import { PageHeaderHarness } from '@onecx/angular-accelerator/testing'

export class AIKnowledgeVectorDbDetailsHarness extends ComponentHarness {
  static hostSelector = 'app-ai-knowledge-vector-db-details'

  getHeader = this.locatorFor(PageHeaderHarness)
}
