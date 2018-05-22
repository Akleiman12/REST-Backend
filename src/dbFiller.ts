import { Database } from './database'
import { ObjectID, Db } from 'mongodb';
import { Author, AuthorRelated, Book, Genre, BookRelated, GenreRelated } from './models/library';


export class DBFiller {
    private db: any;

    private authors1: string[] = [ 'Gabriel', 'Jorge', 'Fiodor', 'William', 'Franz', 'Miguel', 'George', 'Juan', 'Leon', 'Ernest', 'Jane'];
    private authors2: string[] = [ ' Garcia Marquez', ' Borges', ' Dostoyeski', ' Shakespeare', ' Kafka', ' de Cervantes', ' Orwell', ' Rulfo', ' Tolstoi', ' Hemingway', ' Austen'];

    private places: string[] = ['Caracas', 'Paris', 'Londres', 'New York', 'Miami', 'Ciudad de Mexico', 'Rio de Janeiro', 'Madrid', 'Barcelona', 'Berlin', 'Bogota', 'Hawai', 'Buenos Aires'];

    private books1: string[] = ['La muerte de ', 'Cantandole a ', 'Asesinato de ', 'Poemas para ', 'La subida de ', 'La cima de ', 'Jugando con ', 'Las mascaras de ', 'Corriendo por ', 'La caida de '];
    private books2: string[] = ['Dios', 'un vagabundo', 'Juan Manuel', 'Rocio', 'un Ruiceñor', 'la Luna', 'el Sol', 'un Rey', 'una Reina', 'el telefono', 'el perro', 'la lampara'];

    private genres: string[] = ['Aventura', 'Fantasia', 'Suspenso', 'Terror', 'Ciencia Ficcion', 'Accion', 'Romance', 'Erotico', 'Contemporaneo', 'Biografia', 'Historia', 'Documental'];

    private authorids: ObjectID[] = [];
    private booksids: ObjectID[] = []
    private genresids: ObjectID[] = []

    constructor(){
        
    }

    connect(){
    }

    async fill(db: any){
        this.db = db
        for(let i=0; i<15000; i++){
            let rand = Math.floor(Math.random()*3);
            if(rand == 0){
                await this.fillAuthor();
            }else if(rand == 1){
                await this.fillBook();
            }else if(rand == 2){
                await this.fillGenre();
            }
        }
    }

    async fillAuthor(){
        let name = this.authors1[Math.floor(Math.random()*this.authors1.length)]; 
        let midname = this.authors1[Math.floor(Math.random()*this.authors1.length)];
        let lastname = this.authors2[Math.floor(Math.random()*this.authors2.length)];
        let bplace = this.places[Math.floor(Math.random()*this.places.length)];
        let dplace = this.places[Math.floor(Math.random()*this.places.length)];

        let newAuthor = {
            given_name: name,
            middle_name: midname,
            last_name: lastname,
            birth_date: new Date(Math.random()*10000).toDateString(),
            birth_place: bplace,
            death_date: new Date(Math.random()*10000).toDateString(),
            death_place: dplace,
            age: (Math.floor((Math.random()*80)+18)),
            links: {
                genres: [],
                books: []
            } as AuthorRelated
        } as Author;

        if(this.genresids.length>1){
            for(let i=0; i<(Math.floor((Math.random()*2)+1)); i++){
                newAuthor.links.genres.push('http://localhost:3001/api/genres/'+this.genresids[Math.floor(Math.random()*this.genresids.length)].toString())
            }
        }

        if(this.booksids.length>1){
            for(let i=0; i<(Math.floor((Math.random()*2)+1)); i++){
                newAuthor.links.books.push('http://localhost:3001/api/books/'+this.booksids[Math.floor(Math.random()*this.booksids.length)].toString())
            }
        }


        await this.db.Authors.insertOne(newAuthor).then(res => {
            this.authorids.push(res.insertedId);
            console.log(res)
        })

    }

    async fillBook(){
        let title1 = this.books1[Math.floor(Math.random()*this.books1.length)]
        let title2 = this.books2[Math.floor(Math.random()*this.books2.length)]

        let newBook = {
            title: title1+title2,
            edition: Math.floor(Math.random()*5).toString(),
            year: Math.floor((Math.random()*500)+1450).toString(),
            links: {
                genres: [],
                authors: []
            } as BookRelated
        } as Book

        if(this.genresids.length>1){
            for(let i=0; i<(Math.floor((Math.random()*2)+1)); i++){
                newBook.links.genres.push('http://localhost:3001/api/genres/'+this.genresids[Math.floor(Math.random()*this.genresids.length)].toString())
            }
        }
        
        if(this.authorids.length>1){
            for(let i=0; i<(Math.floor((Math.random()*2)+1)); i++){
                newBook.links.authors.push('http://localhost:3001/api/authors/'+this.authorids[Math.floor(Math.random()*this.authorids.length)].toString())
            }
        }

        await this.db.Books.insertOne(newBook).then(res => {
            this.booksids.push(res.insertedId)
            console.log(res)
        })

        
    }

    async fillGenre(){
        let newGenre = {
            title: this.genres[Math.floor(Math.random()*this.genres.length)],
            links: {
                books: [],
                authors: []
            } as GenreRelated
        } as Genre

        if(this.genresids.length>1){
            for(let i=0; i<(Math.floor((Math.random()*2)+1)); i++){
                newGenre.links.authors.push('http://localhost:3001/api/authors/'+this.authorids[Math.floor(Math.random()*this.authorids.length)].toString())
            }
        }
        
        if(this.booksids.length>1){
            for(let i=0; i<(Math.floor((Math.random()*2)+1)); i++){
                newGenre.links.books.push('http://localhost:3001/api/books/'+this.booksids[Math.floor(Math.random()*this.booksids.length)].toString())
            }
        }


        await this.db.Genres.insertOne(newGenre).then(res =>{
            this.genresids.push(res.insertedId)
            console.log(res)
        })

    }
}