import { Component, OnInit } from '@angular/core';
import { ContactWithId } from '../../models/contact.model';
import { ContactsService } from '../../services/contacts.service';

@Component({
    selector: 'app-tab2',
    templateUrl: 'favorites-page.component.html',
    styleUrls: ['favorites-page.component.scss']
})
export class FavoritesPage implements OnInit {
    contacts: Promise<ContactWithId[]>;

    constructor(private readonly contactsService: ContactsService) {
    }

    ngOnInit(): void {
        this.contacts = this.contactsService.getFavorites();
    }

    doRefresh(event: any): void {
        setTimeout(() => {
            this.contacts = this.contactsService.getFavorites();
            event.target.complete();
        }, 500);
    }
}
