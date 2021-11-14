export interface userItem {
    id?: number,
    name?: string,
    role?: string,
    location?: string,
    birthday?: string,
    gender?: string
}

export interface userDetailItem {
    id?: number,
    name: string,
    password: string,
    role: string,
    location: string,
    birthday: string,
    gender: string,
    created?: string
}

export interface userCheckItem {
    name: string,
    password: string,
}
