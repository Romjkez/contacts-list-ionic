import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'contacts',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../contacts/contacts.module').then(m => m.ContactsModule)
                    }
                ]
            },
            {
                path: 'favorites',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../favorites/favorites.module').then(m => m.Favorites)
                    }
                ]
            },
            {
                path: 'add',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../add/add.module').then(m => m.AddModule)
                    }
                ]
            },
            {
                path: 'contact',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('../contact/contact.module').then(m => m.ContactModule)
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/contacts',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/contacts',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule {
}
