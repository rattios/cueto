import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.css']
})
export class SociosComponent implements OnInit {

  	public data: any;
    public filterQuery = "";
    public rowsOnPage = 5;
    public sortBy = "nombre";
    public sortOrder = "asc";
    public socios:any;

    constructor(private http: HttpClient) {
    }


    ngOnInit(): void {
    	this.http.get('http://rattios.com/24managerAPI/public/socios/servicios')
	       .toPromise()
	       .then(
	         data => { // Success
	           console.log(data);
	           this.data = data;
	           this.socios=data;
	           this.data=this.socios.socios;
	           console.log(this.socios);

	         },
	         msg => { // Error
	         	console.log(msg.error.error);

	         }
	       );
    }

    public getSocios(){
    	
    }
    public toInt(num: string) {
        return +num;
    }

    public sortByWordLength = (a: any) => {
        return a.city.length;
    }

    public remove(item) {
        let index = this.data.indexOf(item);
        if(index>-1) {
            this.data.splice(index, 1);
        }
    }

}
