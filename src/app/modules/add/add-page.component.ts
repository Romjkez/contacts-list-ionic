import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact } from '../../models/contact.model';
import { ContactsService } from '../../services/contacts.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
    selector: 'app-add-page',
    templateUrl: 'add-page.component.html',
    styleUrls: ['add-page.component.scss']
})
export class AddPage implements OnInit {
    form: FormGroup;

    constructor(private readonly contactsService: ContactsService,
                private readonly toastController: ToastController,
                private router: Router) {
    }

    ngOnInit(): void {
        this.form = new FormGroup({
            name: new FormControl(null, [Validators.required]),
            middleName: new FormControl(null),
            surname: new FormControl(null),
            phone: new FormControl(null, [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
            email: new FormControl(null),
        });
    }

    onAdd() {
        const contact: Contact = {...this.form.value, isFavorite: false};
        return this.contactsService.add(contact)
            .then(() => {
                this.form.reset();
                return this.router.navigate(['/tabs/contacts']);
            })
            .then(() => this.presentToast(`Contact ${contact.name} was saved!`))
            .catch(err => this.presentToast(`Error: ${err}`, true));
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
