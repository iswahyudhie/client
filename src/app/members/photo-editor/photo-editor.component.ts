import { Component, input } from '@angular/core';
import { Member } from '../../Model/member';
import { UploadFormComponent } from '../upload-form/upload-form.component';
import { Photo } from '../../Model/photo';
import { MembersService } from '../../Services/members.service';
import { NgClass } from '@angular/common';
import { AccountService } from '../../Services/account.service';
import { User } from '../../Model/user';
import { take } from 'rxjs';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [UploadFormComponent, NgClass],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.css'
})
export class PhotoEditorComponent {
  member = input.required<Member>();
  user: User | null = null;

  constructor(private memberService: MembersService, private accountService: AccountService){
    accountService.currentUser$.pipe(take(1)).subscribe(usr => this.user = usr)
  }

  PhotoUpload(event: Photo){
    this.member()?.photos.push(event);
    if (event.isMain && this.user) {
      this.member().photoUrl = event.url;
      this.user.photoUrl = event.url;
      this.accountService.setCurrentUser(this.user);
    }
  }

  setMainPhoto(photo: Photo){
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user){
          this.user.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user)
          this.member().photoUrl = photo.url;
          this.member().photos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id == photo.id) p.isMain = true;
          })
        }
      }
    })
  }

  deletePhoto(photoId: number){
    this.memberService.deletePhoto(photoId).subscribe({
      next: () =>{
        this.member().photos = this.member().photos.filter(x => x.id != photoId);
      }
    })
  }

}
