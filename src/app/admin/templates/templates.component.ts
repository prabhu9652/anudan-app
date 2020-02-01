import { Component, OnInit } from '@angular/core';
import {Template,TemplateSection,TemplateAttribute} from '../../model/template'
import {TableData,ColumnData} from '../../model/dahsboard'
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss']
})
export class TemplatesComponent implements OnInit {

    template: Template;
    constructor(private http: HttpClient) { }

    ngOnInit() {
    }

    createTemplate(){
        this.template = new Template();
        this.template.name = "Chumma something";
        this.template.sections = [];
    }

    addSection(){
        const section = new TemplateSection();
        section.name = '';
        section.order = this._getSectionOrder();
        section.attributes = [];
        this.template.sections.push(section);
        console.log(this.template);
    }

    addAttribute(sec:TemplateSection){
        const attr = new TemplateAttribute();
        attr.name = '';
        attr.order = this._getAttributeOrder(sec);
        attr.type = '';

        sec.attributes.push(attr);
    }

    _getSectionOrder():number {
        if(this.template.sections){
            return this.template.sections.length+1;
        }else{
            return 1;
        }
    }

    _getAttributeOrder(sec:TemplateSection):number {
        if(sec.attributes){
            return sec.attributes.length+1;
        }else{
            return 1;
        }
    }

    getTabularData(attr: TemplateAttribute, data: string){
          let html = '<table width="100%" border="1"><tr>';
          const tabData = JSON.parse(data);
          html += '<td>&nbsp;</td>';
          for(let i=0; i< tabData[0].columns.length;i++){


              //if(tabData[0].columns[i].name.trim() !== ''){
                html+='<td>' + tabData[0].columns[i].name + '</td>';
              //}
          }
          html += '</tr>';
          for(let i=0; i< tabData.length;i++){

              html += '<tr><td>' + tabData[i].name + '</td>';
              for(let j=0; j < tabData[i].columns.length; j++){
                //if(tabData[i].columns[j].name.trim() !== ''){
                  html+='<td>' + tabData[i].columns[j].value + '</td>';
                //}
              }
              html += '</tr>';
          }

          html += '</table>'
          //document.getElementById('attribute_' + elemId).innerHTML = '';
          //document.getElementById('attribute_' + elemId).append('<H1>Hello</H1>');
          return html;
        }

        handleTypeChange(ev: Event,attr: TemplateAttribute){
            attr.table = '';
            if(ev.toString()==='table'){
              if(attr.table.trim() === ''){
                attr.tableValue = [];
                const data = new TableData();
                data.name = "";
                data.columns = [];

                for(let i=0; i< 5; i++){
                  const col = new ColumnData();
                  col.name = "";
                  col.value = '';
                  data.columns.push(col);
                }

                attr.tableValue.push(JSON.parse(JSON.stringify(data)));
              }
            }
        }

        addColumn(attr: TemplateAttribute){
            for(let row of attr.tableValue) {

                const col = new ColumnData();
                col.name = "";
                col.value = '';
                row.columns.push(col);
            }
        }

        addRow(attr: TemplateAttribute){
            const row = new TableData();
            row.name = '';
            row.columns = JSON.parse(JSON.stringify(attr.tableValue[0].columns));
            for(let i=0; i<row.columns.length;i++){
                row.columns[i].value = '';
            }

            attr.tableValue.push(row);
        }


        saveTemplate(){

            const httpOptions = {
                headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'X-TENANT-CODE': localStorage.getItem('X-TENANT-CODE'),
                'Authorization': localStorage.getItem('AUTH_TOKEN')
                })
            };

            const url = '/api/admin/template';
            this.http.post(url,this.template,httpOptions).subscribe();
        }

}
