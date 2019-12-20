export interface Contact {
    name: string;
    surname: string;
    middleName: string;
    phone: string;
    email: string;
    isFavorite: boolean;
}

export interface ContactWithId extends Contact {
    id: string;
}
