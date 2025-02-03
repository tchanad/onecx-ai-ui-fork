import { ComponentHarness } from '@angular/cdk/testing'
import { PageHeaderHarness } from '@onecx/angular-accelerator/testing'

export class AIKnowledgeDocumentDetailsHarness extends ComponentHarness {
  static hostSelector = 'app-aiknowledge-document-details'

  getHeader = this.locatorFor(PageHeaderHarness)
}