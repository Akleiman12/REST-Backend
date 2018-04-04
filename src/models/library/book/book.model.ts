import { BookRelated } from './bookRelated.model'
export interface Book {
    id?: string,
    title: string,
    edition: string,
    year: string, 
    links?: BookRelated
}