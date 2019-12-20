import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactPageComponent } from './contact-page.component';
import { ByIdResolver } from '../../resolvers/by-id.resolver';


@NgModule({
    declarations: [ContactPageComponent],
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(
            [
                {path: ':id', component: ContactPageComponent, resolve: {contact: ByIdResolver}},
                {path: '', pathMatch: 'full', redirectTo: '/tabs/contacts'},
            ],
        )
    ]
})
export class ContactModule {
}
