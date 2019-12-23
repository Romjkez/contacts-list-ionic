import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, filter, first, flatMap, map, shareReplay, tap } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { ContactsService } from '../../../../services/contacts.service';
import { ContactWithId } from '../../../../models/contact.model';

@Component({
    selector: 'app-contact-page',
    templateUrl: './contact-page.component.html',
    styleUrls: ['./contact-page.component.scss'],
})
export class ContactPageComponent implements OnInit, OnDestroy {
    contact: Observable<ContactWithId>;
    form: FormGroup;
    sub: Subscription;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private readonly contactsService: ContactsService,
                private readonly toastController: ToastController) {
    }

    ngOnInit() {
        this.sub = this.router.events
            .pipe(
                filter(e => e instanceof NavigationStart),
                tap(() => this.form.disable()),
            ).subscribe();

        this.form = new FormGroup({
            name: new FormControl(null, [Validators.required]),
            middleName: new FormControl(null),
            surname: new FormControl(null),
            phone: new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
            email: new FormControl(null),
        });
        this.form.disable();

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
                    this.form.disable();
                }),
                shareReplay(1),
            );
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    onEdit() {
        this.contact.pipe(
            first(),
            filter(() => {
                if (this.form.valid) {
                    return true;
                }
                throw new Error('Form is not valid');
            }),
            flatMap(c => this.contactsService.edit(c.id, {...this.form.value, id: c.id, isFavorite: c.isFavorite})),
            tap(() => this.presentToast(`Contact '${this.form.controls.name.value} was saved!`)),
            tap(() => this.form.disable()),
            catchError(err => {
                this.presentToast(`${err}`, true);
                return of(err);
            }),
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
