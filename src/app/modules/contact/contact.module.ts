import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { ByIdResolver } from '../../resolvers/by-id.resolver';
import { EditFormModalComponent } from './components/edit-form-modal/edit-form-modal.component';


@NgModule({
    declarations: [ContactPageComponent, EditFormModalComponent],
    entryComponents: [EditFormModalComponent],
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
