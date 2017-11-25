import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import 'rxjs/add/operator/map';

/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class DatabaseProvider {
    private isOpen: boolean;
    private db: SQLiteObject;

    public constructor(private sqlite: SQLite) {
      console.log('Hello DatabaseProvider Provider');
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.db=db;
          this.isOpen=true;

      
          db.executeSql('create table danceMoves(name VARCHAR(32))', {})
            .then(() => console.log('Executed SQL'))
            .catch(e => console.log(e));
      
      
        })
        .catch(e => console.log(e));

        if(!this.isOpen) {
            //this.storage = new SQLite();
            this.db.openDBs({name: "data.db", location: "default"}).then(() => {
                this.db.executeSql("CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, firstname TEXT, lastname TEXT)", []);
                this.isOpen = true;
            });
        }
    }

/*     public getPeople() {
        return new Promise((resolve, reject) => {
            this.storage.executeSql("SELECT * FROM people", []).then((data) => {
                let people = [];
                if(data.rows.length > 0) {
                    for(let i = 0; i < data.rows.length; i++) {
                        people.push({
                            id: data.rows.item(i).id,
                            firstname: data.rows.item(i).firstname,
                            lastname: data.rows.item(i).lastname
                        });
                    }
                }
                resolve(people);
            }, (error) => {
                reject(error);
            });
        });
    }

    public createPerson(firstname: string, lastname: string) {
        return new Promise((resolve, reject) => {
            this.storage.executeSql("INSERT INTO people (firstname, lastname) VALUES (?, ?)", [firstname, lastname]).then((data) => {
                resolve(data);
            }, (error) => {
                reject(error);
            });
        });
    } */

}