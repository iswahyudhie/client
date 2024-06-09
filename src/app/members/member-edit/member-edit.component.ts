import { Component, HostListener, OnInit, ViewChild, viewChild } from '@angular/core';
import { AccountService } from '../../Services/account.service';
import { MembersService } from '../../Services/members.service';
import { take } from 'rxjs';
import { User } from '../../Model/user';
import { Member } from '../../Model/member';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, PhotoEditorComponent],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit {
  user: User | null = null;
  member: Member | undefined;
  editForm = viewChild.required<NgForm>('editForm');
  @HostListener('window:beforeunload',['$event'])
  unloadNotification($event: any){
    if(this.editForm().dirty){
      $event.returnValue = true;
    }
  }

  constructor(private accountService: AccountService, private memberservice: MembersService,
    private toastr: ToastrService
  ){
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: usr => this.user = usr
    })
  }
  ngOnInit(): void {
    this.LoadMember();
  }

  LoadMember(){
    if (!this.user) {
      return
    }
    this.memberservice.getMember(this.user.username).subscribe({
      next: memb => this.member = memb
    })
  }

  UpdateMember(){
    this.memberservice.updateMember(this.editForm().value).subscribe({
      next: _ => {
        this.toastr.info("Update successfully")
        this.editForm().reset(this.member);
      }
    })
  }
  


}