import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Contact } from '../models/contact.model';

@Injectable()
export class ContactsService {

  constructor(private readonly storage: Storage) {
  }

  add(contact: Contact) {

  }

  delete(id: number) {

  }
}
