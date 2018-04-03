import { Database } from '../database';
import { Author } from '../models/library';
import { ObjectId } from 'mongodb';

export class AuthorRepo {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    public async get(id: string): Promise <Author | null>{
        return this.db.Authors.findOne({'_id': new ObjectId(id)});
    }

    public async getAll(): Promise <Author[] | null>{
        return this.db.Authors.find().toArray();
    }

    public async create(data: Author): Promise <Author | null>{
        let insertion = await this.db.Authors.insertOne(data);
        if(insertion.insertedId){
            return this.db.Authors.findOne({'_id': new ObjectId(insertion.insertedId)});
        }
        else{
            return null;
        }
    }

    public async remove(id: string): Promise<Author | null>{
        let found = await this.db.Authors.findOne({'_id': new ObjectId(id)});
        if (found.id){
            this.db.Authors.deleteOne({'_id': new ObjectId(found.id)});
            return found;
        }
        else{
            return null;
        }
    }

    public async update(id: string, data: Author): Promise<Author | null>{
        let updated = await this.db.Authors.updateOne({'_id': new ObjectId(id)}, data);
        if(updated.matchedCount === 1){
            return this.db.Authors.findOne({'_id': new ObjectId(id)});
        }
        else{
            return null
        }
    }
}