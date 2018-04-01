import {ObjectID} from 'mongodb'

export interface User {
    id: ObjectID,
    name: string
}