import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { Member } from '../../Model/member';
import { MembersService } from '../../Services/members.service';
import { ActivatedRoute } from '@angular/router';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { Message } from '../../Model/Message';
import { MessageService } from '../../Services/message.service';


@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs',{static: true}) memberTabs?: TabsetComponent;
  member: Member = {} as Member;
  memberService = inject(MembersService);
  route = inject(ActivatedRoute);
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: Message[] = [];
  private messageService = inject(MessageService);

  constructor () {
    
  }

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        if(this.member){
          for (const photo of this.member.photos) {
            this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))      
          }
        }       
      }
    })

    this.route.queryParams.subscribe({
      next: params => {
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  onUpdateMessages(event: Message){
    this.messages.push(event);
  }

  selectTab(heading: string){
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if (messageTab) {
        messageTab.active = true;
      }
    }
  }

  onTabActivated(data: TabDirective){
    this.activeTab = data;
    if (this.activeTab.heading === 'Messages' && this.messages.length === 0 && this.member) {
      this.messageService.getMessageThread(this.member.username).subscribe({
        next: messages => this.messages = messages
      })
    }
  }

  // LoadMember(){
  //   const user = this.route.snapshot.paramMap.get('username');
  //   if (!user) return;
  //   this.memberService.getMember(user).subscribe({
  //     next: user => {
  //       this.member = user
  //       this.GetImages()
  //     }
  //   });
  // }

  GetImages(){
    if(!this.member) return;
    for (const photo of this.member.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}))      
    }
  }

}
