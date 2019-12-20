import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Contact, ContactWithId } from '../models/contact.model';

@Injectable()
export class ContactsService {

    constructor(private readonly storage: Storage) {
    }

    async add(contact: Contact): Promise<ContactWithId> {
        const id = Date.now().toString();
        return this.storage.set(id, {...contact, id});
    }

    async delete(id: string): Promise<any> {
        return this.storage.remove(id);
    }

    async edit(id: string, contact: ContactWithId): Promise<ContactWithId> {
        return this.storage.set(id, contact);
    }

    async get(id: string): Promise<ContactWithId> {
        return this.storage.get(id);
    }

    async getAll(): Promise<ContactWithId[]> {
        const result: ContactWithId[] = [];
        await this.storage.keys().then(keys => {
            keys.forEach(async k => {
                const contact = await this.storage.get(k);
                result.push(contact);
            });
        });
        return result;
    }

    async getFavorites(): Promise<ContactWithId[]> {
        const result: ContactWithId[] = [];
        await this.storage.keys().then(keys => {
            keys.forEach(async k => {
                const contact: ContactWithId = await this.storage.get(k);
                if (contact.isFavorite) {
                    result.push(contact);
                }
            });
        });
        return result;
    }

    async addToFavorites(id: string): Promise<any> {
        return this.storage.get(id)
            .then(c => this.storage.set(id, Object.assign(c, {isFavorite: true})));
    }

    async removeFromFavorites(id: string): Promise<any> {
        return this.storage.get(id)
            .then(c => this.storage.set(id, Object.assign(c, {isFavorite: false})));
    }
}
