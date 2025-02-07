 
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { BreadcrumbService, PortalCoreModule } from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { AIKnowledgeDocumentCreateUpdateComponent } from './aiknowledge-document-create-update.component'

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

describe('AIKnowledgeDocumentCreateUpdateComponent', () => {
  let component: AIKnowledgeDocumentCreateUpdateComponent
  let fixture: ComponentFixture<AIKnowledgeDocumentCreateUpdateComponent>

  const mockActivatedRoute = {}

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AIKnowledgeDocumentCreateUpdateComponent],
      imports: [
        PortalCoreModule,
        FormsModule,
        ReactiveFormsModule,
        LetDirective,
        TranslateTestingModule.withTranslations(
          'en',
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('./../../../../../../assets/i18n/en.json')
          // eslint-disable-next-line @typescript-eslint/no-require-imports
        ).withTranslations('de', require('./../../../../../../assets/i18n/de.json')),
        HttpClientTestingModule
      ],
      providers: [BreadcrumbService, { provide: ActivatedRoute, useValue: mockActivatedRoute }]
    }).compileComponents()

    fixture = TestBed.createComponent(AIKnowledgeDocumentCreateUpdateComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})