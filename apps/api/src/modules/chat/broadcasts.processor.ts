import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('broadcasts')
export class BroadcastsQueueProcessor {
  private readonly logger = new Logger(BroadcastsQueueProcessor.name);

  @Process('send')
  async process(job: Job) {
    this.logger.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
