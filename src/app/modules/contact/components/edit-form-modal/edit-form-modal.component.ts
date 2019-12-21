import { Component, Input, OnInit } from '@angular/core';
import { ContactWithId } from '../../../../models/contact.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-edit-form-modal',
    templateUrl: './edit-form-modal.component.html',
    styleUrls: ['./edit-form-modal.component.scss'],
})
export class EditFormModalComponent implements OnInit {
    @Input() contact: ContactWithId;
    form: FormGroup = new FormGroup({});

    constructor(private modalController: ModalController) {
    }

    ngOnInit() {
        this.form = new FormGroup({
            name: new FormControl(this.contact.name, [Validators.required]),
            middleName: new FormControl(this.contact.middleName),
            surname: new FormControl(this.contact.surname),
            phone: new FormControl(this.contact.phone, [Validators.required, Validators.maxLength(20), Validators.minLength(3)]),
            email: new FormControl(this.contact.email),
        });
    }

    close() {
        this.modalController.dismiss();
    }

}
