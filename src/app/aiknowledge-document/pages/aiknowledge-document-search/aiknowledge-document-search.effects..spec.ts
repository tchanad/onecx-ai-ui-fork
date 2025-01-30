import { Type } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router, RouterState, RouterStateSnapshot, RoutesRecognized } from "@angular/router";
import { ROUTER_NAVIGATED, RouterNavigatedAction } from "@ngrx/router-store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { PortalMessageService, UserService } from "@onecx/angular-integration-interface";
import { url } from "inspector";
import { Observable, ReplaySubject } from "rxjs";
import { AIKnowledgeDocumentBffService } from "src/app/shared/generated";
import { AIKnowledgeDocumentSearchEffects } from "./aiknowledge-document-search.effects";
import { Action, ActionsSubject, Store, StoreModule } from "@ngrx/store";
import { ExportDataService, PortalCoreModule, PortalDialogService } from "@onecx/portal-integration-angular";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TranslateTestingModule } from "ngx-translate-testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { provideMockActions } from '@ngrx/effects/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { initialState } from './aiknowledge-document-search.reducers'
import { TranslateService } from "@ngx-translate/core";
import { selectAIKnowledgeDocumentSearchViewModel } from './aiknowledge-document-search.selectors'
import { AIKnowledgeDocumentSearchViewModel } from './aiknowledge-document-search.viewmodel'
import { aIKnowledgeDocumentSearchColumns } from './aiknowledge-document-search.columns'
import { AIKnowledgeDocumentSearchComponent } from "./aiknowledge-document-search.component";
import { AIKnowledgeDocumentSearchHarness } from "./aiknowledge-document-search.harness";
import { TestbedHarnessEnvironment } from "@onecx/angular-accelerator/testing";

// class MockRouter implements Partial<Router>{

//     effectsActions: ReplaySubject<any>;
//     events = new ReplaySubject<any>(1);
//     routerState = {
//         root: {},
//         snapshot: {
//             root: {}
//         }
//     }as RouterState;
//     routeFor = (component: Type<any>) => {
//         this.routerState!.root!.component! = component;
//     }

//     setRouterUrl = (url: string) => {
//         this.routerState!.snapshot.url = url;
//     }

//     configureNavigationUrl = (routerAction: RouterNavigatedAction, currentUrl: string, newUrl: string) => {
//         this.setRouterUrl(currentUrl)
//         routerAction.payload = {
//             event: {
//                 urlAfterRedirects: newUrl
//             }
//         } as any
//     }

//     setRouterParams = (params: any) => {
//         this.routerState!.snapshot.root.queryParams = params;
//     }

//     configureQueryParams = (routerAction: RouterNavigatedAction, routerParams: any, actionParams: any) => {
//         this.setRouterParams(routerParams);
//         routerAction.payload = {
//             routerState: {
//                 root: {
//                     queryParams: actionParams
//                 }
//             }
//         } as any
//     }

//     simulateNavigation = (routerAction: RouterNavigatedAction) => {
//         (this.events as ReplaySubject<any>).next(new RoutesRecognized(0, '', '', {} as RouterStateSnapshot));
//         this.effectsActions.next(routerAction);
//     }

//     navigate(commands: any[], extras?: NavigationExtras | undefined): Promise<boolean>{
//         const routerNavigatedAction = {
//             type: ROUTER_NAVIGATED
//         } as RouterNavigatedAction
//         routerNavigatedAction.payload = {
//             routerState: {
//                 root: {
//                     queryParams: extras?.queryParams
//                 }
//             }
//         } as any
//         this.simulateNavigation(routerNavigatedAction)
//         return Promise.resolve(true);
//     }
//     constructor(effectsActions: ReplaySubject<any>){ this.effectsActions = effectsActions}
// }

describe('AIKnowledgeDocumentSearchEffects', () => {


    // let mockedRouter: MockRouter;
    let store: MockStore<Store>;
    let component: AIKnowledgeDocumentSearchComponent
    let fixture: ComponentFixture<AIKnowledgeDocumentSearchComponent>
    let aIKnowledgeDocumentSearch: AIKnowledgeDocumentSearchHarness
    // const initialState = {}
    // let action$: Observable<Action>;
    const mockActivatedRoute = {
        snapshot: {
            data: {}
        }
    }
    const baseAIKnowledgeDocumentSearchViewModel: AIKnowledgeDocumentSearchViewModel = {
        columns: aIKnowledgeDocumentSearchColumns,
        searchCriteria: {
            id: undefined,
            name: undefined,
            status: undefined
        },
        results: [],
        displayedColumns: [],
        viewMode: 'basic',
        chartVisible: false
    }
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AIKnowledgeDocumentSearchComponent],
            imports: [
                PortalCoreModule,
                StoreModule.forRoot({}),
                TranslateTestingModule.withTranslations('en', require('./../../../../assets/i18n/en.json')).withTranslations(
                    'de',
                    require('./../../../../assets/i18n/de.json')
                ),
                HttpClientTestingModule,
                RouterTestingModule
            ],
            providers: [
                PortalDialogService,
                ExportDataService,
                AIKnowledgeDocumentBffService,
                AIKnowledgeDocumentSearchEffects,
                provideMockStore({
                    initialState: { aiKnowledgeDocument: { search: initialState } }
                }),
                { provide: ActivatedRoute, useValue: mockActivatedRoute }
            ]
        }).compileComponents()
    })

    beforeEach(async () => {
        const userService = TestBed.inject(UserService)
        userService.hasPermission = () => true
        const translateService = TestBed.inject(TranslateService)
        translateService.use('en')

        store = TestBed.inject(MockStore)
        store.overrideSelector(selectAIKnowledgeDocumentSearchViewModel, baseAIKnowledgeDocumentSearchViewModel)
        store.refreshState()

        fixture = TestBed.createComponent(AIKnowledgeDocumentSearchComponent)
        component = fixture.componentInstance
        fixture.detectChanges()
        aIKnowledgeDocumentSearch = await TestbedHarnessEnvironment.harnessForFixture(
            fixture,
            AIKnowledgeDocumentSearchHarness
        )
    })

    it('should create component', () => {
        expect(component).toBeTruthy()
    })

    // const mockedAIKnowledgeDocumentService: Partial<AIKnowledgeDocumentBffService> = {
    //     searchAIKnowledgeDocuments: jest.fn()
    // }
    // const mockedMessageService: Partial<PortalMessageService> = {
    //     error: jest.fn()
    // }
    // const mockedPortalDialogService: Partial<PortalDialogService> = {
    //     openDialog: jest.fn()
    // }

    // const mockedExportDataService: Partial<ExportDataService> = {
    //     exportCsv?: jest.fn()
    // }
    // let effectsActions: ReplaySubject<any>;

    // const initEffects = () => {
    //     return new AIKnowledgeDocumentSearchEffects(
    //         mockedPortalDialogService,
    //         effectsActions,
    //         ActivatedRouteMock as ActivatedRoute,
    //         mockedAIKnowledgeDocumentService as AIKnowledgeDocumentBffService,
    //         mockedRouter  as any,
    //         store,
    //         mockedMessageService,
    //         mockedExportDataService
    //     )
    // }
})