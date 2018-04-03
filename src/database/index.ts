import {
    Author,
    Book,
    Genre
} from '../models/library';
import { Collection } from 'mongodb';

export interface Database {
    Authors: Collection<Author>,
    Books: Collection<Book>,
    Genres: Collection<Genre>

}