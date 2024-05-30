import { Component, OnInit } from '@angular/core';
import { MembersService } from '../../Services/members.service';
import { Member } from '../../Model/member';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-member-list',
  standalone: true,
  imports: [MemberCardComponent, AsyncPipe],
  templateUrl: './member-list.component.html',
  styleUrl: './member-list.component.css'
})
export class MemberListComponent implements OnInit {
  members$: Observable<Member[]> | undefined;
  constructor( private memberService: MembersService) {
    
  }
  ngOnInit(): void {
    this.members$ = this.memberService.getMembers();
  }

}
