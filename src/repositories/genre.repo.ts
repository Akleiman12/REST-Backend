import { Database } from '../database';
import { Genre } from '../models/library';
import { ObjectId } from 'mongodb';

export class GenreRepo {
    private db: Database;

    constructor(db: Database){
        this.db = db;
    }

    public async get(id: string): Promise <Genre | null>{
        return this.db.Genres.findOne({'_id': new ObjectId(id)});
    }

    public async getAll(): Promise <Genre[] | null>{
        return this.db.Genres.find().toArray();
    }

    public async create(data: Genre): Promise <Genre | null>{
        let insertion = await this.db.Genres.insertOne(data);
        if(insertion.insertedId){
            return this.db.Genres.findOne({'_id': new ObjectId(insertion.insertedId)});
        }
        else{
            return null;
        }
    }

    public async remove(id: string): Promise<Genre | null>{
        let found = await this.db.Genres.findOne({'_id': new ObjectId(id)});
        if (found._id){
            this.db.Genres.deleteOne({'_id': new ObjectId(found._id)});
            return found;
        }
        else{
            return null;
        }
    }

    public async update(id: string, data: Genre): Promise<Genre | null>{
        let updated = await this.db.Genres.updateOne({'_id': new ObjectId(id)}, { $set: data });
        if(updated.matchedCount === 1){
            return this.db.Genres.findOne({'_id': new ObjectId(id)});
        }
        else{
            return null
        }
    }
}