import { Component, OnInit } from '@angular/core';
import { UploadService } from '../upload/upload.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  url: string;
  uploadedImages: Array<any>;
  uploadedJsons: Array<any>;
  extractedHeaders: Array<any>;
  extractedTables: Array<any>;
  fieldsHeaders: Array<any>;
  extractedFields: Array<any>;
  currentIndex: number;
  start: boolean;
  end: boolean;

  constructor(private uploadService: UploadService) {
    this.currentIndex = 0;
    this.uploadedImages = [];
    this.uploadedJsons = [];
    this.extractedHeaders = [];
    this.extractedTables = [];
    this.fieldsHeaders = ['fieldName', 'fieldProcessedValue', 'fieldRawValue'];
    this.extractedFields = [];
  }

  ngOnInit() {
    this.uploadService.currentResource.subscribe(event => {
      this.splitFiles(event);
      this.selectFile(this.currentIndex);
      this.setButtons();
    });
  }

  splitFiles(event) {
    for (let i = 0; i < event.length; i++) {
      if (event[i].name.endsWith('.json')) {
        this.uploadedJsons.push(event[i]);
      } else {
        this.uploadedImages.push(event[i]);
      }
    }
  }

  selectFile(index: number) {
    const reader = new FileReader();
    if (this.uploadedImages && this.uploadedImages[index]) {
      reader.onload = (event: any) => {
        this.url = event.target.result;
    };
      reader.readAsDataURL(this.uploadedImages[index]);
    }
    this.handleJson(index);
  }

  handleJson(index: number) {
      this.extractedTables = [];
      this.extractedHeaders = [];
      this.extractedFields = [];
      const reader = new FileReader();
      const curJsonFile = this.uploadedJsons[index];
      if (this.uploadedJsons && curJsonFile) {
        reader.onload = (event: any) => {
        const curJson = JSON.parse(event.target.result);
        const tabularFields = curJson.tabularFields;
        for (let i = 0; i < tabularFields.length; i++) {
            const headerNames = this.getHeaderNames(tabularFields[i].headers);
            const tableData = this.getTableData(headerNames, tabularFields[i].rows);
            this.extractedHeaders.push(headerNames);
            this.extractedTables.push(tableData);
        }
        this.extractedFields = curJson.nonTabularFields;

      };
        reader.readAsText(curJsonFile);
      }
  }

  getHeaderNames(headers: Array<any>) {
      const headerNames = [];
      for (let i = 0; i < headers.length; i++) {
          headerNames.push(headers[i].fieldName);
      }
      return headerNames;
  }

  getTableData(headerNames: Array<string>, rows: Array<any>) {
      const tableData = [];
      for (let i = 0; i < rows.length; i++) {
          const row = {};
          for (let j = 0; j < headerNames.length; j++) {
              row[headerNames[j]] = rows[i][j];
          }
          tableData.push(row);
      }
      return tableData;
  }

  prevFile() {
    this.currentIndex--;
    this.setButtons();
    this.selectFile(this.currentIndex);
  }

  nextFile() {
    this.currentIndex++;
    this.setButtons();
    this.selectFile(this.currentIndex);
  }

  setButtons() {
    this.start = this.currentIndex === 0;
    this.end = this.currentIndex === this.uploadedImages.length - 1;
  }
}
