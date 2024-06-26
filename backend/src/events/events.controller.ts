import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/createEvent.dto';
import { UpdateEventDto } from './dto/updateEvent.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { SettleEventDto } from './dto/settleEvent.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Request() req) {
    return this.eventsService.create(createEventDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get('/closed')
  findAllClosed(@Request() req) {
    return this.eventsService.findAllClosed(req.user);
  }

  @UseGuards(AuthGuard)
  @Get('/waiting-responses')
  findAllWaitingResponses(@Request() req) {
    return this.eventsService.findAllWaitingResponses(req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.eventsService.findOne(id, req.user);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req,
  ) {
    return this.eventsService.update(id, updateEventDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.eventsService.remove(id, req.user);
  }

  @UseGuards(AuthGuard)
  @Get(':id/settle')
  bestDates(@Param('id') id: string, @Request() req) {
    return this.eventsService.dateOptions(id, req.user);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/settle')
  settleDate(
    @Param('id') id: string,
    @Body() settleEventDto: SettleEventDto,
    @Request() req,
  ) {
    return this.eventsService.settleDate(id, settleEventDto, req.user);
  }
}
