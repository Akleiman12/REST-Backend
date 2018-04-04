import { AuthorRelated } from './authorRelated.model'
export interface Author {
    _id?: string,
    given_name?: string,
    middle_name?: string,
    last_name?: string,
    birth_date?: string,
    birth_place?: string, 
    death_date?: string,
    death_place?: string, 
    age?: number,
    links?: AuthorRelated
}