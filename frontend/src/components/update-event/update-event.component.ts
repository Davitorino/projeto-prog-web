import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Event } from 'src/models/event.model';
import { NotificationService } from 'src/services/notification.service';
import { EventService } from 'src/services/event.service';
import { CONSTANTS } from 'src/shared/constants';

@Component({
  selector: 'app-update-event',
  templateUrl: './update-event.component.html',
  styleUrls: ['./update-event.component.css']
})
export class UpdateEventComponent implements OnInit {

  @Input() openUpdateEvent: Subject<Event>;
  @Output() eventUpdated = new EventEmitter<void>();
  
  readonly fieldEventName = CONSTANTS.FIELD_EVENT_NAME;
  destroyRef = inject(DestroyRef);
  modalVisible = false;
  event: Event;
  updateEventData: FormGroup;

  constructor(
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private eventService: EventService,
  ) {}

  public ngOnInit(): void {
    this.openUpdateEvent.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      this.event = event;
      this.initUpdateEventData();
      this.modalVisible = true;
    });
  }

  public closeModal(): void {
    this.modalVisible = false;
    this.clearUpdateEventData();
  }

  public clearUpdateEventData(): void {
    this.updateEventData.reset();
  }

  public updateEvent(): void {
    this.eventService.updateEvent(this.event._id, this.getEventData()).subscribe(() => {
      this.notificationService.success('Evento atualizado com sucesso!');
      this.eventUpdated.next();
      this.closeModal();
    });
  }

  private initUpdateEventData(): void {
    this.updateEventData = this.formBuilder.group({
      [this.fieldEventName]: [this.event.name, Validators.required],
    });
  }

  private getEventData(): Event {
    return {
      name: this.updateEventData.get(this.fieldEventName).value,
    } as Event;
  }
}

