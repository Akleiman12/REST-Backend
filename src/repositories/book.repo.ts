import { Database } from '../database';
import { Book } from '../models/library';
import { ObjectId } from 'mongodb';

export class BookRepo {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    public async get(id: string): Promise <Book | null>{
        return this.db.Books.findOne({'_id': new ObjectId(id)});
    }

    public async getAll(): Promise <Book[] | null>{
        return this.db.Books.find().toArray();
    }

    public async create(data: Book): Promise <Book | null>{
        let insertion = await this.db.Books.insertOne(data);
        if(insertion.insertedId){
            return this.db.Books.findOne({'_id': new ObjectId(insertion.insertedId)});
        }
        else{
            return null;
        }
    }

    public async remove(id: string): Promise<Book | null>{
        let found: Book = await this.db.Books.findOne({'_id': new ObjectId(id)});
        if (found._id){
            this.db.Books.deleteOne({'_id': new ObjectId(found._id)});
            return found;
        }
        else{
            return null;
        }
    }

    public async update(id: string, data: Book): Promise<Book | null>{
        let updated = await this.db.Books.updateOne({'_id': new ObjectId(id)}, { $set: data });
        if(updated.matchedCount === 1){
            return this.db.Books.findOne({'_id': new ObjectId(id)});
        }
        else{
            return null
        }
    }
}