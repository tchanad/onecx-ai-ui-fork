import { bootstrapModule } from '@onecx/angular-webcomponents'
import { environment } from 'src/environments/environment'
import { OnecxAiUiModule } from './app/onecx-ai-ui-app.remote.module'

bootstrapModule(OnecxAiUiModule, 'microfrontend', environment.production)
