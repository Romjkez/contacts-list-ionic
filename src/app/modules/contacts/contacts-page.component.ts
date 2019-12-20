import { Component, OnInit } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { ContactWithId } from '../../models/contact.model';

@Component({
    selector: 'app-tab1',
    templateUrl: 'contacts-page.component.html',
    styleUrls: ['contacts-page.component.scss']
})
export class ContactsPage implements OnInit {
    contacts: Promise<ContactWithId[]>;

    constructor(private readonly contactsService: ContactsService) {
    }

    ngOnInit(): void {
        this.contacts = this.contactsService.getAll();
    }

    doRefresh(event: any): void {
        setTimeout(() => {
            this.contacts = this.contactsService.getAll();
            event.target.complete();
        }, 500);
    }
}
