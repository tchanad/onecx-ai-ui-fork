import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { TranslateService } from '@ngx-translate/core'
import { BreadcrumbService, PortalCoreModule, UserService } from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { AIKnowledgeVectorDbDetailsComponent } from './ai-knowledge-vector-db-details.component'
import { AIKnowledgeVectorDbDetailsHarness } from './ai-knowledge-vector-db-details.harness'
import { initialState } from './ai-knowledge-vector-db-details.reducers'
import { selectAIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.selectors'
import { AIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.viewmodel'
import { ReactiveFormsModule } from '@angular/forms'

describe('AIKnowledgeVectorDbDetailsComponent', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/no-empty-function */
  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
     
    listeners.forEach((l) =>
      l({
        data: m,
        stopImmediatePropagation: () => {},
        stopPropagation: () => {}
      })
    )
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */
  /* eslint-enable @typescript-eslint/no-empty-function */

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let component: AIKnowledgeVectorDbDetailsComponent
  let fixture: ComponentFixture<AIKnowledgeVectorDbDetailsComponent>
  let store: MockStore<Store>
  let breadcrumbService: BreadcrumbService
  let AIKnowledgeVectorDbDetails: AIKnowledgeVectorDbDetailsHarness

  const mockActivatedRoute = {
    snapshot: {
      data: {}
    }
  }
  const baseAIKnowledgeVectorDbDetailsViewModel: AIKnowledgeVectorDbDetailsViewModel = {
    details: {
      id: '1',
      name: 'Test name',
      description: 'Test description',
      vdb: 'Test vdb',
      vdbCollection: 'Test vdb collection',
      aiContext: {
        appId: 'Test AppID'
      }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AIKnowledgeVectorDbDetailsComponent],
      imports: [
        PortalCoreModule,
        LetDirective,
        ReactiveFormsModule,
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        TranslateTestingModule.withTranslations('en', require('./../../../../assets/i18n/en.json')).withTranslations(
          'de',
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require('./../../../../assets/i18n/de.json')
        )
      ],
      providers: [
        provideMockStore({
          initialState: { AIKnowledgeVectorDb: { details: initialState } }
        }),
        BreadcrumbService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        provideHttpClientTesting(),
      ]
    }).compileComponents()

    const userService = TestBed.inject(UserService)
    userService.hasPermission = () => true
    const translateService = TestBed.inject(TranslateService)
    translateService.use('en')

    store = TestBed.inject(MockStore)
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, baseAIKnowledgeVectorDbDetailsViewModel)
    store.refreshState()

    fixture = TestBed.createComponent(AIKnowledgeVectorDbDetailsComponent)
    component = fixture.componentInstance
    breadcrumbService = TestBed.inject(BreadcrumbService)
    fixture.detectChanges()
    AIKnowledgeVectorDbDetails = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      AIKnowledgeVectorDbDetailsHarness
    )
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display correct breadcrumbs', async () => {
    jest.spyOn(breadcrumbService, 'setItems')

    component.ngOnInit()
    fixture.detectChanges()

    expect(breadcrumbService.setItems).toHaveBeenCalledTimes(1)
    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const searchBreadcrumbItem = await pageHeader.getBreadcrumbItem('Details')
    expect(await searchBreadcrumbItem!.getText()).toEqual('Details')
  })

  it('should display translated headers', async () => {
    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    expect(await pageHeader.getHeaderText()).toEqual('AIKnowledgeVectorDb Details')
    expect(await pageHeader.getSubheaderText()).toEqual('Display of AIKnowledgeVectorDb Details')
  })

  it('should have 2 inline actions', async () => {
    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const inlineActions = await pageHeader.getInlineActionButtons()
    expect(inlineActions.length).toBe(2)

    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    expect(backAction).toBeTruthy()

    const editAction = await pageHeader.getInlineActionButtonByLabel('Edit')
    expect(editAction).toBeTruthy()

  })

  it('should navigate back on back button click', async () => {
    jest.spyOn(window.history, 'back')

    const pageHeader = await AIKnowledgeVectorDbDetails.getHeader()
    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    await backAction?.click()

    expect(window.history.back).toHaveBeenCalledTimes(1)
  })

  it('should display item details in form fields', async () => {
    store.overrideSelector(selectAIKnowledgeVectorDbDetailsViewModel, baseAIKnowledgeVectorDbDetailsViewModel)
    store.refreshState()

    const pageDetails = component.formGroup.value
    expect(pageDetails).toEqual({
      name: 'Test name',
      description: 'Test description',
      vdb: 'Test vdb',
      vdbCollection: 'Test vdb collection'
    })
  })
})
