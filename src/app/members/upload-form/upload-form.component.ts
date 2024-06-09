import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { AccountService } from '../../Services/account.service';
import { User } from '../../Model/user';
import { take } from 'rxjs';
import { Photo } from '../../Model/photo';

@Component({
  selector: 'app-upload-form',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.css'
})
export class UploadFormComponent {
  outputBoxVisible = false;
  progress = `0%`;
  uploadResult = '';
  fileName = '';
  fileSize = '';
  uploadStatus: number | undefined;
  baseUrl = environment.apiUrl;
  filesInfo: any[] = [];
  user: User | undefined;
  photo = output<Photo>()

  constructor(private http: HttpClient) {}

  onFilesSelected(event: any) {
    this.outputBoxVisible = false;
    this.uploadStatus = undefined;
    this.filesInfo = [];

    const files: FileList = event.dataTransfer?.files || event.target?.files;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileInfo = {
          name: file.name,
          size: `${(file.size / 1024).toFixed(2)} KB`,
          progress: '0%',
          status: ''
        };
        this.filesInfo.push(fileInfo);

        const formData = new FormData();
        formData.append('file', file);

        this.uploadFile(formData, fileInfo);
      }

      this.outputBoxVisible = true;
    }
  }

  uploadFile(formData: FormData, fileInfo: any) {
    this.http.post<any>(this.baseUrl + 'users/add-photo', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const progress = (event.loaded / event.total) * 100;
          fileInfo.progress = `${Math.round(progress)}%`;
        } else if (event.type === HttpEventType.Response) {
          fileInfo.status = 'Uploaded';
          this.photo.emit(event.body);
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          fileInfo.status = error.error.message;
        } else {
          fileInfo.status = 'File upload failed!';
        }
      }
    });
  }

  handleDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      const file: File = event.dataTransfer.files[0];
      this.onFilesSelected(event);
    }
  }
}
