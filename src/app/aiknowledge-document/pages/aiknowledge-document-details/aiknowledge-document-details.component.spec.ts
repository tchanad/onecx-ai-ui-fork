import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ActivatedRoute, Router } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { Store } from '@ngrx/store'
import { MockStore, provideMockStore } from '@ngrx/store/testing'
import { TranslateService } from '@ngx-translate/core'
import { BreadcrumbService, PortalCoreModule, UserService } from '@onecx/portal-integration-angular'
import { TranslateTestingModule } from 'ngx-translate-testing'
import { PrimeIcons } from 'primeng/api'
import { Observable, of } from 'rxjs'
import { AIKnowledgeDocumentDetailsComponent } from './aiknowledge-document-details.component'
import { AIKnowledgeDocumentDetailsHarness } from './aiknowledge-document-details.harness'
import { initialState } from './aiknowledge-document-details.reducers'
import { selectAIKnowledgeDocumentDetailsViewModel } from './aiknowledge-document-details.selectors'
import { AIKnowledgeDocumentDetailsViewModel } from './aiknowledge-document-details.viewmodel'
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DialogService } from 'primeng/dynamicdialog'
import { AIKnowledgeDocumentBffService, AIKnowledgeDocumentStatusEnum } from 'src/app/shared/generated'

import { AIKnowledgeDocumentDetailsEffects } from './aiknowledge-document-details.effects';
import { PortalMessageService } from '@onecx/portal-integration-angular'
import { hot, cold } from 'jasmine-marbles'
import { EffectsModule } from '@ngrx/effects'
import { AIKnowledgeDocumentDetailsActions } from './aiknowledge-document-details.actions'

describe('AIKnowledgeDocumentDetailsComponent', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

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
        stopImmediatePropagation: () => { },
        stopPropagation: () => { }
      })
    )
  }

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let component: AIKnowledgeDocumentDetailsComponent
  let fixture: ComponentFixture<AIKnowledgeDocumentDetailsComponent>
  let store: MockStore<Store>
  let breadcrumbService: BreadcrumbService
  let aIKnowledgeDocumentDetails: AIKnowledgeDocumentDetailsHarness
  let formBuilder: FormBuilder

  const mockActivatedRoute = {
    params: of({ id: '1' }),
    snapshot: {
      data: {}
    }
  }
  const baseAIKnowledgeDocumentDetaulsViewModel: AIKnowledgeDocumentDetailsViewModel = {
    details: {
      id: '1',
      name: 'Test AI Knowledge Document 1',
      status: AIKnowledgeDocumentStatusEnum.New
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AIKnowledgeDocumentDetailsComponent],
      imports: [
        PortalCoreModule,
        LetDirective,
        TranslateTestingModule.withTranslations('en', require('./../../../../assets/i18n/en.json')).withTranslations(
          'de',
          require('./../../../../assets/i18n/de.json')
        ),
        HttpClientTestingModule,
        ReactiveFormsModule,
        FormsModule
      ],
      providers: [
        provideMockStore({
          initialState: { aIKnowledgeDocument: { details: initialState } }
        }),
        BreadcrumbService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        DialogService,
        FormBuilder
      ]
    }).compileComponents()

    const userService = TestBed.inject(UserService)
    userService.hasPermission = () => true
    const translateService = TestBed.inject(TranslateService)
    translateService.use('en')
    formBuilder = TestBed.inject(FormBuilder)

    store = TestBed.inject(MockStore)
    store.overrideSelector(selectAIKnowledgeDocumentDetailsViewModel, baseAIKnowledgeDocumentDetaulsViewModel)
    store.refreshState()

    fixture = TestBed.createComponent(AIKnowledgeDocumentDetailsComponent)
    component = fixture.componentInstance
    breadcrumbService = TestBed.inject(BreadcrumbService)
    fixture.detectChanges()
    aIKnowledgeDocumentDetails = await TestbedHarnessEnvironment.harnessForFixture(
      fixture,
      AIKnowledgeDocumentDetailsHarness
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
    const pageHeader = await aIKnowledgeDocumentDetails.getHeader()
    const searchBreadcrumbItem = await pageHeader.getBreadcrumbItem('Details')
    expect(await searchBreadcrumbItem!.getText()).toEqual('Details')
  })

  it('should display translated headers', async () => {
    const pageHeader = await aIKnowledgeDocumentDetails.getHeader()
    expect(await pageHeader.getHeaderText()).toEqual('AIKnowledgeDocument Details')
    expect(await pageHeader.getSubheaderText()).toEqual('Display of AIKnowledgeDocument Details')
  })

  it('should have 2 inline actions', async () => {
    const pageHeader = await aIKnowledgeDocumentDetails.getHeader()
    const inlineActions = await pageHeader.getInlineActionButtons()
    expect(inlineActions.length).toBe(2)

    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    expect(backAction).toBeTruthy()

    const moreAction = await pageHeader.getInlineActionButtonByIcon(PrimeIcons.ELLIPSIS_V)
    expect(moreAction).toBeTruthy()
  })

  it('should navigate back on back button click', async () => {
    jest.spyOn(window.history, 'back')

    const pageHeader = await aIKnowledgeDocumentDetails.getHeader()
    const backAction = await pageHeader.getInlineActionButtonByLabel('Back')
    await backAction?.click()

    expect(window.history.back).toHaveBeenCalledTimes(1)
  })

  it('should display item details in page header', async () => {
    component.headerLabels$ = of([
      {
        label: 'first',
        value: 'first value'
      },
      {
        label: 'second',
        value: 'second value'
      },
      {
        label: 'third',
        icon: PrimeIcons.PLUS
      },
      {
        label: 'fourth',
        value: 'fourth value',
        icon: PrimeIcons.QUESTION
      }
    ])

    const pageHeader = await aIKnowledgeDocumentDetails.getHeader()
    const objectDetails = await pageHeader.getObjectInfos()
    expect(objectDetails.length).toBe(4)

    const firstDetailItem = await pageHeader.getObjectInfoByLabel('first')
    expect(await firstDetailItem?.getLabel()).toEqual('first')
    expect(await firstDetailItem?.getValue()).toEqual('first value')
    expect(await firstDetailItem?.getIcon()).toBeUndefined()

    const secondDetailItem = await pageHeader.getObjectInfoByLabel('second')
    expect(await secondDetailItem?.getLabel()).toEqual('second')
    expect(await secondDetailItem?.getValue()).toEqual('second value')
    expect(await secondDetailItem?.getIcon()).toBeUndefined()

    const thirdDetailItem = await pageHeader.getObjectInfoByLabel('third')
    expect(await thirdDetailItem?.getLabel()).toEqual('third')
    expect(await thirdDetailItem?.getValue()).toEqual('')
    expect(await thirdDetailItem?.getIcon()).toEqual(PrimeIcons.PLUS)

    const fourthDetailItem = await pageHeader.getObjectInfoByLabel('fourth')
    expect(await fourthDetailItem?.getLabel()).toEqual('fourth')
    expect(await fourthDetailItem?.getValue()).toEqual('fourth value')
    expect(await fourthDetailItem?.getIcon()).toEqual(PrimeIcons.QUESTION)
  })

  it('should patch form value from details page', () => {
    // component.ngOnInit()
    fixture.detectChanges()

    const formGroup = component.formGroup;
    expect(formGroup.value).toEqual(
      {
        name: 'Test AI Knowledge Document 1',
        status: AIKnowledgeDocumentStatusEnum.New
      }
    )
  })
})

// Test for Effects
// describe('AIKnowledgeDocumentDetailsEffects', () => {
//   let effects: AIKnowledgeDocumentDetailsEffects;
//   let store: MockStore<Store>;
//   let aiKnowledgeDocumentService: AIKnowledgeDocumentBffService;
//   let messageService: PortalMessageService;
//   let action$: Observable<any>;
//   const mockActivatedRoute = {
//     params: of({ id: '1' }),
//     snapshot: {
//       data: {}
//     }
//   }
//   // Effects tests
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       declarations: [AIKnowledgeDocumentDetailsComponent],
//       imports: [
//         EffectsModule.forRoot([AIKnowledgeDocumentDetailsEffects]),
//         TranslateTestingModule.withTranslations('en', require('./../../../../assets/i18n/en.json')).withTranslations(
//           'de',
//           require('./../../../../assets/i18n/de.json')
//         ),
//         PortalCoreModule,
//         LetDirective,
//         HttpClientTestingModule
//       ],
//       providers: [
//         AIKnowledgeDocumentDetailsEffects,
//         provideMockStore({ initialState: { aIKnowledgeDocument: initialState } }),
//         AIKnowledgeDocumentBffService,
//         PortalMessageService,
//         { provide: ActivatedRoute, useValue: mockActivatedRoute }
//       ]
//     });
//     store = TestBed.inject(MockStore);
//     effects = TestBed.inject(AIKnowledgeDocumentDetailsEffects);
//     aiKnowledgeDocumentService = TestBed.inject(AIKnowledgeDocumentBffService);
//     messageService = TestBed.inject(PortalMessageService);

//   })

//   it('should dispatch aiKnowledgeDocumentDetailsReceived on successful load', async () => {
//     // Arrange
//     const details = { id: '1', name: 'Test AIKownledgeDocument 1', status: AIKnowledgeDocumentStatusEnum.Processing };
//     const action = AIKnowledgeDocumentDetailsActions.loadAiknowledgeDocumentDetails({ id: '1' });
//     const result = AIKnowledgeDocumentDetailsActions.aiknowledgeDocumentDetailsReceived({ details });
//     console.log('----------- RESULT: ', result)
//     console.log('----------- ACTION: ', action)
//     // Act
//     action$ = hot('-a-', { a: action });
//     const response = cold('-a|', { a: { result: details } });
//     const expected = cold('--b', { b: result });

//     // Assert
//     expect(effects.loadAIKnowledgeDocumentDetails$).toBeObservable(expected);
//   })
// })