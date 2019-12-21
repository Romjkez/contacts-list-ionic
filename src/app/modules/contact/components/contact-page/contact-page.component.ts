import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { catchError, first, flatMap, map, shareReplay, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { ContactsService } from '../../../../services/contacts.service';
import { ContactWithId } from '../../../../models/contact.model';
import { EditFormModalComponent } from '../edit-form-modal/edit-form-modal.component';

@Component({
    selector: 'app-contact-page',
    templateUrl: './contact-page.component.html',
    styleUrls: ['./contact-page.component.scss'],
})
export class ContactPageComponent implements OnInit {
    contact: Observable<ContactWithId>;
    form: FormGroup;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private readonly contactsService: ContactsService,
                private readonly toastController: ToastController,
                private readonly modalController: ModalController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(null, [Validators.required]),
            middleName: new FormControl(null),
            surname: new FormControl(null),
            phone: new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
            email: new FormControl(null),
        });

        this.contact = this.route.data
            .pipe(
                map(data => data.contact),
                tap(contact => {
                    this.form = new FormGroup({
                        name: new FormControl(contact.name, [Validators.required]),
                        middleName: new FormControl(contact.middleName),
                        surname: new FormControl(contact.surname),
                        phone: new FormControl(contact.phone, [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
                        email: new FormControl(contact.email),
                    });
                }),
                shareReplay(1),
            );
    }

    onEdit() {
        this.contact.pipe(
            flatMap(c => this.contactsService.edit(c.id, this.form.value)),
            tap(() => this.presentToast(`Contact '${this.form.controls.name.value} was saved!`)),
            catchError(err => {
                this.presentToast(`Error: ${err}`, true);
                return of(err);
            })
        ).subscribe();
    }

    onRemove(): void {
        this.contact.pipe(
            flatMap(c => this.contactsService.delete(c.id)),
            tap(() => this.presentToast(`Contact successfully deleted!`)),
            tap(() => this.router.navigate(['tabs', 'contacts'])),
            catchError(err => {
                this.presentToast(`Error: ${err}`, true);
                return of(err);
            }),
        ).subscribe();
    }

    onAddToFavorites() {
        this.contact.pipe(
            first(),
            tap(c => c.isFavorite = true),
            flatMap(c => this.contactsService.addToFavorites(c.id)),
            tap(() => this.presentToast(`Successfully marked as favorite!`)),
            catchError(err => {
                this.presentToast(`Error: ${err}`, true);
                return of(err);
            }),
        ).subscribe();
    }

    onRemoveFromFavorites() {
        this.contact.pipe(
            first(),
            tap(c => c.isFavorite = false),
            flatMap(c => this.contactsService.removeFromFavorites(c.id)),
            tap(() => this.presentToast(`Successfully removed from favorites!`)),
            catchError(err => {
                this.presentToast(`Error: ${err}`, true);
                return of(err);
            }),
        ).subscribe();
    }

    presentModal() {
        let modal: any;
        this.contact.pipe(
            flatMap(c => from(this.modalController.create({
                componentProps: c,
                component: EditFormModalComponent,
            }))),
            tap(m => modal = m),
            flatMap(() => from(modal.present())),
        ).subscribe();
    }

    private async presentToast(text: string, isError?: boolean): Promise<any> {
        const toast = await this.toastController.create({
            message: text,
            duration: 2000,
            showCloseButton: true,
            color: isError ? 'danger' : 'success',
        });
        await toast.present();
    }
}
