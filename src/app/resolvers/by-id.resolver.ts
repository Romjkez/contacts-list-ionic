import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ContactsService } from '../services/contacts.service';
import { ContactWithId } from '../models/contact.model';

@Injectable()
export class ByIdResolver implements Resolve<any> {
    constructor(private readonly contactsService: ContactsService) {
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ContactWithId> {
        return this.contactsService.get(route.paramMap.get('id'));
    }
}
