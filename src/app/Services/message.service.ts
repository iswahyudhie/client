import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginatedResult } from '../Model/Pagination';
import { setPaginatedResponse, setPaginationHeaders } from './paginationHelper';
import { Message } from '../Model/Message';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { User } from '../Model/user';
import { Group } from '../Model/group';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubsUrl;
  private http = inject(HttpClient);
  hubConnection?: HubConnection;
  paginatedResult = signal<PaginatedResult<Message[]> | null> (null);
  messageThread = signal<Message[]>([]);

  createHubConnection(user: User, otherUser: string){
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl+'message?user='+otherUser, {accessTokenFactory: () => user.token})
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch(error => console.log(error))
    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThread.set(messages);
    });
    this.hubConnection.on('NewMessage', message => {
      this.messageThread.update(messages => [...messages, message])
    });

    this.hubConnection.on('UpdatedGroup', (group: Group) => {
      if (group.connections.some(x => x.username === otherUser)) {
        this.messageThread.update(messages => {
          messages.forEach(message => {
            if (!message.dateRead) {
              message.dateRead = new Date(Date.now());
            }
          })
          return messages;
        })
      }
    })
  }

  stopHubConnection(){
    if (this.hubConnection?.state === HubConnectionState.Connected) {
      this.hubConnection.stop().catch(error => console.log(error));
    }
  }

  getMessages(pageNumber: number, pageSize: number, container: string){
    let params = setPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container)
    return this.http.get<Message[]>(this.baseUrl + 'messages', {observe: 'response', params})
    .subscribe({
      next: response => setPaginatedResponse(response, this.paginatedResult)
    })
    
  }
  getMessageThread(username: string){
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  async sendMessage(username: string, content: string){
    return this.hubConnection?.invoke('SendMessage', {RecipientUsername : username, Content: content})
  }

  deleteMessage(id: number){
    return this.http.delete(this.baseUrl +'messages/' + id);
  }
}
