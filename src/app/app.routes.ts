import { Routes } from '@angular/router';

import { IndexComponent } from './pessoa/index/index.component';
import { ViewComponent } from './pessoa/view/view.component';
import { CreateComponent } from './pessoa/create/create.component';
import { EditComponent } from './pessoa/edit/edit.component';

export const routes: Routes = [
{ path: '', redirectTo: 'pessoa/index', pathMatch: 'full'},
{ path: 'pessoa/index', component: IndexComponent },
{ path: 'pessoa/:pessoaId/view', component: ViewComponent },
{ path: 'pessoa/create', component: CreateComponent },
{ path: 'pessoa/:pessoaId/edit', component: EditComponent }
];