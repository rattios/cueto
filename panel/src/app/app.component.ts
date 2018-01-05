import { Component, OnInit } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { NgxPermissionsService } from 'ngx-permissions';
declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  constructor(public location: Location,private permissionsService: NgxPermissionsService) {}

  ngOnInit() {
      $.material.options.autofill = true;
      $.material.init();
      const perm = ["ADMIN", "EDITOR"];

      this.permissionsService.loadPermissions(perm);
  }

    isMaps(path){
      console.log(path);
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
        return false;
      }
      else {
        return true;
      }
    }
}
