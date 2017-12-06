import { Component, OnInit, AfterViewInit } from '@angular/core';
import { TableData } from '../md/md-table/md-table.component';

declare var $: any;
declare interface Task {
  title: string;
  checked: boolean;
}
@Component({
    moduleId: module.id,
    selector: 'agregarPaciente-cmp',
    templateUrl: 'agregarPaciente.component.html'
})

export class AgregarPacienteComponent implements OnInit, AfterViewInit{
    public tableData: TableData;
    public tasks1: Task[];
    public tasks2: Task[];
    public tasks3: Task[];

    ngOnInit(){

        // // Init Tags Input
        if($(".tagsinput").length != 0){
            $(".tagsinput").tagsinput();
        }
        
        $('.datepicker').datetimepicker({
            format: 'MM/DD/YYYY',
            icons: {
                time: "fa fa-clock-o",
                date: "fa fa-calendar",
                up: "fa fa-chevron-up",
                down: "fa fa-chevron-down",
                previous: 'fa fa-chevron-left',
                next: 'fa fa-chevron-right',
                today: 'fa fa-screenshot',
                clear: 'fa fa-trash',
                close: 'fa fa-remove',
                inline: true
            }
         });
        
        this.tableData = {
            headerRow: ['ID', 'Name', 'Salary', 'Country'],
            dataRows: [
                ['1', 'Dakota Rice', '$36,738', 'Niger'],
                ['2', 'Minerva Hooper', '$23,789', 'Curaçao'],
                ['3', 'Sage Rodriguez', '$56,142', 'Netherlands'],
                ['4', 'Philip Chaney', '$38,735', 'Korea, South']
            ]
         };
         this.tasks1 = [
           { title: 'Sign contract for \'What are conference organizers afraid of?\'', checked: false },
           { title: 'Lines From Great Russian Literature? Or E-mails From My Boss?', checked: true },
           {
             title: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
             checked: true
           },
           { title: 'Create 4 Invisible User Experiences you Never Knew About', checked: false }
         ];
         this.tasks2 = [
             {
                title: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
                checked: true
            },

            { title: 'Sign contract for \'What are conference organizers afraid of?\'', checked: false },
         ];
        this.tasks3 = [

           { title: 'Lines From Great Russian Literature? Or E-mails From My Boss?', checked: false },
           {
             title: 'Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit',
             checked: true
           },
           { title: 'Sign contract for \'What are conference organizers afraid of?\'', checked: false }
       ];

    }

    ngAfterViewInit(){
        //  Activate the tooltips
        $('[rel="tooltip"]').tooltip();
    }



}
